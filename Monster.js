var Chassis = require('Chassis');

function Monster() {
    this.chassis = {};
    this.cache = {};

    if (!Memory.longCache) Memory.longCache = {};

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

Monster.prototype.longCacheGet = function(id, key) {
    if (!Memory.longCache[id]) return null;
    return Memory.longCache[id][key].map(function(id) {
        return Game.getObjectById(id);
    });
}

Monster.prototype.longCacheSet = function(id, key, value) {
    if (!Memory.longCache[id]) Memory.longCache[id] = {};
    Memory.longCache[id][key] = value.map(function(obj) {
        return obj.id;
    });
}

Monster.prototype.cacheGetOrSet = function(id, key, builder) {
    var cached = this.cacheGet(id, key);
    if (cached) return cached;

    cached = builder(id, key);

    this.cacheSet(id, key, cached);
    return cached;
}

Monster.prototype.longCacheGetOrSet = function(id, key, builder) {
    var cached = this.longCacheGet(id, key);
    if (cached) return cached;

    cached = builder(id, key);

    this.longCacheSet(id, key, cached);
    return cached;
}

Monster.prototype.findStorages = function(room) {
    return this.cacheGetOrSet(room.id, 'findStorages', function() {
        return room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == STRUCTURE_STORAGE;
            }
        });
    });
}

Monster.prototype.findSources = function(room) {
    return this.longCacheGetOrSet(room.id, 'findSources', function() {
        return room.find(FIND_SOURCES);
    });
}

Monster.prototype.findConstructionSites = function(room) {
    return this.cacheGetOrSet(room.id, 'findConstructionSites', function() {
        return room.find(FIND_CONSTRUCTION_SITES);
    });
}

Monster.prototype.findRoadsNeedingRepair = function(room) {
    return this.cacheGetOrSet(room.id, 'findRoads', function() {
        return room.find(FIND_STRUCTURES, {
            filter: function(s) {
                return s.structureType == STRUCTURE_ROAD
                    && s.hits < s.hitsMax;
            }
        });
    });
}

Monster.prototype.findHostileCreeps = function(room) {
    return this.cacheGetOrSet(room.id, 'findHostileCreeps', function() {
        return room.find(FIND_HOSTILE_CREEPS);
    });
}

Monster.prototype.findStructuresNeedingEnergy = function(room) {
    return this.cacheGetOrSet(room.id, 'findStructuresNeedingEnergy', function() {
        return room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return (
                    s.structureType == STRUCTURE_EXTENSION
                    && s.energy < s.energyCapacity
                ) || (
                    s.structureType == STRUCTURE_STORAGE
                    && s.store.energy < s.storeCapacity
                );
            }
        });
    });
}

Monster.prototype.findMyCreeps = function(room) {
    return this.cacheGetOrSet(room.id, 'findMyCreeps', function() {
        return room.find(FIND_MY_CREEPS);
    });
}

Monster.prototype.findRamparts = function(room) {
    return this.cacheGetOrSet(room.id, 'findRamparts', function() {
        return room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == STRUCTURE_RAMPART
                    && s.hits < s.hitsMax;
            }
        });
    });
}

Monster.prototype.findDroppedEnergy = function(room) {
    return this.cacheGetOrSet(room.id, 'findDroppedEnergy', function() {
        return room.find(FIND_DROPPED_ENERGY);
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
