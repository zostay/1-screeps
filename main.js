var builder = require('builder');
var guard = require('guard');
var harvester = require('harvester');
var healer = require('healer')
var spawner = require('spawner');

for (var name in Game.creeps) {
	var creep = Game.creeps[name];

	if(creep.memory.role == 'harvester') {
		harvester(creep);
	}

	if(creep.memory.role == 'builder') {
	    builder(creep);
	}

	if (creep.memory.role == 'healer') {
        healer(creep);
	}

	if(creep.memory.role == 'guard') {
	    guard(creep);
	}
}

for (var name in Game.spawns) {
    spawner(Game.spawns[name]);
}
