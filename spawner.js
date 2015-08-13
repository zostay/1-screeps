function findNameByRole(spawn, role) {
    var index = 0;
    var creeps = Game.creeps;
    while (creeps && creeps[ spawn.room.name + 'X' + role + 'X' + index ]) index++;
    return spawn.room.name + 'X' + role + 'X' + index;
}

function spawnByRole(spawn, creeps, role, parts) {
    var name = findNameByRole(spawn, role);
    spawn.createCreep(parts, name, { role: role });
}

function checkCreepSupply(spawn, all, creeps, role, count, parts) {
    if (!creeps[role] || creeps[role].length < count) {
        spawnByRole(creeps, role, parts);
    }
}

var LIFETIME = 1500;
function spawnCreepEvery(spawn, creeps, role, ticks, parts) {
    if (Game.time % ticks == 0 || spawn.memory[role]) {
        if (spawnByRole(spawn, creeps, role, parts) == OK) {
            spawn.memory[role] = false;
        }
        else {
            spawn.memory[role] = true;
        }
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
}
