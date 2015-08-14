module.exports = function (creep) {
    creep.memory.state = creep.memory.state || 'harvest';
    if (creep.memory.state == 'harvest') {
    	if (creep.carry.energy < creep.carryCapacity) {
    		var sources = creep.room.find(FIND_SOURCES, {
                filter: function(s) {
                    return s.energy > 100;
                }
            });

            if (sources.length) {
        		creep.moveTo(sources[0]);
        		creep.harvest(sources[0]);
            }
    	}
        else {
            creep.say("Deliver");
            creep.memory.state = 'deliver';
        }
    }
	else {
        if (creep.carry.energy == 0) {
            creep.say("Harvest");
            creep.memory.state = 'harvest';
        }
        else {
            var storages = creep.room.find(FIND_MY_STRUCTURES, {
                filter: function(s) {
                    return (
                        s.structureType == STRUCTURE_EXTENSION
                        && s.energy < s.energyCapacity
                    ) || (
                        s.structureType == STRUCTURE_STORAGE
                        && s.store < s.storeCapacity
                    );
                }
            }).sort(function(a, b) {
                var needA = a.energyCapacity ? a.energyCapacity - a.energy : a.storeCapacity - a.store;
                var needB = b.energyCapacity ? b.energyCapacity - b.energy : b.storeCapacity - b.store;
                return needB - needA;
            });

            if (storages.length) {
                creep.moveTo(storages[0]);
                creep.transferEnergy(storages[0]);
            }
            else {
        		creep.moveTo(Game.spawns.Home);
        		creep.transferEnergy(Game.spawns.Home)
            }
        }
	}
}
