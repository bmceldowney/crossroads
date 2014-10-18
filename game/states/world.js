'use strict';
function World() {}
World.prototype = {
  preload: function () {
    this.game.load.tilemap('worldMap', 'assets/worldMap.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('worldTiles', 'assets/worldTileset_1.png');
  },

  create: function () {
    var map;
    var layer;

    map = this.game.add.tilemap('worldMap');
    map.addTilesetImage('ground', 'worldTiles');
    layer = map.createLayer('ground');
  },
  update: function () {
    // state update code
  },
  paused: function () {
    // This method will be called when game paused.
  },
  render: function () {
    // Put render operations here.
  },
  shutdown: function () {
    // This method will be called when the state is shut down 
    // (i.e. you switch to another state from this one).
  }
};

module.exports = World;
