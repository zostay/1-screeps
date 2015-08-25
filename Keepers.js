var util = require('util');
var Creeps = require('Creeps');

function Keepers(mon, creeps) {
    this.memoryKey  = 'Keepers';
    this.nullTarget = false;
    Creeps.call(this, mon, creeps);
}
Keepers.prototype = new Creeps;

Keepers.prototype.initCreep = function (creep) {
    creep.memory.role    = 'keeper';
    creep.memory.state   = creep.memory.state   || 'repair';
    if (!creep.memory.target) {
        this.nullTarget = true;
        creep.memory.target = null;
    }
}

Keepers.prototype.assignTargets = function () {
    if (!this.creeps.length) return;

    console.log('Keepers: Assigning Targets');

    var currentTargets = {};
    var assignedCreeps = {};
    for (var n in this.creeps) {
        var creep = this.creeps[n];
        currentTargets[ creep.memory.target ] = n;
    }

	var ramparts = this.mon.findRamparts(this.creeps[0].room);
    ramparts.sort(function (a, b) {
        return a.hits - b.hits;
    });
    ramparts = ramparts.slice(0, this.creeps.length);

    if (!ramparts.length) return;
    this.memory.iterations = Math.round(Math.max(10, 50*Math.log10(ramparts[0].hits)));

    for (var i in ramparts) {
        var rampart = ramparts[i];
        var creep = currentTargets[ rampart.id ];
        if (creep) {
            delete currentTargets[ rampart.id ];
            ramparts[i] = null;
        }
    }

    for (var i in ramparts) {
        if (!ramparts[i]) continue;
        var firstReplacement = Object.keys(currentTargets)[0];
        var n = currentTargets[ firstReplacement ];
        delete currentTargets[ firstReplacement ];
        this.creeps[n].memory.target = ramparts[i].id;
        this.creeps[n].say('Next');
    }
}

Keepers.prototype.behave = function () {
    var iterations = this.memory.iterations || 10;
    if ((Game.time + 3) % iterations == 0 || this.nullTarget) {
        this.assignTargets();
    }

    Creeps.prototype.behave.call(this);
}

Keepers.prototype.states.repair = function (creep) {
    if (creep.carry.energy == 0) {
        creep.say('Gather');
        creep.memory.state = 'gather';
    }
    else if (creep.memory.target) {
        var rampartTarget = Game.getObjectById(creep.memory.target);

        if (rampartTarget) {
            creep.moveTo(rampartTarget);
            creep.repair(rampartTarget);
        }
        else {
            creep.memory.target = null;
        }
    }
}

Keepers.prototype.states.gather = function (creep) {
    util.gather(this.mon, creep, 'repair', 'Keep');
}

module.exports = Keepers;
