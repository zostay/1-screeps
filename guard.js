module.exports = function (creep) {
    var targets = creep.room.find(FIND_HOSTILE_CREEPS);
    if(targets.length) {
	    creep.moveTo(targets[0]);
	    creep.attack(targets[0]);
    }
    else if (creep.memory.patrolTo) {
        creep.moveTo(creep.memory.patrolTo.x, creep.memory.patrolTo.y);
        if (creep.memory.patrolTo.x == creep.pos.x && creep.memory.patrolTo.y == creep.pos.y) {
            creep.memory.patrolTo = null;
        }
    }
    else {
        var x = Math.round(Math.random() * 49 + 1);
        var y = Math.round(Math.random() * 49 + 1);
        var spot = creep.room.getPositionAt(x, y);
        var stuff = spot.look();
        for (var i in stuff) {
            if (stuff[i].type === 'terrain' && stuff[i].terrain === 'plain') {
                creep.memory.patrolTo = spot;
                console.log(creep.name + ': Patrolling to [' + spot.x + ',' + spot.y + ']');
            }
        }
    }
}
