function checkCreepSupply(spawn, all, creeps, role, count, parts) {
    if (!creeps[role] || creeps[role].length < count) {
        var count = creeps[role] ? creeps[role].length : 0;
        spawn.createCreep(parts, role + count, { role: role });
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

    var sources = spawn.room.find(FIND_SOURCES);
    checkCreepSupply(spawn, allCreeps, roleCreeps, 'harvester', sources.length, [WORK,CARRY,MOVE,MOVE]);
    checkCreepSupply(spawn, allCreeps, roleCreeps, 'builder',   2, [WORK,CARRY,MOVE,MOVE]);

    var targets = spawn.room.find(FIND_HOSTILE_CREEPS);
    var min = targets.length < 1 ? 1 : targets.length;
    checkCreepSupply(spawn, allCreeps, roleCreeps, 'guard', min, [TOUGH,ATTACK,MOVE,MOVE]);
}
