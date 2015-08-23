function Harvesters(mon, creeps) {
    this.mon    = mon;
    this.creeps = [];

    if (creeps) {
        for (var i in creeps) {
            this.addCreep(creeps[i]);
        }
    }
}
Harvesters.prototype = new Object;

Harvesters.prototype.addCreep = function (creep) {
    creep.memory.role  = 'harvester';
    creep.memory.state = creep.memory.state || 'harvest';
    this.creeps.push(creep);
}

Harvesters.prototype.behave = function () {
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
	var sources = mon.findSources(creep.room);
    var mySource = sources[creep.memory.index % sources.length];

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
        var storages = mon.findStructuresNeedingEnergy(creep.room);
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
