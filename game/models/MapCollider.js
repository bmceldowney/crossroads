'use strict';
var easystar = new EasyStar.js();

function convertLayerToEasyStarGrid(layer) {
  var grid = layer.layer.data.map(function (row) {
    var gridRow = row.map(function (column) {
      if (!column) { return 0; }
      return column.index;
    });

    return gridRow;
  });

  return grid;
}

var MapCollider = function (layer, acceptableTiles) {
  this.collisionMap = convertLayerToEasyStarGrid(layer);

  easystar.setGrid(this.collisionMap);
  easystar.setAcceptableTiles(acceptableTiles);
};

MapCollider.prototype.tick = function () {
  easystar.calculate();
};

MapCollider.prototype.check = function (x, y) {
  if (!this.isInBounds(x, y)) { return true; }

  return this.collisionMap[y][x];
};

MapCollider.prototype.isInBounds = function (x, y) {
  return (y >= this.collisionMap.length || y < 0) ||
         (x >= this.collisionMap[y].length || x < 0);
};

module.exports = MapCollider;