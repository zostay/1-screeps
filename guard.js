module.exports = function (creep) {
    var targets = creep.room.find(FIND_HOSTILE_CREEPS);
    if(targets.length) {
	    creep.moveTo(targets[0]);
	    creep.attack(targets[0]);
    }
    else if (creep.memory.patrolTo) {
        creep.moveTo(creep.memory.patrolTo);
        if (creep.memory.patrolTo.x == creep.x && creep.patrolTo.y == creep.y) {
            creep.patrolTo = null;
        }
    }
    else {
        var x = Math.random() * 50;
        var y = Math.random() * 50;
        var spot = creep.room.getPositionAt(x, y);
        var stuff = spot.look();
        for (var i in stuff) {
            if (stuff[i].type === 'terrain' && stuff[i].terrain === 'plain') {
                creep.memory.patrolTo = spot;
            }
        }
    }
}
