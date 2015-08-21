var Action = require('Action');

function ActionHarvest(nextAction, source) {
    Action.call(this);
    this.source = source;
}
ActionHarvest.prototype = new Action;

ActionHarvest.prototype.setSource = function(source) {
    this.source = source;
}

ActionHarvest.prototype.sayIt = function() {
    this.creep.say('Harvest');
}

ActionHarvest.prototype.jobIsDone = function() {
    return this.creep.carry.energy == this.creep.carryCapacity;
}

ActionHarvest.prototype.doIt = function() {
    this.creep.moveTo(this.source);
    this.creep.harvest(this.source);
}

module.exports = ActionHarvest;
