function findNameByRole(spawn, role) {
    var index = 0;
    var creeps = Game.creeps;
    while (creeps[ spawn.room.name + 'X' + role + 'X' + index ]) index++;
    return spawn.room.name + 'X' + role + 'X' + index;
}

function spawnByRole(spawn, creeps, role, parts) {
    var name = findNameByRole(spawn, role);
    console.log("Spawning " + role + ": " + name);
    return spawn.createCreep(parts, name, { role: role }) == name;
}

function countInQueue(spawn, role) {
    var inQueue = 0;
    for (var i in spawn.memory.queue) {
        var creepSpec = spawn.memory.queue[i];
        if (creepSpec[0] == role) inQueue++;
    }
    return inQueue;
}

function checkCreepSupply(spawn, all, creeps, role, count, parts) {
    if (!spawn.memory.queue) spawn.memory.queue = [];
    var inRoom  = creeps[role] ? creeps[role].length : 0;
    var inQueue = countInQueue(spawn, role);
    while (inRoom + inQueue < count) {
        spawn.memory.queue.push([ role, parts ]);
        inQueue++;
    }
}

var LIFETIME = 1500;
function spawnCreepEvery(spawn, creeps, role, ticks, parts) {
    if (Game.time % ticks == 0 && countInQueue(spawn, role) == 0) {
        if (!spawn.memory.queue) spawn.memory.queue = [];
        spawn.memory.queue.push([ role, parts ]);
    }
}

function spawnFromQueue(spawn, creeps) {
    if (!spawn.memory.queue) return;
    if (!spawn.memory.queue.length) return;

    if (spawnByRole(spawn, creeps, spawn.memory.queue[0][0], spawn.memory.queue[0][1])) {
        spawn.memory.queue.shift();
    }
}

var HARVESTER_BODY   = [ WORK, CARRY, MOVE, MOVE ];
var BUILDER_BODY     = [ WORK, CARRY, MOVE, MOVE ];
var BIG_BUILDER_BODY = [ WORK, WORK, CARRY, CARRY, MOVE, MOVE ];
var GUARD_BODY       = [ TOUGH, ATTACK, MOVE, MOVE ];

module.exports = function (spawn) {
    var allCreeps = spawn.room.find(FIND_MY_CREEPS);
    var roleCreeps = {};
    for (var i in allCreeps) {
        var thisCreep = allCreeps[i];
        if (!roleCreeps[ thisCreep.memory.role ]) roleCreeps[ thisCreep.memory.role ] = [];
        roleCreeps[ thisCreep.memory.role ].push(thisCreep);
    }

    var totalEnergy = spawn.energy;
    var storages = spawn.room.find(FIND_MY_STRUCTURES, {
        filter: function(s) {
            return s.structureType == STRUCTURE_EXTENSION;
        }
    });
    for (var i in storages) {
        totalEnergy += storages[i].energy;
    }

    spawnCreepEvery(spawn, roleCreeps, 'harvester', LIFETIME / 2, HARVESTER_BODY);
    checkCreepSupply(spawn, allCreeps, roleCreeps, 'harvester', 1, HARVESTER_BODY)

    var targets = spawn.room.find(FIND_HOSTILE_CREEPS);
    var min = targets.length < 1 ? 1 : targets.length;
    checkCreepSupply(spawn, allCreeps, roleCreeps, 'guard', min, GUARD_BODY);

    if (totalEnergy > 400) {
        spawnCreepEvery(spawn, roleCreeps, 'builder', LIFETIME / 2, BIG_BUILDER_BODY);
    }
    else {
        spawnCreepEvery(spawn, roleCreeps, 'builder', LIFETIME / 2, BUILDER_BODY);
    }

    spawnFromQueue(spawn, roleCreeps);
}
