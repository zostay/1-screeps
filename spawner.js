module.exports = function (spawn) {
    var allCreeps = spawn.room.find(FIND_MY_CREEPS);
    var roleCreeps = {};
    for (var i in allCreeps) {
        var thisCreep = allCreeps[i];
        if (!roleCreeps[ thisCreep.role ]) roleCreeps[ thisCreep.role ] = [];
        roleCreeps[ thisCreep.role ].push(thisCreep);
    }

    if (!roleCreeps.harvester || roleCreeps.harvester.length < 1) {
        var count = !roleCreeps.harvester ? 0 : roleCreeps.harvester.length;
        spawn.createCreep([WORK, CARRY, MOVE, MOVE], 'Harvester' + count, { role: 'harvester' });
    }

    if (!roleCreeps.builder || roleCreeps.builder.length < 1) {
        var count = !roleCreeps.builder ? 0 : roleCreeps.builder.length;
        spawn.createCreep([WORK, CARRY, MOVE, MOVE], 'Builder' + count, { role: 'builder' });
    }

    var targets = spawn.room.find(FIND_HOSTILE_CREEPS);
    var min = targets.length < 1 ? 1 : targets.length;
    if (!roleCreeps.guard || roleCreeps.guard.length < min) {
        var count = !roleCreeps.guard ? 0 : roleCreeps.guard.length;
        spawn.createCreep([TOUGH, ATTACK, MOVE, MOVE], 'Guard' + count, { role: 'guard' });
    }
}
