module.exports = function (creep) {

	if(creep.carry.energy < creep.carryCapacity) {
		var sources = creep.room.find(FIND_SOURCES);
		creep.moveTo(sources[0]);
		creep.harvest(sources[0]);
	}
	else {
		creep.moveTo(Game.spawns.Home);
		creep.transferEnergy(Game.spawns.Home)
	}
}
