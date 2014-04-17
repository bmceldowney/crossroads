"use strict";
XRoads.easystar = new EasyStar.js();

//global variables
window.onload = function () {
    var game = new Phaser.Game(624, 368, Phaser.AUTO, 'game');

    // Game States
    game.state.add('boot', XRoads.Boot);
    game.state.add('world', XRoads.World);
    // game.state.add('menu', require('./js/states/menu'));
    game.state.add('combat', XRoads.Combat);
    // game.state.add('preload', require('./js/states/preload'));


    game.state.start('world');
};