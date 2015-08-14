module.exports = function (creep) {
	if (creep.carry.energy == 0) {
        if (Game.spawns.Home.energy > creep.carryCapacity / 2) {
    		creep.moveTo(Game.spawns.Home);
    		Game.spawns.Home.transferEnergy(creep);
        }
        else {
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
