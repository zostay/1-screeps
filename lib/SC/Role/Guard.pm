use v6;

class SC::Role::Guard {
    method behave($creep) {
        my @targets = $creep.room.find(FIND_HOSTILE_CREEPS);
        if @targets {
    	    $creep.moveTo(@targets[0]);
    	    $creep.attack(@targets[0]);
        }
        elsif $creep.memory<patrolTo> {
            $creep.moveTo($creep.memory<patrolTo>.x, creep.memory<patrolTo>.y);
            my $px = $creep.memory<patrolTo>.x;
            my $py = $creep.memory<patrolTo>.y;
            my $cx = $creep.pos.x;
            my $cy = $creep.pos.y;

            # patrol within a couple blocks is good enough
            $creep.memory.patrolTo = null
                if $px >= $cx - 2 && $px <= $cx + 2 && $py >= $cy - 2 && $py <= $cy + 2;
        }
    }
    else {
        my $x = Math.round(Math.random() * 49 + 1);
        my $y = Math.round(Math.random() * 49 + 1);
        my $spot = $creep.room.getPositionAt($x, $y);
        if $spot {
            my @stuff = $spot.look();
            for @stuff -> $stuff {
                if $stuff.type eq 'terrain' && $stuff.terrain eq 'plain') {
                    $creep.memory<patrolTo> = $spot;
                    console.log($creep.name ~ ': Patrolling to [' ~ $spot.x ~ ',' ~ $spot.y ~ ']');
                }
            }
        }
    }
}
