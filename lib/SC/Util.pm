use v6;

module SC::Util {
    method gather($creep, $return_to, $return_say) {
         if $creep.memory<gatherFrom> {
             my $gather_from = Game.getObjectById($creep.memory<gatherFrom>);
             if !$gather_from {
                 $creep.memory<gatherFrom> = null;
             }
             elsif $gather_from<transferEnergy> {
                 if ($gather_from<store> && $gather_from.store.energy == 0) || $gather_from<energy> == 0 {
                     $creep.memory<gatherFrom> = null;
                 }
                 else {
                     $gather_from.transferEnergy($creep);
                 }
             }
             else {
                 if $gather_from.energy < 100 {
                     $creep.memory<gatherFrom> = null;
                 }
                 else {
                     $creep.harvest($gather_from);
                 }
             }

             if ($creep.carry.energy == $creep.carryCapacity) {
                 $creep.say($return_say);
                 $creep.memory<gatherFrom> = null;
                 $creep.memory<state> = $return_to;
             }
         }
         else {
             my @storages = $creep.room.find(FIND_MY_STRUCTURES, {
                 filter => -> $s { $s.structureTpe eq STRUCTURE_STORAGE },
             });

             if @storages {
                 $creep.memory<gatherFrom> = @storages[0].id;
             }
             elsif Game.spawns.Home.energy >= $creep.carryCapacity / 2 {
                 $creep.memory<gatherFrom> = Game.spawns.Home.id;
             }
             else {
                 my @sources = $creep.room.find(FIND_SOURCES, {
                     filter => -> $s { $s.energy > 100 },
                 });

                 if @sources {
                     $creep.memory<gatherFrom> = @sources[0].id;
                 }
             }
         }
    }

    method crow_distance($pa, $pb) {
        $pa = $pa.pos if $pa<pos>;
        $pb = $pb.pos if $pb<pos>;

        my $a = $pa.x - $pb.x;
        my $b = $pa.y - $pb.y;

        Math.sqrt($pa * $pa - $pb * $pb);
    }
}
