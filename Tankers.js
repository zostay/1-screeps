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

Tankers.prototype.listTargets = function (room, n) {
    if (n == 0) {
        return this.listSpawns(room);
    }
    else if (n == 1) {
        return this.listExtensions(room);
    }
    else if (n == 2) {
        return this.listWorkers(room);
    }
    else {
        return null;
    }
}

Tankers.prototype.listSpawns = function (room) {
    return this.mon.findSpawnsNeedingEnergy(room);
}

Tankers.prototype.listExtensions = function (room) {
    return this.mon.findExtensionsNeedingEnergy(room);
}

Tankers.prototype.listCreeps = function (room) {
    var creeps = mon.findMyCreeps(room).filter(
        function (c) {
            return (
                c.memory.role == 'builder'
                || c.memory.role == 'keeper'
            )
            && c.carry.energy < c.carryCapacity
            && c.carry.energy > 5; // they aren't gathering yet
        }
    );

    return creeps;
}

Tankers.prototype.assignTargets = function () {
    if (!this.creeps.length) return;

    console.log('Tankers: Assigning Targets');

    function sortByDistance(list, creep) {
        var distance   = {};
        var energyNeed = {};
        list.forEach(function (t) {
            distance[ t.id ] = util.crowDistance(creep.pos, t.pos);
            if (t.carry)
                energyNeed[ t.id ] = t.carryCapacity - t.carry.energy;
            else
                energyNeed[ t.id ] = t.energyCapacity - t.energy;
        });
        list.sort(function(a, b) {
            return   distance[a.id] - distance[b.id]
                || energyNeed[b.id] - energyNeed[a.id]
        });
    }

    var iteration = 0;
    var targets = this.listTargets(this.creeps[0].room, iteration++);
    var triedSecondary = false;
    var i = 0;
    for (var n in this.creeps) {
        var creep = this.creeps[n];
        if (creep.carry.energy == 0) continue;
        if (creep.memory.target) continue;

        while (targets.length == 0) {
            targets = this.listTargets(creep.room, iteration++);
            if (targets === null) break;
        }

        if (!targets || !targets.length) {
            creep.memory.target = null;
            creep.memory.state  = 'idle';
        }
        else {
            sortByDistance(targets, creep);

            creep.memory.target = targets.shift().id;
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
                var r = creep.transferEnergy(targetObj);
                if (r == OK)
                    creep.memory.target = null
            }
        }
    }
}

Tankers.prototype.states.gather = function (creep) {
    util.gather(this.mon, creep, 'deliver', 'Deliver');
}

module.exports = Tankers;
