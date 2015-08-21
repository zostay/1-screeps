var Action = require('Action');

function ActionGather(nextAction, source) {
    Action.call(this);
    this.source = source;
}
ActionGather.prototype = new Action;

ActionGather.prototype.setSource = function(source) {
    this.source = source;
}

ActionGather.prototype.sayIt = function() {
    this.creep.say('Gather');
}

ActionGather.prototype.jobIsDone = function() {
    return (this.source.store && this.source.store.energy == 0)
        || (this.source.energy == 0)
        || (this.creep.carry.energy == this.creep.carryCapacity);
}

ActionGather.prototype.doIt = function() {
    this.creep.moveTo(this.source);
    if (this.source.transferEnergy) {
        this.source.transferEnergy(creep);
    }

    // This should go away once action-refactor is complete
    else if (this.source instanceof Energy) {
        this.creep.pickup(this.source);
    }

    // This should also go away once action-refactor is complete
    else {
        creep.harvest(this.source);
    }
}

module.exports = ActionGather;
