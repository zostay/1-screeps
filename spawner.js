function findNameByRole(spawn, role) {
    var index = 0;
    var creeps = Game.creeps;
    while (creeps[ spawn.room.name + 'X' + role + 'X' + index ]) index++;
    return spawn.room.name + 'X' + role + 'X' + index;
}

function spawnByRole(spawn, creeps, role, parts) {
    var name = findNameByRole(spawn, role);
    if (spawn.createCreep(parts, name, { role: role }) == name) {
        console.log("Spawning " + role + ": " + name);
        return true;
    }
    else {
        return false;
    }
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
    if (spawn.spawning) return;
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

var WORKER_BODY     = [ WORK, CARRY, MOVE, MOVE ];
var BIG_WORKER_BODY = [ WORK, WORK, CARRY, CARRY, MOVE, MOVE ];
var GUARD_BODY      = [ TOUGH, ATTACK, MOVE, MOVE ];

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

    var worker = totalEnergy > 400 ? BIG_WORKER_BODY : WORKER_BODY;
    spawnCreepEvery(spawn, roleCreeps, 'harvester', LIFETIME / 4, worker);
    checkCreepSupply(spawn, allCreeps, roleCreeps, 'harvester', 1, worker);

    var targets = spawn.room.find(FIND_HOSTILE_CREEPS);
    var min = targets.length < 1 ? 1 : targets.length;
    checkCreepSupply(spawn, allCreeps, roleCreeps, 'guard', min, GUARD_BODY);

    spawnCreepEvery(spawn, roleCreeps, 'fixer', LIFETIME / 2, worker);
    spawnCreepEvery(spawn, roleCreeps, 'builder', LIFETIME / 2, worker);

    spawnFromQueue(spawn, roleCreeps);
}
