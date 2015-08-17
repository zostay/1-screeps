function findNameByRole(spawn, role) {
    var index = 0;
    var creeps = Game.creeps;
    var roomName = spawn.room ? spawn.room.name : 'sim';
    while (creeps[ spawn.room.name + 'X' + role + 'X' + index ]) index++;
    return {
        name: spawn.room.name + 'X' + role + 'X' + index,
        index: index
    };
}

function spawnByRole(spawn, creeps, role, parts) {
    var opt = findNameByRole(spawn, role);
    if (spawn.createCreep(parts, opt.name, { role: role, index: opt.index }) == opt.name) {
        console.log("Spawning " + role + ": " + opt.name);
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
function spawnCreepEvery(spawn, creeps, role, ticks, stagger, parts) {
    if ((Game.time - stagger) % ticks == 0 && countInQueue(spawn, role) == 0) {
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

var COURIER_BODY        = [ MOVE, CARRY, CARRY, MOVE ];
var BIG_COURIER_BODY    = [ MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE ];
var BIGGER_COURIER_BODY = [ MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE ];
var WORKER_BODY         = [ MOVE, WORK, CARRY, MOVE ];
var BIG_WORKER_BODY     = [ MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE ];
var BIGGER_WORKER_BODY  = [ MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE ];
var GUARD_BODY          = [ MOVE, TOUGH, TOUGH, MOVE, ATTACK, MOVE ];

module.exports = function (mon, spawn) {
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

    var worker  = totalEnergy > 750 ? BIGGER_WORKER_BODY
                : totalEnergy > 450 ? BIG_WORKER_BODY
                :                     WORKER_BODY;
    var courier = totalEnergy > 500 ? BIGGER_COURIER_BODY
                : totalEnergy > 350 ? BIG_COURIER_BODY
                :                     COURIER_BODY;

    spawnCreepEvery(spawn, roleCreeps, 'harvester', Math.round(LIFETIME / 6), 0, worker);
    checkCreepSupply(spawn, allCreeps, roleCreeps, 'harvester', 1, worker);

    // var targets = spawn.room.find(FIND_HOSTILE_CREEPS);
    // var min = targets.length < 1 ? 1 : targets.length;
    // checkCreepSupply(spawn, allCreeps, roleCreeps, 'guard', min, GUARD_BODY);

    spawnCreepEvery(spawn, roleCreeps, 'fixer',   LIFETIME, 100, worker);
    spawnCreepEvery(spawn, roleCreeps, 'keeper',  LIFETIME / 2, 300, worker);
    spawnCreepEvery(spawn, roleCreeps, 'builder', LIFETIME / 2, 200, worker);

    var storages = spawn.room.find(FIND_MY_STRUCTURES, {
        filter: function(s) {
            return s.structureType == STRUCTURE_STORAGE;
        }
    });

    if (storages.length) {
        checkCreepSupply(spawn, allCreeps, roleCreeps, 'courier', 1, courier);
        spawnCreepEvery(spawn, roleCreeps, 'courier', LIFETIME / 2, 400, courier);
    }

    spawnFromQueue(spawn, roleCreeps);
}
