use v6;

use SC::Util;

class SC::Role::Fixer {
    method behave($creep) {
        $creep.memory<state> //= 'repair';
        if $creep.memory<state> eq 'repair' {
            if $creep.carry.energy == 0 {
                $creep.say('Gather');
                $creep.memory<state> = 'gather';
            }
            else {
        		my @fixables = $creep.room.find(FIND_STRUCTURES, {
                    filter => -> $s { $s.structureType eq STRUCTURE_ROAD && $s.hits < $s.hitsMax }
                });

        		if @fixables {
        			$creep.moveTo(@fixables[0]);
        			$creep.repair(@fixables[0]);
        		}

        		# might as well do something
                else {
                    $creep.moveTo($creep.room.controller);
                    $creep.upgradeController($creep.room.controller);
                }
            }
        }
        else {
            SC::Util.gather($creep, 'repair', 'Repair');
        }
    }
}
