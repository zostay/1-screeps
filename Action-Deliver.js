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
    creep.say('Deliver');
}

ActionHarvest.prototype.jobIsDone = function() {
    return creep.carry.energy == 0;
}

ActionHarvest.prototype.doIt = function() {
    creep.moveTo(this.destination);
    creep.transferEnergy(this.destination)
}

module.exports = ActionHarvest;
