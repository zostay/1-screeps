var ActionRepair            = require('Action-Repair');
var ActionGather            = require('Action-Gather');
var ActionUpgradeController = require('Action-UpgradeController');
var util                    = require('util');

module.exports = function (mon, creep) {
	var fixables = mon.findRoadsNeedingRepair(creep.room);

    var repair  = new ActionRepair(null, fixables[0]);
    var gather  = new ActionGather(null, util.bestSource(mon, creep));
    var upgrade = new ActionUpgradeController(null);

    repair.setNextAction(gather);
    gather.setNextAction(repair);
    upgrade.setNextAction(gather);

    var action = creep.carry.energy == 0 ? gather
               : fixables.length    == 0 ? upgrade
               :                           repair;

    action.work(creep);
}
