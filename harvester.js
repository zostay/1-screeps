module.exports = function (creep) {

	if(creep.carry.energy < creep.carryCapacity) {
		var sources = creep.room.find(FIND_SOURCES);
		creep.moveTo(sources[creep.memory.nameIndex]);
		creep.harvest(sources[creep.memory.nameIndex]);
	}
	else {
		creep.moveTo(Game.spawns.Home);
		creep.transferEnergy(Game.spawns.Home)
	}
}
