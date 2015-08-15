module.exports = function (creep) {
    creep.memory.state = creep.memory.state || 'pickup';
    if (creep.memory.state == 'pickup') {
    	if (creep.carry.energy < creep.carryCapacity) {
    		var storages = creep.room.find(FIND_MY_STRUCTURES, {
                filter: function(s) {
                    return s.structureType == STRUCTURE_STORAGE;
                }
            });

            if (storages.length) {
        		creep.moveTo(storages[0]);
                storages[0].transferEnergy(storages[0]);
            }
    	}
        else {
            creep.say("Deliver");
            creep.memory.state = 'deliver';
        }
    }
	else {
        if (creep.carry.energy == 0) {
            creep.say("Pickup");
            creep.memory.state = 'pickup';
        }
        else {
            var storages = creep.room.find(FIND_MY_STRUCTURES, {
                filter: function(s) {
                    return s.structureType == STRUCTURE_EXTENSION
                        && s.energy < s.energyCapacity;
                }
            })
            storages.sort(function(a, b) {
                var needA = s.energyCapacity - s.energy;
                var needB = s.energyCapacity - s.energy;
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
