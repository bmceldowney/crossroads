XRoads.Map = {};

(function () {
    var game = XRoads.game
      , easystar = XRoads.easystar
      , map;

    XRoads.Map.preload = function () {
        game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/tiles-1.png');
    };

    XRoads.Map.create = function () {
        var layer
          , grid;

        map = game.add.tilemap('map');
        map.addTilesetImage('dirt', 'tiles');
        layer = map.createLayer('Tile Layer 1');

        grid = convertLayerToEasyStarGrid(layer);

        easystar.setGrid(grid);
        easystar.setAcceptableTiles([0]);
    };

    function convertLayerToEasyStarGrid (layer) {
        var grid = layer.layer.data.map(function (row) {
            var gridRow = row.map(function (column) {
                if (!column) return 0;
                return column.index;
            });

            return gridRow;
        });

        return grid;
    }
})();