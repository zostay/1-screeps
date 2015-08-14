module.exports = function (creep) {
    creep.memory.state = creep.memory.state || 'repair';

    if (creep.memory.state == 'repair') {
    	var ramparts = creep.room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == STRUCTURE_RAMPART
                    && s.hits < s.hitsMax;
            }
        });

        var minHits = 1000000;
        for (var i in ramparts) {
            minHits = Math.min(ramparts[i].hits, minHits);
        }

        if (!ramparts.length) {
            if (Game.time % 60 == 0) {
                creep.say('Idle');
            }
            return;
        }

        if (creep.carry.energy == 0) {
            creep.say('Gather');
            creep.memory.state = 'gather';
        }
        else if (creep.memory.rampartTarget) {
            var rampartTarget = Game.getObjectById(creep.memory.rampartTarget);
            if (!creep.memory.repairsRemain) creep.memory.repairsRemain = 0;

            creep.moveTo(rampartTarget);
            var r = creep.repair(rampartTarget);

            if (r == OK)
                creep.memory.repairsRemain--;

            if (creep.memory.repairsRemain <= 0)
                creep.memory.rampartTarget = null;

            if (rampartTarget.hits == rampartTarget.hitsMax)
                creep.memory.rampartTarget = null;

            if (minHits < 700 && rampartTarget.hits >= 1000)
                creep.memory.rampartTarget = null;
        }
        else {
            // emergency
            if (minHits < 700) {
                for (var i in ramparts) {
                    if (ramparts[i].hits < 700) {
                        creep.say('Weak');
                        creep.memory.rampartTarget = ramparts[i].id;
                        creep.memory.repairsRemain = 10;
                        return;
                    }
                }
            }

            // build-up
            else {
                for (var i in ramparts) {
                    if (ramparts[i].hits == minHits) {
                        creep.say('Strong');
                        creep.memory.rampartTarget = ramparts[i].id;
                        creep.memory.repairsRemain = 100;
                        return;
                    }
                }
            }
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
                creep.say('Keep');
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
