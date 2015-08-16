function Chassis(name, parts) {
    this.name  = name;
    this.parts = parts;
    return this;
}
Chassis.prototype = new Object;

var COST            = {};
COST[MOVE]          = 50;
COST[WORK]          = 100;
COST[CARRY]         = 50;
COST[ATTACK]        = 80;
COST[RANGED_ATTACK] = 150;
COST[HEAL]          = 250;
COST[TOUGH]         = 10;

const MAX_PARTS = 30;

function calculateCost(parts) {
    var cost = 0;
    for (var i in parts) {
        cost += COST[ parts[i] ];
    }
    return cost;
}

Chassis.prototype.spawnCreep = function(spawner, maxEnergy, name, memory) {
    var baseBody = [ MOVE ];
    baseBody.push(parts);
    for (var i = 0; i < part.length / 2; i++) baseBody.push(MOVE);

    var body = [];
    body.push(baseBody);

    while (true) {
        var testBody = [];
        testBody.push(body);
        testBody.push(baseBody);

        if (calculateCost(testBody) < maxEnergy) {
            body = testBody;
        }
        else {
            break;
        }
    }

    var r = spawner.createCreep(body, name, memory);

    if (r == name) {
        return body;
    }
    else {
        return null;
    }
}

module.exports = Chassis;
