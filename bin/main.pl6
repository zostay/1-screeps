#!perl6
use v6;

use SC::Monster;

my $mon = SC::Monster.new;

$mon.add_chassis('Worker',  [ WORK, CARRY ]);
$mon.add_chassis('Tanker',  [ CARRY, CARRY ]);
$mon.add_chassis('Soldier', [ TOUGH, ATTACK ]);

$mon.run;
