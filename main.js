var Monster = require('Monster');

var mon = new Monster();
mon.addChassis('Worker',  [ WORK, CARRY ]);
mon.addChassis('Courier', [ CARRY, CARRY ]);
mon.addChassis('Soldier', [ TOUGH, ATTACK ]);

mon.run();
