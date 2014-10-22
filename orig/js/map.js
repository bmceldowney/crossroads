XRoads.Map = {};

(function () {
    var game;

    XRoads.Map.preload = function (_game) {
        game = _game;
        game.load.tilemap('map', 'assets/bloobs.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/simple_colors.png');
    };

    XRoads.Map.create = function () {
        var grid = XRoads.Grid;
        var acceptablePathTiles = [0];

        XRoads.CombatMap = game.add.tilemap('map');
        XRoads.CombatMap.addTilesetImage('dirt', 'tiles');
        XRoads.CombatMap.WallLayer = XRoads.CombatMap.createLayer('Tile Layer 1');

        grid.setPathfinding(XRoads.CombatMap.WallLayer, acceptablePathTiles);
    };
    XRoads.Map.replaceTile = function (map, layer, tileId, tileLocation) {
        map.putTile(tileId, layer.getTileX(tileLocation.x), layer.getTileY(tileLocation.y))
    };
})();
