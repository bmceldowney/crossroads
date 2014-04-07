XRoads.Grid = {};

(function () {
    var game = XRoads.game
      , easystar = XRoads.easystar
      , tileWidth = 16
      , tileHeight = 16;

    XRoads.Grid.create = function () {

    };

    XRoads.Grid.update = function () {
        easystar.calculate();
    };

    XRoads.Grid.render = function () {
        if (!game) throw new Error("XRoads.Grid: attempted to render before initialization.");

        var columns = game.world.width / tileWidth
          , rows = game.world.height / tileHeight
          , line;

        for (var i = columns - 1; i >= 0; i--) {
            line = new Phaser.Line(i * tileWidth, 0, i * tileWidth, game.world.height);
            game.debug.geom(line);
        }

        for (i = rows - 1; i >= 0; i--) {
            line = new Phaser.Line(0, i * tileHeight, game.world.width, i * tileHeight);
            game.debug.geom(line);
        }
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
})();