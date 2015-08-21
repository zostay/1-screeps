var Action = require('Action');

function ActionHarvest(dest) {
    Action.call(this);
    this.destination = dest;
}
ActionHarvest.prototype = new Action;

ActionHarvest.prototype.setDestination = function(dest) {
    this.destination = dest;
}

ActionHarvest.prototype.sayIt = function() {
    this.creep.say('Deliver');
}

ActionHarvest.prototype.jobIsDone = function() {
    return this.creep.carry.energy == 0;
}

ActionHarvest.prototype.doIt = function() {
    this.creep.moveTo(this.destination);
    this.creep.transferEnergy(this.destination)
}

module.exports = ActionHarvest;
