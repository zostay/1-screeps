use v6;

use SC::Chassis;
use SC::Spawner;

use SC::Role::Builder;
use SC::Role::Fixer;
use SC::Role::Guard;
use SC::Role::Harvester;
use SC::Role::Healer;
use SC::Role::Keeper;
#use SC::Role::Tanker;

class SC::Monster {
    has @.chassis;

    method add_chassis($name, @body) {
        push @.chassis, SC::Chassis.new(name => $name, body => @body);
    }

    method run() {
        for Game.creeps -> $creep {
            SC::Role::Builder.behave($creep)   if $creep.memory<role> eq 'builder';
            SC::Role::Fixer.behave($creep)     if $creep.memory<role> eq 'fixer';
            SC::Role::Guard.behave($creep)     if $creep.memory<role> eq 'guard';
            SC::Role::Harvester.behave($creep) if $creep.memory<role> eq 'harvester';
            SC::Role::Healer.behave($creep)    if $creep.memory<role> eq 'healer';
            SC::Role::Keeper.behave($creep)    if $creep.memory<role> eq 'keeper';
            SC::Role::Tanker.behave($creep)    if $creep.memory<role> eq 'tanker';
        }

        for Game.spawns -> $spawn {
            SC::Spawner.spawn(self, $spawn);
        }
    }
}
