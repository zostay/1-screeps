var util = require('util');

module.exports = function (mon, creep) {
    creep.memory.state = creep.memory.state || 'build';
    if (creep.memory.state == 'build') {
        if (creep.carry.energy == 0) {
            creep.say('Gather');
            creep.memory.state = 'gather';
        }
        else {
    		var targets = mon.findConstructionSites(creep.room);
            if (creep.room.controller.level < 2) {
                creep.moveTo(creep.room.controller);
                creep.upgradeController(creep.room.controller);
            }
    		else if(targets.length) {
    			creep.moveTo(targets[0]);
    			creep.build(targets[0]);
    		}

    		// might as well do something
            else {
                creep.moveTo(creep.room.controller);
                creep.upgradeController(creep.room.controller);
            }
        }
    }
    else {
        util.gather(mon, creep, 'build', 'Build');
    }
}
