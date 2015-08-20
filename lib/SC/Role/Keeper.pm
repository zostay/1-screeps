use v6;

use SC::Util;

class SC::Role::Keeper {
    method behave($creep) {
        $creep.memory<state> //= 'repair';

        if $creep.memory<state> eq 'repair' {
        	my @ramparts = $creep.room.find(FIND_MY_STRUCTURES, {
                filter => -> $s { $s.structureType eq STRUCTURE_RAMPART && $s.hits < $s.hitsMax },
            });

            my $min_hits = @ramparts.map({ $_.hits }).min;
#
#            if !@ramparts {
#                if Game.time % 60 == 0 {
#                    $creep.say('Idle');
#                return;
#            }
#
#            if $creep.carry.energy == 0 {
#                $creep.say('Gather');
#                $creep.memory<state> = 'gather';
#            }
#
#            elsif $creep.memory<rampartTarget> {
#                my $rampart_target = Game.getObjectById($creep.memory<rampartTarget>);
#                if !$creep.memory<repairsRemain> $creep.memory<repairsRemain> = 0;
#
#                $creep.moveTo($rampart_target);
#                my $r = $creep.repair($rampart_target);
#
#                $creep.memory<repairsRemain>-- if r == OK;
#                $creep.memory<rampartTarget> = null
#                    if $creep.memory<repairsRemain> <= 0;
#                $creep.memory<rampartTarget> = null
#                    if $rampart_target.hits == $rampart_target.hitsMax;
#                $creep.memory<rampartTarget> = null
#                    if $min_hits < 700 && $rampart_target.hits >= 1000;
#            }
#            else {
#
#                # emergency
#                if $min_hits < 700 {
#                    my $crit_rampart = @ramparts.first(* < 700);
#                    $creep.say('Weak');
#                    $creep.memory<rampartTarget> = $crit_rampart.id;
#                    $creep.memory<repairsRemain> = 10;
#                    return;
#                }
#
#                # build-up
#                else {
#                    my $rampart = @ramparts.first(* == $min_hits);
#                    $creep.say('Strong');
#                    $creep.memory<rampartTarget> = $rampart.id;
#                    $creep.memory<repairsRemain> = 100;
#                    return;
#                }
#            }
        }
        else {
            SC::Util.gather($creep, 'repair', 'Keep');
        }
    }
}
