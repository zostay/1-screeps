var util = require('util');

module.exports = function (mon, creep) {
    creep.memory.state = creep.memory.state || 'repair';
    if (creep.memory.state == 'repair') {
        if (creep.carry.energy == 0) {
            creep.say('Gather');
            creep.memory.state = 'gather';
        }
        else {
    		var fixables = mon.findRoads(creep.room);

    		if (fixables.length) {
    			creep.moveTo(fixables[0]);
    			creep.repair(fixables[0]);
    		}

    		// might as well do something
            else {
                creep.moveTo(creep.room.controller);
                creep.upgradeController(creep.room.controller);
            }
        }
    }
    else {
        util.gather(mon, creep, 'repair', 'Repair');
    }
}
