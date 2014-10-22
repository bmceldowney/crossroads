'use strict';

function Grid(width, height, size) {
  this.width = width;
  this.height = height;
  this.size = size;
  this.nodes = [];
  this.nodeCount = width * height;
}

Grid.prototype = {};

Grid.prototype.isLocked = function (nn) {
  return (!this.nodes[nn].n.isWall && !this.nodes[nn].s.isWall && !this.nodes[nn].e.isWall && !this.nodes[nn].w.isWall);
};

Grid.prototype.getNodeFromCoords = function (x, y) {
  return this.nodes[(y * this.width) + x];
};

Grid.prototype.getNodeFromPos = function (x, y) {
  var gp = this.pointToGrid(x, y);
  //What? why -.0001? why?
  if (x > XRoads.CombatMap.widthInPixels - 0.0001 || x < 0) {
    return null;
  } else {
    return this.nodes[(gp.y * this.width) + gp.x];
  }
};

Grid.prototype.pointToGrid = function (x, y) {
  var gridX = Math.floor(x / this.size);
  var gridY = Math.floor(y / this.size);

  return {x: gridX, y: gridY};
};

Grid.prototype.gridToPoint = function (x, y) {
  var pointX = x * this.size;
  var pointY = y * this.size;

  return {x: pointX, y: pointY};
};

module.exports = Grid;