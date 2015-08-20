var util = require('util');

module.exports = function (mon, creep) {
    creep.memory.state = creep.memory.state || 'gather';
    if (creep.memory.state == 'gather') {
        util.gather(mon, creep, 'deliver', 'Deliver');
    }
	else {
        if (creep.carry.energy == 0) {
            creep.say("Gather");
            creep.memory.state = 'gather';
        }
        else {
            var distance = [];
            var storages = creep.room.find(FIND_MY_STRUCTURES, {
                filter: function(s) {
                    if (s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity) {
                        distance[ s.id ] = util.crowDistance(creep.pos, s.pos);
                        return true;
                    }
                    return false;
                }
            })
            storages.sort(function(a, b) {
                var needA = a.energyCapacity - a.energy;
                var needB = b.energyCapacity - b.energy;
                return needB - needA || distance[a.id] - distance[b.id];
            });

            if (Game.spawns.Home.energy <= 250) {
        		creep.moveTo(Game.spawns.Home);
        		creep.transferEnergy(Game.spawns.Home)
            }
            else if (storages.length) {
                creep.moveTo(storages[0]);
                creep.transferEnergy(storages[0]);
            }
            else if (Game.spawns.Home.energy < Game.spawns.Home.energyCapacity) {
        		creep.moveTo(Game.spawns.Home);
        		creep.transferEnergy(Game.spawns.Home)
            }
            else {
                var creeps = creep.room.find(FIND_MY_CREEPS, {
                    filter: function (c) {
                        distance[ c.id ] = util.crowDistance(creep.pos, c.pos);
                        return (
                            c.memory.role == 'builder'
                            || c.memory.role == 'keeper'
                        )
                        && c.carry.energy < c.carryCapacity
                        && c.carry.energy > 5; // they aren't gathering yet
                    }
                });
                creeps.sort(function(a, b) {
                    var needA = a.carryCapacity - a.carry.energy;
                    var needB = b.carryCapacity - b.carry.energy;
                    return distance[a.id] - distance[b.id] || needB - needA;
                });

                if (creeps.length) {
                    creep.moveTo(creeps[0]);
                    creep.transferEnergy(creeps[0]);
                }
            }
        }
	}
}
