'use strict';

var mapGridCollider = function (grid) {
  this.collisionMap = [];
};

mapGridCollider.check = function (x, y) {
  if (!this.isInBounds(x, y)) { return true; }

  if (this.collision[y][x]) {
    return true;
  } else {
    return false;
  }
};

mapGridCollider.isInBounds = function (x, y) {
  return (y >= this.collision.length || y < 0) ||
         (x >= this.collision[y].length || x < 0);
};

module.exports = mapGridCollider;