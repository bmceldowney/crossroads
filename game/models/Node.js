'use strict';

var Node = function (id, x, y, col, row) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.col = col;
  this.row = row;
};

Node.prototype.constructor = Node;

module.exports = Node;
