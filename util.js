var util = {};
util.bestSource = function(mon, creep) {
    var droppedEnergy = mon.findDroppedEnergy(creep.room).filter(function(e) {
        return util.crowDistance(creep, e) < 10;
    });
    var storages = mon.findStorages(creep.room);

    if (droppedEnergy.length) {
        return droppedEnergy[0].id;
    }
    else if (storages.length) {
        return storages[0].id;
    }
    else if (Game.spawns.Home.energy >= creep.carryCapacity / 2) {
        return Game.spawns.Home.id;
    }
    else {
        var sources = mon.findSources(creep.room).filter(function(s) {
            return s.energy > 100;
        });

        if (sources.length) {
            return sources[0].id;
        }
    }

    return null;
}

util.gather = function(mon, creep, returnTo, returnSay) {
    if (creep.memory.gatherFrom) {
        var gatherFrom = Game.getObjectById(creep.memory.gatherFrom);
        creep.moveTo(gatherFrom);
        if (!gatherFrom) {
            creep.memory.gatherFrom = null;
        }
        else if (gatherFrom.transferEnergy) {
            if ((gatherFrom.store && gatherFrom.store.energy == 0) || gatherFrom.energy == 0) {
                creep.memory.gatherFrom = null;
            }
            else {
                gatherFrom.transferEnergy(creep);
            }
        }
        else if (gatherFrom instanceof Energy) {
            creep.pickup(gatherFrom);
        }
        else {
            if (gatherFrom.energy < 100) {
                creep.memory.gatherFrom = null;
            }
            else {
                creep.harvest(gatherFrom);
            }
        }

        if (creep.carry.energy == creep.carryCapacity) {
            creep.say(returnSay);
            creep.memory.gatherFrom = null;
            creep.memory.state = returnTo;
        }
    }
    else {
        creep.memory.gatherFrom = util.bestSource(mon, creep);
    }
}

util.crowDistance = function(pa, pb) {
    if (pa.pos) pa = pa.pos;
    if (pb.pos) pb = pb.pos;

    var a = Math.abs(pa.x - pb.x);
    var b = Math.abs(pa.y - pb.y);

    return Math.max(a, b);
};

module.exports = util;
