use v6;

class SC::Role::Harvester {
    method behave($creep) {
        $creep.memory<state> //= 'harvest';

        if $creep.memory<state> eq 'harvest' {
    		my @sources = $creep.room.find(FIND_SOURCES);
            my $my_source = @sources[$creep.memory<index> % @sources.elems];

        	if $creep.carry.energy < $creep.carryCapacity {
        		$creep.moveTo($my_source);
        		$creep.harvest($my_source);
        	}
            else {
                $creep.say("Deliver");
                $creep.memory<state> = 'deliver';
            }
        }
    	else {
            if $creep.carry.energy == 0 {
                $creep.say("Harvest");
                $creep.memory<state> = 'harvest';
            }
            else {
                my @storages = $creep.room.find(FIND_MY_STRUCTURES, {
                    filter => -> $s {
                        ($s.structureType eq STRUCTURE_EXTENSION && $s.energy < $s.energyCapacity)
                            || ($s.structureType eq STRUCTURE_STORAGE && $s.store.energy < $s.storeCapacity)
                    },
                }).sort(-> $a, $b {
                    my $needA = $a.energyCapacity ?? $a.energyCapacity - $a.energy !! $a.storeCapacity - $a.store.energy;
                    my $needB = $b.energyCapacity ?? $b.energyCapacity - $b.energy !! $b.storeCapacity - $b.store.energy;
                    return $needB - $needA;
                });

                if @storages {
                    $creep.moveTo(@storages[0]);
                    $creep.transferEnergy(@storages[0]);
                }
                else {
            		$creep.moveTo(Game.spawns.Home);
            		$creep.transferEnergy(Game.spawns.Home)
                }
            }
    	}
    }
}
