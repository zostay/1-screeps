use v6;

class SC::Spawner {
    method find_name_by_role($spawn, $role) {
        my $index = 0;
        my $creeps = Game.creeps;
        my $room_name = $spawn.room ?? $spawn.room.name !! 'SIMU';
        while $creeps{ $spawn.room.name ~ 'X' ~ $role ~ 'X' ~ $index } { $index++ }
        return {
            name  => $spawn.room.name ~ 'X' ~ $role ~ 'X' ~ $index,
            index => $index,
        };
    }

    method spawn_by_role($spawn, $role, @parts) {
        my $opt = self.find_name_by_role($spawn, $role);
        if $spawn.createCreep(@parts, $opt.name, { role => $role, index => $opt.index }) eq $opt.name {
            console.log("Spawning " ~ $role ~ ": " ~ $opt.name);
            return True;
        }
        else {
            return False;
        }
    }

    method count_in_queue($spawn, $role) {
        $spawn.memory<queue>.grep(-> @q { @q[0] eq $role }).elems;
    }

    method check_creep_supply($spawn, @all, %creeps, $role, $count, @parts) {
        return if $spawn.spawning;
        $spawn.memory<queue> //= [];
        my $in_room  = %creeps{$role} ?? %creeps{$role}.elems !! 0;
        my $in_queue = self.count_in_queue($spawn, $role);
        while $in_room + $in_queue < $count {
            $spawn.memory<queue>.push([ $role, @parts ]);
            $in_queue++;
        }
    }

    my $LIFETIME = 1500;
    method spawn_creep_every($spawn, %creeps, $role, $ticks, $stagger, @parts) {
        if (Game.time - $stagger) % %ticks == 0 && self.count_in_queue($spawn, $role) == 0 {
            $spawn.memory<queue> //= [];
            $spawn.memory<queue>.push([ $role, @parts ]);
        }
    }

    method spawn_from_queue($spawn, %creeps) {
        return unless $spawn.memory<queue>;

        if (self.spawn_by_role($spawn, $spawn.memory<queue>[0][0], $spawn.memory<queue>[0][1])) {
            $spawn.memory<queue>.shift;
        }
    }

    my $TANKER_BODY         = [ MOVE, CARRY, CARRY, MOVE ];
    my $BIG_TANKER_BODY     = [ MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE ];
    my $BIGGER_TANKER_BODY  = [ MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE ];
    my $WORKER_BODY         = [ MOVE, WORK, CARRY, MOVE ];
    my $BIG_WORKER_BODY     = [ MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE ];
    my $BIGGER_WORKER_BODY  = [ MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE ];
    my $GUARD_BODY          = [ MOVE, TOUGH, TOUGH, MOVE, ATTACK, MOVE ];

    method spawn($mon, $spawn) {
        my @all_creeps = $spawn.room.find(FIND_MY_CREEPS);
        my %role_creeps;
        for @all_creeps -> $this_creep {
            %role_creeps{ $this_creep.memory<role> } //= [];
            %role_creeps{ $this_creep.memory<role> }.push($this_creep);
        }

        my $total_energy = $spawn.energy;
        my @storages = $spawn.room.find(FIND_MY_STRUCTURES, {
            filter => -> $s { $s.structureType eq STRUCTURE_EXTENSION }
        });
        $total_energy += @storages.map({ $_.energy });

        my $worker  = $total_energy > 750 ?? $BIGGER_WORKER_BODY
                   !! $total_energy > 450 ?? $BIG_WORKER_BODY
                   !!                        $WORKER_BODY;
        my $tanker  = $total_energy > 500 ?? $BIGGER_TANKER_BODY
                   !! $total_energy > 350 ?? $BIG_TANKER_BODY
                   !!                        $TANKER_BODY;

        self.spawn_creep_every($spawn, %role_creeps, 'harvester', Math.round($LIFETIME / 6), 0, $worker);
        self.check_creep_supply($spawn, @all_creeps, %role_creeps, 'harvester', 1, $worker);

        # my @targets = $spawn.room.find(FIND_HOSTILE_CREEPS);
        # my $min = @targets.elems < 1 ?? 1 !! @targets.elems;
        # self.check_creep_supply($spawn, @all_creeps, %role_creeps, 'guard', $min, $GUARD_BODY);

        self.spawn_creep_every($spawn, %role_creeps, 'fixer',   $LIFETIME, 100, $worker);
        self.spawn_creep_every($spawn, %role_creeps, 'keeper',  $LIFETIME / 2, 300, $worker);
        self.spawn_creep_every($spawn, %role_creeps, 'builder', $LIFETIME / 2, 200, $worker);

        my @storages = $spawn.room.find(FIND_MY_STRUCTURES, {
            filter => -> $s { $s.structureType eq STRUCTURE_STORAGE }
        });

        if @storages {
            self.check_creep_supply($spawn, @all_creeps, %role_creeps, 'tanker', 1, $tanker);
            self.spawn_creep_every($spawn, %role_creeps, 'tanker', $LIFETIME / 2, 400, $tanker);
        }

        self.spawn_from_queue($spawn, %role_creeps);
    }
}
