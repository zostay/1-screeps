var Action = require('Action');

function ActionUpgradeController(nextAction, target) {
    Action.call(this);
    this.target = target;
}
ActionUpgradeController.prototype = new Action;

ActionUpgradeController.prototype.setTarget = function(target) {
    this.target = target;
}

ActionUpgradeController.prototype.sayIt = function() {
    this.creep.say('Upgrade');
}

ActionUpgradeController.prototype.jobIsDone = function() {
    return this.creep.energy == 0;
}

ActionUpgradeController.prototype.doIt = function() {
    this.creep.moveTo(target);
    this.creep.upgradeController(target);
}

module.exports = ActionUpgradeController;
