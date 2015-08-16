var builder   = require('builder');
var courier   = require('courier');
var fixer     = require('fixer');
var guard     = require('guard');
var harvester = require('harvester');
var healer    = require('healer');
var keeper    = require('keeper');
var spawner   = require('spawner');

var Chassis = require('Chassis');

var workerChassis  = new Chassis('Worker',  [ WORK,  CARRY ]);
var courierChassis = new Chassis('Courier', [ CARRY, CARRY ]);
var soldierChassis = new Chassis('Soldier', [ TOUGH, ATTACK ]);

for (var name in Game.creeps) {
	var creep = Game.creeps[name];

	if (creep.memory.role == 'builder')
	    builder(creep);
    if (creep.memory.role == 'courier')
        courier(creep);
    if (creep.memory.role == 'fixer')
        fixer(creep);
	if (creep.memory.role == 'harvester')
		harvester(creep);
	if (creep.memory.role == 'healer')
        healer(creep);
    if (creep.memory.role == 'keeper')
        keeper(creep);
	if (creep.memory.role == 'guard')
	    guard(creep);
}

for (var name in Game.spawns) {
    spawner(Game.spawns[name]);
}
