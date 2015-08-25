var util = require('util');
var Creeps = require('Creeps');

function Tankers(mon, creeps) {
    this.memoryKey  = 'Tankers';
    this.nullSource = false;
    this.nullTarget = false;
    Creeps.call(this, mon, creeps);
}
Tankers.prototype = new Creeps;

Tankers.prototype.initCreep = function (creep) {
    creep.memory.role   = 'tanker';
    creep.memory.state  = creep.memory.state || 'gather';

    // TODO Do I want to do this or is this taken care of by gather already?
    // creep.memory.source = creep.memory.source || null;
    // if (!creep.memory.source) this.memory.nullSource = true;

    creep.memory.target = creep.memory.target || null;
    if ((creep.memory.state == 'deliver' || creep.memory.state == 'idle') && !creep.memory.target)
        this.memory.nullTarget = true;
}

Tankers.prototype.listTargets = function (creep, n) {
    if (n == 0) {
        return this.listSpawns(creep);
    }
    else if (n == 1) {
        return this.listExtensions(creep);
    }
    else if (n == 2) {
        return this.listWorkers(creep);
    }
    else {
        return null;
    }
}

Tankers.prototype.listSpawns = function (creep) {
    var distance = [];
    var spawns = this.mon.findSpawnsNeedingEnergy(creep.room);
    spawns.forEach(function (s) {
        distance[ s.id ] = util.crowDistance(creep.pos, s.pos);
    });
    spawns.sort(function(a, b) {
        var needA = a.energyCapacity - a.energy;
        var needB = b.energyCapacity - b.energy;
        return needB - needA || distance[a.id] - distance[b.id];
    });
    return spawns;
}

Tankers.prototype.listExtensions = function (creep) {
    var distance = [];
    var storages = this.mon.findExtensionsNeedingEnergy(creep.room);
    storages.forEach(function (s) {
        distance[ s.id ] = util.crowDistance(creep.pos, s.pos);
    });
    storages.sort(function(a, b) {
        var needA = a.energyCapacity - a.energy;
        var needB = b.energyCapacity - b.energy;
        return needB - needA || distance[a.id] - distance[b.id];
    });
    return storages;
}

Tankers.prototype.listCreeps = function (creep) {
    var distance = [];
    var creeps = mon.findMyCreeps(creep.room).filter(
        function (c) {
            distance[ c.id ] = util.crowDistance(creep.pos, c.pos);
            return (
                c.memory.role == 'builder'
                || c.memory.role == 'keeper'
            )
            && c.carry.energy < c.carryCapacity
            && c.carry.energy > 5; // they aren't gathering yet
        }
    );
    creeps.sort(function(a, b) {
        var needA = a.carryCapacity - a.carry.energy;
        var needB = b.carryCapacity - b.carry.energy;
        return distance[a.id] - distance[b.id] || needB - needA;
    });

    return creeps;
}

Tankers.prototype.assignTargets = function () {
    if (!this.creeps.length) return;

    console.log('Tankers: Assigning Targets');

    var iteration = 0;
    var targets = null;
    var triedSecondary = false;
    var i = 0;
    for (var n in this.creeps) {
        var creep = creeps[n];
        if (creep.memory.target) continue;

        if (!targets || targets.length == 0)
            targets = this.listTargets(creeps[0].room, iteration++);

        if (!targets) {
            creep.memory.target = null;
            creep.memory.state  = 'idle';
        }
        else {
            creep.memory.target = targets.shift();
            creep.memory.state  = 'deliver';
        }
    }
}

Tankers.prototype.behave = function () {
    if (this.memory.nullTarget) {
        this.assignTargets();
    }

    Creeps.prototype.behave.call(this);
}

Tankers.prototype.states = Object.create(Creeps.prototype.states);
Tankers.prototype.states.deliver = function (creep) {
    if (creep.carry.energy == 0) {
        creep.say("Gather");
        creep.memory.target = null;
        creep.memory.state = 'gather';
    }
    else {
        if (!creep.memory.target) {
            creep.memory.state = 'idle';
        }
        else {
            var targetObj = Game.getObjectById(creep.memory.target);

            if (!targetObj) {
                creep.memory.target = null;
                creep.memory.state = 'idle';
            }
            else {
                creep.moveTo(targetObj);
                creep.transferEnergy(targetObj);
            }
        }
    }
}

Tankers.prototype.states.gather = function (creep) {
    util.gather(this.mon, creep, 'deliver', 'Deliver');
}

module.exports = Tankers;
