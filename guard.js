module.exports = function (mon, creep) {
    var targets = creep.room.find(FIND_HOSTILE_CREEPS);
    if(targets.length) {
	    creep.moveTo(targets[0]);
	    creep.attack(targets[0]);
    }
    else if (creep.memory.patrolTo) {
        creep.moveTo(creep.memory.patrolTo.x, creep.memory.patrolTo.y);
        var px = creep.memory.patrolTo.x,
            py = creep.memory.patrolTo.y,
            cx = creep.pos.x,
            cy = creep.pos.y;

        // patrol within a couple blocks is good enough
        if (px >= cx - 2 && px <= cx + 2 && py >= cy - 2 && py <= cy + 2) {
            creep.memory.patrolTo = null;
        }
    }
    else {
        var x = Math.round(Math.random() * 49 + 1);
        var y = Math.round(Math.random() * 49 + 1);
        var spot = creep.room.getPositionAt(x, y);
        if (spot) {
            var stuff = spot.look();
            for (var i in stuff) {
                if (stuff[i].type === 'terrain' && stuff[i].terrain === 'plain') {
                    creep.memory.patrolTo = spot;
                    console.log(creep.name + ': Patrolling to [' + spot.x + ',' + spot.y + ']');
                }
            }
        }
    }
}
