use v6;

use SC::Util;

class SC::Role::Builder {
    method behave($creep) {
        $creep.memory<state> //= 'build';
        if $creep.memory<state> eq 'build' {
            if $creep.carry.energy == 0 {
                $creep.say('Gather');
                $creep.memory<state> = 'gather';
            }
            else {
                my @targets = $creep.room.find(FIND_CONSTRUCTION_SITES);
                if $creep.room.controller.level < 2 {
                    $creep.moveTo($creep.room.controller);
                    $creep.upgradeController($creep.room.controller);
                }

                elsif @targets {
                    $creep.moveTo(@targets[0]);
                    $creep.build(@targets[0]);
                }

                # might as well do something
                else {
                    $creep.moveTo($creep.room.controller);
                    $creep.upgradeController($creep.room.controller);
                }
            }
        }
        else {
            SC::Util.gather($creep, 'build', 'Build');
        }
    }
}
