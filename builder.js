module.exports = function (creep) {
    creep.memory.state = creep.memory.state || 'build';
    if (creep.memory.state == 'build') {
        if (creep.carry.energy == 0) {
            creep.say('Gather');
            creep.memory.state = 'gather';
        }
        else {
    		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (creep.room.controller.level < 2) {
                creep.moveTo(creep.room.controller);
                creep.upgradeController(creep.room.controller);
            }
    		else if(targets.length) {
    			creep.moveTo(targets[0]);
    			creep.build(targets[0]);
    		}

    		// might as well do something
            else {
                creep.moveTo(creep.room.controller);
                creep.upgradeController(creep.room.controller);
            }
        }
    }
    else {
        if (creep.memory.gatherFrom) {
            var gatherFrom = Game.getObjectById(creep.memory.gatherFrom);
            creep.moveTo(gatherFrom);
            if (gatherFrom.transferEnergy) {
                gatherFrom.transferEnergy(creep);
            }
            else {
                creep.harvest(gatherFrom);
            }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.say('Build');
                creep.memory.gatherFrom = null;
                creep.memory.state = 'build';
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
