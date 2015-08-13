module.exports = function (creep) {
    var myCreeps = creep.room.find(FIND_MY_CREEPS);
	for (var i in myCreeps) {
	    if (myCreeps[i].hits < myCreeps[i].hitsMax) {
	        creep.moveTo(myCreeps[i]);
	        creep.heal(myCreeps[i]);
	    }
	}
}
