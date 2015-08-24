function Creeps(mon, creeps) {
    this.mon    = mon;
    this.creeps = [];

    if (creeps) {
        for (var i in creeps) {
            this.addCreep(creeps[i]);
        }
    }

    Memory[this.memoryKey] = Memory[this.memoryKey] || {};
    this.memory = Memory[this.memoryKey];
}
Creeps.prototype = new Object;

Creeps.prototype.initCreep = function (creep) {
}

Creeps.prototype.addCreep = function (creep) {
    this.initCreep(creep);
    this.creeps.push(creep);
}

Creep.prototype.checkCreepContinuity = function () {
    var idsSaved = this.memory.ids;
    var idsNow   = "";
    for (var i in this.creeps) {
        idsNow += this.creeps[i].id;
    }

    this.memory.ids = idsNow;
    return idsSaved == idsNow;
}

Creeps.prototype.doContinuityChange = function () {
}

Creeps.prototype.behave = function () {
    if (this.creeps.length && !this.checkCreepContinuity())
        this.doContinuityChange();

    for (var i in this.creeps)
        this.behaveOne(this.creeps[i]);
}

Creeps.prototype.states = {};
Creeps.prototype.states.idle = function (creep) {
    if (Game.tick % 60 == 0) {
        creep.say('Idle');
    }
}

Creeps.prototype.behaveOne = function (creep) {
    var state = creep.memory.state || 'idle';
    var handler = this.states[ state ] || function() {
        if (Game.tick % 60) == 0) {
            creep.say('Error');
        }
    };

    handle(creep);
}

module.exports = Creeps;
