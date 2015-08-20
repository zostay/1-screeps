module.exports = function (mon, creep) {
    var myCreeps = mon.findMyCreeps(creep.room);
	for (var i in myCreeps) {
	    if (myCreeps[i].hits < myCreeps[i].hitsMax) {
	        creep.moveTo(myCreeps[i]);
	        creep.heal(myCreeps[i]);
	    }
	}
}
