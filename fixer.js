module.exports = function (creep) {
    creep.memory.state = creep.memory.state || 'repair';
    if (creep.memory.state == 'repair') {
        if (creep.carry.energy == 0) {
            creep.say('Gather');
            creep.memory.state = 'gather';
        }
        else {
    		var fixables = creep.room.find(FIND_STRUCTURES, {
                filter: function(s) {
                    return s.structureType == STRUCTURE_ROAD
                        && s.hits < s.hitsMax;
                }
            });

    		if (fixables.length) {
    			creep.moveTo(fixables[0]);
    			creep.repair(fixables[0]);
    		}

    		// might as well do something
            // else {
            //     creep.moveTo(creep.room.controller);
            //     creep.upgradeController(creep.room.controller);
            // }
        }
    }
    else {
        if (creep.memory.gatherFrom) {
            var gatherFrom = Game.getObjectById(creep.memory.gatherFrom);
            creep.moveTo(gatherFrom);
            if (!gatherFrom) {
                creep.memory.gatherFrom = null;
            }
            else if (gatherFrom.transferEnergy) {
                if (gatherFrom.energy == 0) {
                    creep.memory.gatherFrom = null;
                }
                else {
                    gatherFrom.transferEnergy(creep);
                }
            }
            else {
                if (gatherFrom.energy < 100) {
                    creep.memory.gatherFrom = null;
                }
                else {
                    creep.harvest(gatherFrom);
                }
            }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.say('Repair');
                creep.memory.gatherFrom = null;
                creep.memory.state = 'repair';
            }
        }
        else {
            if (Game.spawns.Home.energy >= creep.carryCapacity / 2) {
                creep.memory.gatherFrom = Game.spawns.Home.id;
            }
            else {
                var sources = creep.room.find(FIND_SOURCES, {
                    filter: function(s) {
                        return s.energy > 100;
                    }
                });

                if (sources.length) {
                    creep.memory.gatherFrom = sources[0].id;
                }
            }
        }
    }
}
