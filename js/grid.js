XRoads.Grid = {};

(function () {
    var easystar = XRoads.easystar
      , tileWidth = 16
      , tileHeight = 16
      , collision
      , columns
      , rows
      , game;

    XRoads.Grid.create = function (_game) {
        game = _game;
        columns = XRoads.CombatMap.width;
        rows = XRoads.CombatMap.height;
    };

    XRoads.Grid.update = function () {
        easystar.calculate();
    };

    XRoads.Grid.render = function () {
        if (!game) throw new Error("XRoads.Grid: attempted to render before initialization.");

        var line;

        for (var i = columns - 1; i >= 0; i--) {
            line = new Phaser.Line(i * tileWidth, 0, i * tileWidth, game.world.height);
            game.debug.geom(line);
        }

        for (i = rows - 1; i >= 0; i--) {
            line = new Phaser.Line(0, i * tileHeight, game.world.width, i * tileHeight);
            game.debug.geom(line);
        }
    };

    XRoads.Grid.getColumns = function () {
        return columns;
    };

    XRoads.Grid.getRows = function () {
        return rows;
    };

    // converts a point to grid coordinates
    XRoads.Grid.pointToGrid = function (x, y) {
        var gridX = Math.floor(x / tileWidth);
        var gridY = Math.floor(y / tileWidth);

        return {x: gridX, y: gridY};
    };

    // converts a grid coordinate to the screen point in the upper left corner of the grid tile
    XRoads.Grid.gridToPoint = function (x, y) {
        var pointX = x * tileWidth;
        var pointY = y * tileHeight;

        return {x: pointX, y: pointY};
    };

    // checks the grid tile at x,y to determine if there is a collision or not
    XRoads.Grid.isCollision = function (x, y) {
        if (!collision) throw new Error('XRoads.Grid.isCollision: collision not set');
        if (y >= collision.length || y < 0) return true;
        if (x >= collision[y].length || x < 0) return true;

        if (collision[y][x]) {
            return true;
        } else {
            return false;
        }
    };

    XRoads.Grid.setPathfinding = function (layer, acceptableTiles) {
        collision = convertLayerToEasyStarGrid(layer);

        easystar.setGrid(collision);
        easystar.setAcceptableTiles(acceptableTiles);
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