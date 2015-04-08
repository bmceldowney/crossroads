'use strict';
var behaviors = require('../services/behaviorService');
var gridGenerator = require('../services/mapGridGenerator')
var CreepManager = require('../data/CreepManager')
var grid;

function Combat() {}

function changeDirectionClicked() {
  behaviors.massDirectionShift(this.creepManager._creeps);
}

Combat.prototype = {
  preload: function () {
    game.load.tilemap('map', 'assets/bloobs.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/simple_colors.png');

    // OLD //
    XRoads.CombatPlayer = new CombatPlayer(this.game);
    XRoads.CombatPlayer.preload();

    this.game.load.spritesheet('upcreep', 'assets/upcreep_button.png', 150, 75);
  },

  create: function () {
    var tileMap;
    var wallLayer;
    var mapOptions;
    
    // MAP CREATION //
    tilemap = game.add.tilemap('map');
    tilemap.addTilesetImage('dirt', 'tiles');
    wallLayer = tilemap.createLayer('Tile Layer 1');
    mapOptions = {
      width: tilemap.height,
      height: tilemap.width,
      size: tilemap.tileHeight,
      collisionLayer: wallLayer,
      acceptableTiles: [0]
    }

    grid = gridGenerator.generate(mapOptions);


    // OLD //
    this.creepManager.populate();
    XRoads.CombatPlayer.create();

    this.game.stage.smoothed = false;
    this.game.stage.backgroundColor = '#000000';
    // Hax0rz for IE
    if (this.game.context.msImageSmoothingEnabled) {
        this.game.context.msImageSmoothingEnabled = false;
    }

    this.game.add.button(this.game.world.centerX - 175, this.game.world.height - 80, 'upcreep', changeDirectionClicked, this, 2, 1, 0);
  },

  update: function () {
    grid.collider.tick();
    XRoads.CombatPlayer.update();
  },
  paused: function () {
    // This method will be called when game paused.
  },
  shutdown: function () {
    // This method will be called when the state is shut down 
    // (i.e. you switch to another state from this one).
  }
};

module.exports = Combat;
