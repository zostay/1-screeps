var util = require('util');
var Creeps = require('Creeps');

function Keepers(mon, creeps) {
    this.memoryKey = 'Keepers';
    Creeps.call(this, mon, creeps);
}
Keepers.prototype = new Creeps;

Keepers.prototype.initCreep = function (creep) {
    creep.memory.role    = 'keeper';
    creep.memory.state   = creep.memory.state   || 'repair';
    creep.memory.target  = creep.memory.target  || null;
    creep.memory.repairs = creep.memory.repairs || 0;
}

Keepers.prototype.states.repair = function (creep) {
	var ramparts = this.mon.findRamparts(creep.room);

    var minHits = 100000000;
    for (var i in ramparts) {
        minHits = Math.min(ramparts[i].hits, minHits);
    }

    if (!ramparts.length) {
        if (Game.time % 60 == 0) {
            creep.say('Idle');
        }
        return;
    }

    if (creep.carry.energy == 0) {
        creep.say('Gather');
        creep.memory.state = 'gather';
    }
    else if (creep.memory.rampartTarget) {
        var rampartTarget = Game.getObjectById(creep.memory.rampartTarget);
        if (!creep.memory.repairsRemain) creep.memory.repairsRemain = 0;

        creep.moveTo(rampartTarget);
        var r = creep.repair(rampartTarget);

        if (r == OK)
            creep.memory.repairsRemain--;

        if (creep.memory.repairsRemain <= 0)
            creep.memory.rampartTarget = null;

        if (rampartTarget.hits == rampartTarget.hitsMax)
            creep.memory.rampartTarget = null;

        if (minHits < 700 && rampartTarget.hits >= 1000)
            creep.memory.rampartTarget = null;
    }
    else {

        // emergency
        if (minHits < 700) {
            for (var i in ramparts) {
                if (ramparts[i].hits < 700) {
                    creep.say('Weak');
                    creep.memory.rampartTarget = ramparts[i].id;
                    creep.memory.repairsRemain = 10;
                    return;
                }
            }
        }

        // build-up
        else {
            for (var i in ramparts) {
                if (ramparts[i].hits == minHits) {
                    creep.say('Strong');
                    creep.memory.rampartTarget = ramparts[i].id;
                    creep.memory.repairsRemain = 100;
                    return;
                }
            }
        }
    }
}

Keepers.prototype.states.gather = function (creep) {
    util.gather(this.mon, creep, 'repair', 'Keep');
}

module.exports = Keepers;
