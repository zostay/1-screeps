function checkCreepSupply(creeps, role, count, parts) {
    if (!creeps[role] || creeps[role].length < count) {
        var count = !creeps[role] ? 0 : creeps[role].length;
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

    checkCreepSupply(roleCreeps, 'harvester', 1, [WORK,CARRY,MOVE,MOVE]);
    checkCreepSupply(roleCreeps, 'builder',   1, [WORK,CARRY,MOVE,MOVE]);

    var targets = spawn.room.find(FIND_HOSTILE_CREEPS);
    var min = targets.length < 1 ? 1 : targets.length;
    checkCreepSupply(roleCreeps, 'guard', min, [TOUGH,ATTACK,MOVE,MOVE]);
}
