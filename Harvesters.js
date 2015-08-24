function Harvesters(mon, creeps) {
    this.mon    = mon;
    this.creeps = [];

    if (creeps) {
        for (var i in creeps) {
            this.addCreep(creeps[i]);
        }
    }

    Memory.Harvesters = Memory.Harvesters || {};
    this.memory = Memory.Harvesters;
}
Harvesters.prototype = new Object;

Harvesters.prototype.addCreep = function (creep) {
	var sources = this.mon.findSources(creep.room);
    creep.memory.role   = 'harvester';
    creep.memory.state  = creep.memory.state || 'harvest';
    creep.memory.source = creep.memory.source || sources[creep.memory.index % sources.length].id;
    this.creeps.push(creep);
}

Harvesters.prototype.checkCreepContinuity = function () {
    var idsSaved = this.memory.ids;
    var idsNow   = "";
    for (var i in this.creeps) {
        idsNow += this.creeps[i].id;
    }

    this.memory.ids = idsNow;
    return idsSaved == idsNow;
}

Harvesters.prototype.assignSources = function () {
    var room = this.creeps[0].room;
    room.memory.sources = room.memory.sources || {};
    var memory = room.memory.sources;

    var sources = this.mon.findSources(room);
    var i = 0;
    for (var n in sources) {
        var source = sources[n];
        memory[ source.id ] = memory[ source.id ] || {};
        memory[ source.id ].count = memory[ source.id ].count || 3;
        var count = memory[ source.id ].count;
        var start = i;
        for (; i < start+count; i++) {
            if (i >= this.creeps.length) return;
            this.creeps[i].source = source.id;
        }
    }
}

Harvesters.prototype.behave = function () {
    if (this.creeps.length && !this.checkCreepContinuity())
        this.assignSources();

    for (var i in this.creeps)
        this.behaveOne(this.creeps[i]);
}

Harvesters.prototype.behaveOne = function (creep) {
    if (creep.memory.state == 'harvest')
        this.harvest(creep);
    else
        this.deliver(creep);
}

Harvesters.prototype.harvest = function (creep) {
    var mySource = Game.getObjectById(creep.memory.source);

	if (creep.carry.energy < creep.carryCapacity) {
		creep.moveTo(mySource);
		creep.harvest(mySource);
	}
    else {
        creep.say("Deliver");
        creep.memory.state = 'deliver';
    }
}

Harvesters.prototype.deliver = function (creep) {
    if (creep.carry.energy == 0) {
        creep.say("Harvest");
        creep.memory.state = 'harvest';
    }
    else {
        var storages = this.mon.findStructuresNeedingEnergy(creep.room);
        storages.sort(function(a, b) {
            var needA = a.energyCapacity ? a.energyCapacity - a.energy : a.storeCapacity - a.store.energy;
            var needB = b.energyCapacity ? b.energyCapacity - b.energy : b.storeCapacity - b.store.energy;
            return needB - needA;
        });

        if (storages.length) {
            creep.moveTo(storages[0]);
            creep.transferEnergy(storages[0]);
        }
        else {
            creep.moveTo(Game.spawns.Home);
            creep.transferEnergy(Game.spawns.Home)
        }
    }
}

module.exports = Harvesters;
