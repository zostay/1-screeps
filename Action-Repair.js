var Action = require('Action');

function ActionRepair(nextAction, target) {
    Action.call(this);
    this.target = target;
}
ActionRepair.prototype = new Action;

ActionRepair.prototype.setTarget = function(target) {
    this.target = target;
}

ActionRepair.prototype.sayIt = function() {
    this.creep.say('Repair');
}

ActionRepair.prototype.jobIsDone = function() {
    return this.target.hits == this.target.hitsMax
        || this.creep.energy == 0;
}

ActionRepair.prototype.doIt = function() {
    this.creep.moveTo(target);
    this.creep.repair(target);
}

module.exports = ActionRepair;
