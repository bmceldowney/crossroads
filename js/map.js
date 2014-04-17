XRoads.Map = {};

(function () {
    var game;

    XRoads.Map.preload = function (_game) {
        game = _game;
        game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/tiles-1.png');
    };

    XRoads.Map.create = function () {
        var map;
        var layer;
        var grid = XRoads.Grid;
        var acceptablePathTiles = [0];

        map = game.add.tilemap('map');
        map.addTilesetImage('dirt', 'tiles');
        layer = map.createLayer('Tile Layer 1');

        grid.setPathfinding(layer, acceptablePathTiles);
    };
})();
