use v6;

class SC::Role::Healer {
    method behave($creep) {
        my @my_creeps = $creep.room.find(FIND_MY_CREEPS);
        for @my_creeps -> $my_creep {
            if $my_creep.hits < $my_creep.hitsMax {
    	        $creep.moveTo($my_creep);
    	        $creep.heal($my_creeps);
    	    }
    	}
    }
}
