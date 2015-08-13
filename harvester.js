module.exports = function (creep) {
	if(creep.carry.energy < creep.carryCapacity) {
		var sources = creep.room.find(FIND_SOURCES);
		creep.moveTo(sources[0]);
		creep.harvest(sources[0]);
	}
	else {
        if (Game.spawns.Home.energy == Game.spawns.Home.energyCapacity) {
            var storages = creep.room.find(FIND_MY_STRUCTURES, {
                filter: function(s) {
                    return s.structureType == STRUCTURE_EXTENSION
                        && s.energy < s.energyCapacity;
                }
            });

            creep.moveTo(storages[0]);
            creep.transferEnergy(storages[0]);
        }
        else {
    		creep.moveTo(Game.spawns.Home);
    		creep.transferEnergy(Game.spawns.Home)
        }
	}
}
