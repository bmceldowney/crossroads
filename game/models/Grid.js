'use strict';

function Grid(width, height, size) {
  this.width = width;
  this.height = height;
  this.size = size;
  this.nodes = [];
  this.nodeCount = width * height;
}

Grid.prototype.getColumns = function () {
  console.log('Grid.prototype.getColumns is deprecated. Use Grid.width instead.');
  return this.width;
  
};

Grid.prototype.getRows = function () {
  console.log('Grid.prototype.getRows is deprecated. Use Grid.height instead.');
  return this.height;
};

Grid.prototype.isLocked = function (nn) {
  return (!this.nodes[nn].n.isWall && !this.nodes[nn].s.isWall && !this.nodes[nn].e.isWall && !this.nodes[nn].w.isWall);
};

Grid.prototype.getNodeFromCoords = function (x, y) {
  return this.nodes[(y * this.width) + x];
};

Grid.prototype.getNodeFromPos = function (x, y) {

  // NOTE: revisit
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