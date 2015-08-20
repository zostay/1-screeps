use v6;

use SC::Util;

class SC::Role::Tanker {
    method behave($creep) {
        $creep.memory<state> //= 'gather';
        if $creep.memory<state> eq 'gather' {
            SC::Util.gather($creep, 'deliver', 'Deliver');
        }
    	else {
            if $creep.carry.energy == 0 {
                $creep.say("Gather");
                $creep.memory<state> = 'gather';
            }
            else {
                my @storages = $creep.room.find(FIND_MY_STRUCTURES, {
                    filter => -> $s {
                        $s.structureType == STRUCTURE_EXTENSION && $s.energy < $s.energyCapacity
                    }
                }).map( -> $s { [
                    $s,
                    $s.energyCapacity - $s.energy
                    SC::Util.crow_distance($creep.pod, $s.pos),
                ] }).sort( -> $a, $b {
                    $b[1] <=> $a[1] && $a[2] <=> $b[2]
                }).map({ $_.[0] });

                if Game.spawns<Home>.energy <= 250 {
            		$creep.moveTo(Game.spawns<Home>);
            		$creep.transferEnergy(Game.spawns<Home>)
                }
                elsif @storages {
                    $creep.moveTo(@storages[0]);
                    $creep.transferEnergy(@storages[0]);
                }
                elsif Game.spawns<Home>.energy < Game.spawns<Home>.energyCapacity {
            		$creep.moveTo(Game.spawns<Home>);
            		$creep.transferEnergy(Game.spawns<Home>)
                }
                else {
                    my @creeps = $creep.room.find(FIND_MY_CREEPS, {
                        filter => -> $c {
                            ($c.memory<role> eq 'builder' || $c.memory<role> eq 'keeper')
                                && $c.carry.energy < $c.carryCapacity
                                && $c.carry.energy > 5 # they aren't gathering yet
                        }
                    }).map(-> $c { [
                        $c,
                        $c.carryCapacity - $c.carry.energy,
                        SC::Util.crow_distance($creep.pos, $c.pos),
                    ] }).sort(-> $a, $b {
                        $a[2] <=> $b[2] || $b[1] <=> $a[1]
                    }).map({ $_.[0] })

                    if @creeps {
                        $creep.moveTo(@creeps[0]);
                        $creep.transferEnergy(@creeps[0]);
                    }
                }
            }
    	}
    }
}
