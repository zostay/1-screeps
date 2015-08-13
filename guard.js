module.exports = function (creep) {
    var targets = creep.room.find(FIND_HOSTILE_CREEPS);
    if(targets.length) {
	    creep.moveTo(targets[0]);
	    creep.attack(targets[0]);
    }
    else if (creep.memory.patrolTo) {
        console.log('patrolling');
        creep.moveTo(creep.memory.patrolTo);
        if (creep.memory.patrolTo.x == creep.x && creep.memory.patrolTo.y == creep.y) {
            creep.memory.patrolTo = null;
        }
    }
    else {
        var x = Math.random() * 49 + 1;
        var y = Math.random() * 49 + 1;
        var spot = creep.room.getPositionAt(x, y);
        var stuff = spot.look();
        for (var i in stuff) {
            console.log('[' + spot.x + ',' + spot.y + ']: ' + stuff[i].type);
            if (stuff[i].type === 'terrain' && stuff[i].terrain === 'plain') {
                creep.memory.patrolTo = spot;
            }
        }
    }
}
