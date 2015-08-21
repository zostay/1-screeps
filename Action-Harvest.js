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
    creep.say('Harvest');
}

ActionHarvest.prototype.jobIsDone = function() {
    return creep.carry.energy == creep.carryCapacity;
}

ActionHarvest.prototype.doIt = function() {
    this.creep.moveTo(this.source);
    this.creep.harvest(this.source);
}

module.exports = ActionHarvest;
