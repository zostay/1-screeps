var Chassis = require('Chassis');

function Monster() {
    this.chassis = {};
    return this;
}
Monster.prototype = new Object;

Monster.prototype.addChassis = function(name, body) {
    this.chassis[name] = new Chassis(name, body);
}

Monster.prototype.run = function() {
    var builder   = require('builder');
    var courier   = require('courier');
    var fixer     = require('fixer');
    var guard     = require('guard');
    var harvester = require('harvester');
    var healer    = require('healer');
    var keeper    = require('keeper');
    var spawner   = require('spawner');

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
        spawner(this, Game.spawns[name]);
    }
}

module.exports = Monster;