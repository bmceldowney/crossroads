XRoads.Map = {};

(function () {
    var game = XRoads.game
      , grid = XRoads.Grid
      , map;

    XRoads.Map.preload = function () {
        game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/tiles-1.png');
    };

    XRoads.Map.create = function () {
        var layer
          , acceptablePathTiles = [0];

        map = game.add.tilemap('map');
        map.addTilesetImage('dirt', 'tiles');
        layer = map.createLayer('Tile Layer 1');

        grid.setPathfinding(layer, acceptablePathTiles);
    };
})();