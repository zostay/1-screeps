var Chassis = require('Chassis');

function Monster() {
    this.chassis = {};
    this.cache = {};
    return this;
}
Monster.prototype = new Object;

Monster.prototype.addChassis = function(name, body) {
    this.chassis[name] = new Chassis(name, body);
}

Monster.prototype.cacheGet = function(id, key) {
    if (!this.cache[id]) return null;
    return this.cache[id][key];
}

Monster.prototype.cacheSet = function(id, key, value) {
    if (!this.cache[id]) this.cache[id] = {};
    this.cache[id][key] = value;
}

Monster.prototype.cacheGetOrSet = function(id, key, builder) {
    var cached = this.cacheGet(id, key);
    if (cached) return cached;

    cached = builder(id, key);

    this.cacheSet(id, key, cached);
    return cached;
}

Monster.prototype.findStorages = function(room) {
    return this.cacheSetOrGet(room.id, 'findStorages', function() {
        return room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == STRUCTURE_STORAGE;
            }
        });
    });
}

Monster.prototype.findSources = function(room) {
    return this.cacheSetOrGet(room.id, 'findSources', function() {
        return creep.room.find(FIND_SOURCES);
    });
}

Monster.prototype.run = function() {
    var builder   = require('builder');
    var fixer     = require('fixer');
    var guard     = require('guard');
    var harvester = require('harvester');
    var healer    = require('healer');
    var keeper    = require('keeper');
    var spawner   = require('spawner');
    var tanker    = require('tanker');

    for (var name in Game.creeps) {
    	var creep = Game.creeps[name];

    	if (creep.memory.role == 'builder')
    	    builder(this, creep);
        if (creep.memory.role == 'fixer')
            fixer(this, creep);
    	if (creep.memory.role == 'guard')
    	    guard(this, creep);
    	if (creep.memory.role == 'harvester')
    		harvester(this, creep);
    	if (creep.memory.role == 'healer')
            healer(this, creep);
        if (creep.memory.role == 'keeper')
            keeper(this, creep);
        if (creep.memory.role == 'tanker')
            tanker(this, creep);
    }

    for (var name in Game.spawns) {
        spawner(this, Game.spawns[name]);
    }
}

module.exports = Monster;
