function Action() {
    this.creep      = null;
    this.nextAction = null;
}
Action.prototype = new Object;

Action.prototype.setCreep      = function(creep)      { this.creep      = creep }
Action.prototype.setNextAction = function(nextAction) { this.nextAction = nextAction }

Action.prototype.work = function(creep) {
    this.setCreep(creep);

    if (this.jobIsDone()) {
        if (this.nextAction) this.nextAction.sayIt();
        return this.nextAction;
    }

    this.doIt();

    return this;
}

module.exports = Action;
