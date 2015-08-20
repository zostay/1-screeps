use v6;

class SC::Chassis {
    has $.name;
    has @.body;

    my %COST = (
        move          => 50,
        work          => 100,
        carry         => 50,
        attack        => 80,
        ranged_attack => 150,
        heal          => 250,
        touch         => 10,
    );

    my $MAX_PARTS = 30;

    method calculate_cost(@body) {
        my $cost = 0;
        for @body -> $part { $cost += %COST{ $part } }
        $cost;
    }

    method spawn_creep($spawn, $max_energy, $name, %memory) {
        my @base_body = (MOVE, @.body, MOVE xx @.body.elems / 2);

        my @body = @base_body;
        loop {
            my @test_body = @body, @base_body;
            last if self.calculate_cost(@test_body) > $max_energy;
            last if @test_body.elems > $MAX_PARTS;
            @body = @test_body;
        }

        my $r = $spawn.createCreep(@body, $name, %memory);

        $r eq $name ?? @body !! Nil
    }
}
