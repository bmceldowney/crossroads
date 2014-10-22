'use strict';

var MapCollider = function (grid) {
  this.collisionMap = [];
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

grid.setPathfinding = function (layer, acceptableTiles) {
  collision = convertLayerToEasyStarGrid(layer);

  easystar.setGrid(collision);
  easystar.setAcceptableTiles(acceptableTiles);
};

MapCollider.check = function (x, y) {
  if (!this.isInBounds(x, y)) { return true; }

  return this.collision[y][x];
};

MapCollider.isInBounds = function (x, y) {
  return (y >= this.collision.length || y < 0) ||
         (x >= this.collision[y].length || x < 0);
};

module.exports = MapCollider;