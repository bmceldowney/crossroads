'use strict';
var Node = require('../models/Node.js');
var Grid = require('../models/Grid.js');
var Collider = require('../models/MapCollider.js');

var mapGridGenerator = {};

function buildNodes(grid) {
  var id, x, y, column, row;

  for (var i = grid.nodeCount - 1; i >= 0; i--) {
    id = i;
    x = (i % grid.width) * grid.size;
    y = Math.floor(i / grid.width) * grid.size;
    column = (i % grid.width);
    row = Math.floor(i / grid.width);

    grid.nodes[i] = new Node(id, x, y, column, row);
  }
}

function linkNodes(grid) {
  var currentRow;
  var north, south, east, west;

  for (var i = grid.nodeCount - 1; i >= 0; i--) {
    currentRow = Math.floor(i / grid.width);

    if (currentRow) {
      north = grid.nodes[i - grid.width];
    } else {
      north = grid.nodes[grid.nodeCount - grid.width + i];
    }
    
    if (currentRow < grid.height - 1) {
      south = grid.nodes[i + grid.width];
    } else {
      south = grid.nodes[i % grid.width];
    }

    if ((i + 1) % grid.width) {
      east = grid.nodes[i + 1];
    } else {
      east = grid.nodes[i - grid.width + 1];
    }

    if (i % grid.width) {
      west = grid.nodes[i - 1];
    } else {
      west = grid.nodes[i + grid.width - 1];
    }

    grid.nodes[i].n = north;
    grid.nodes[i].s = south;
    grid.nodes[i].e = east;
    grid.nodes[i].w = west;
  }
}

function addWalls(grid) {
  for (var i = 0; i < grid.nodeCount; i++) {
    if (grid.isCollision(i % grid.width, Math.floor(i / grid.width))) {
      grid.nodes[i].isWall = true;
    } else {
      grid.nodes[i].isWall = false;
    }

    grid.nodes[i].isOccupied = false;
  }
}

mapGridGenerator.generate = function (width, height, size) {
  var grid = new Grid(width, height, size);

  buildNodes(grid);
  linkNodes(grid);
  grid.collider = new 

  addWalls(grid);
  
  
  return grid;
};

module.exports = mapGridGenerator;
