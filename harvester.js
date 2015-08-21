var ActionHarvest = require('Action-Harvest');
var ActionDeliver = require('Action-Deliver');

module.exports = function (mon, creep) {
    creep.memory.state = creep.memory.state || 'harvest';

    var harvest = new ActionHarvest(null);
    harvest.setNextAction(deliver);
    harvest.setCreep(creep);

    var deliver = new ActionDeliver(null);
    deliver.setNextAction(harvest);
    deliver.setCreep(creep);

    var action = harvest.jobIsDone() ? deliver : harvest;

    if (action.setSource) {
		var sources = mon.findSources(creep.room);
        var mySource = sources[creep.memory.index % sources.length];

        action.setSource(mySource);
    }
    else if (action.setDestination) {
        var storages = mon.findStructuresNeedingEnergy(creep.room);
        storages.sort(function(a, b) {
            var needA = a.energyCapacity ? a.energyCapacity - a.energy : a.storeCapacity - a.store.energy;
            var needB = b.energyCapacity ? b.energyCapacity - b.energy : b.storeCapacity - b.store.energy;
            return needB - needA;
        });

        if (storages.length) {
            action.setDestination(storages[0]);
        }
        else {
            action.setDestination(Game.spawns.Home);
        }
    }

    action = action.work();
}
