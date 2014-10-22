'use strict';

var easystar = XRoads.easystar,
tileWidth = 16,
tileHeight = 16,
collision,
columns,
rows,
game;

var grid = {};

function convertLayerToEasyStarGrid(layer) {
  var grid = layer.layer.data.map(function (row) {
    var gridRow = row.map(function (column) {
      if (!column) return 0;
      return column.index;
    });

    return gridRow;
  });

  return grid;
}

grid.create = function (gameObj) {
  game = gameObj;
  columns = XRoads.CombatMap.width;
  rows = XRoads.CombatMap.height;
};

grid.update = function () {
  easystar.calculate();
};

grid.getColumns = function () {
  return columns;
};

grid.getRows = function () {
  return rows;
};

// converts a point to grid coordinates
grid.pointToGrid = function (x, y) {
  var gridX = Math.floor(x / tileWidth);
  var gridY = Math.floor(y / tileWidth);

  return {x: gridX, y: gridY};
};

// converts a grid coordinate to the screen point in the upper left corner of the grid tile
grid.gridToPoint = function (x, y) {
  var pointX = x * tileWidth;
  var pointY = y * tileHeight;

  return {x: pointX, y: pointY};
};

// checks the grid tile at x,y to determine if there is a collision or not
grid.isCollision = function (x, y) {
  if (!collision) throw new Error('grid.isCollision: collision not set');
  if (y >= collision.length || y < 0) return true;
  if (x >= collision[y].length || x < 0) return true;

  if (collision[y][x]) {
    return true;
  } else {
    return false;
  }
};

grid.setPathfinding = function (layer, acceptableTiles) {
  collision = convertLayerToEasyStarGrid(layer);

  easystar.setGrid(collision);
  easystar.setAcceptableTiles(acceptableTiles);
};

module.exports = grid;
