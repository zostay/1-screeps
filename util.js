module.exports = {
    gather: function(creep, returnTo, returnSay) {
        if (creep.memory.gatherFrom) {
            var gatherFrom = Game.getObjectById(creep.memory.gatherFrom);
            creep.moveTo(gatherFrom);
            if (!gatherFrom) {
                creep.memory.gatherFrom = null;
            }
            else if (gatherFrom.transferEnergy) {
                if ((gatherFrom.store && gatherFrom.store.energy == 0) || gatherFrom.energy == 0) {
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
                creep.say(returnSay);
                creep.memory.gatherFrom = null;
                creep.memory.state = returnTo;
            }
        }
        else {
            var storages = creep.room.find(FIND_MY_STRUCTURES, {
                filter: function(s) {
                    return s.structureType == STRUCTURE_STORAGE;
                }
            });

            if (storages.length) {
                creep.memory.gatherFrom = storages[0].id;
            }
            else if (Game.spawns.Home.energy >= creep.carryCapacity / 2) {
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
    },
};
