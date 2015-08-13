function findNameByRole(spawn, role) {
    var index = 0;
    var creeps = Game.creeps;
    while (creeps[ spawn.room.name + 'X' + role + 'X' + index ]) index++;
    return spawn.room.name + 'X' + role + 'X' + index;
}

function spawnByRole(spawn, creeps, role, parts) {
    var name = findNameByRole(spawn, role);
    return spawn.createCreep(parts, name, { role: role }) == name;
}

function checkCreepSupply(spawn, all, creeps, role, count, parts) {
    if (!spawn.memory.queue) spawn.memory.queue = [];
    var inRoom  = creeps[role] ? creeps[role].length : 0;
    var inQueue = 0;
    for (var i in spawn.memory.queue) {
        var creepSpec = spawn.memory.queue[i];
        if (creepSpec[0] == role) inQueue++;
    }
    while (inRoom + inQueue < count) {
        spawn.memory.queue.push([ role, parts ]);
        inQueue++;
    }
}

var LIFETIME = 1500;
function spawnCreepEvery(spawn, creeps, role, ticks, parts) {
    if (Game.time % ticks == 0) {
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

module.exports = function (spawn) {
    var allCreeps = spawn.room.find(FIND_MY_CREEPS);
    var roleCreeps = {};
    for (var i in allCreeps) {
        var thisCreep = allCreeps[i];
        if (!roleCreeps[ thisCreep.memory.role ]) roleCreeps[ thisCreep.memory.role ] = [];
        roleCreeps[ thisCreep.memory.role ].push(thisCreep);
    }

    var targets = spawn.room.find(FIND_HOSTILE_CREEPS);
    var min = targets.length < 1 ? 1 : targets.length;
    checkCreepSupply(spawn, allCreeps, roleCreeps, 'guard', min, [TOUGH,ATTACK,MOVE,MOVE]);

    spawnCreepEvery(spawn, roleCreeps, 'builder',   LIFETIME / 2, [WORK,CARRY,MOVE,MOVE]);
    spawnCreepEvery(spawn, roleCreeps, 'harvester', LIFETIME / 2, [WORK,CARRY,MOVE,MOVE]);

    spawnFromQueue(spawn, roleCreeps);
}
