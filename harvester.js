module.exports = function (creep) {
    creep.memory.state = creep.memory.state || 'harvest';

    if (creep.memory.state == 'harvest') {
        if (creep.memory.pullFrom) {
            var pullFrom = Game.getObjectById(creep.memory.pullFrom);

        	if (creep.carry.energy < creep.carryCapacity) {
        		creep.moveTo(pullFrom);
        		creep.harvest(pullFrom);
        	}
            else {
                creep.say("Deliver");
                creep.memory.state = 'deliver';
                creep.memory.pullFrom = null;
            }
        }
        else {
            if (!Memory.sources) Memory.sources = [];

    		var sources = creep.room.find(FIND_SOURCES);
            var minPuller, minPulled = 1000;
            for (var i in sources) {
                if (!Memory.sources[ sources[i].id ])
                    Memory.sources[ sources[i].id ] = { pullers: 0 };

                if (Memory.sources[ sources[i].id ].pullers < minPulled) {
                    minPulled = Memory.sources[ sources[i].id ].pullers;
                    minPuller = sources[i].id;
                }
            }

            Memory.sources[ minPuller ].pullers++;
            creep.memory.pullFrom(minPuller);
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
                        && s.store.energy < s.storeCapacity
                    );
                }
            })
            storages.sort(function(a, b) {
                var needA = a.energyCapacity ? a.energyCapacity - a.energy : a.storeCapacity - a.store.energy;
                var needB = b.energyCapacity ? b.energyCapacity - b.energy : b.storeCapacity - b.store.energy;
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
