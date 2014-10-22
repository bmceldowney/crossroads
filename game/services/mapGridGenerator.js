'use strict';
var Node = require('../models/Node.js');
var grid = require('../models/grid.js');
var width;
var height;
var size;
var nodes;
var nodeCount;

var gridService = {};

function buildNodes() {
  var id, x, y, column, row;

  for (var i = nodeCount - 1; i >= 0; i--) {
    id = i;
    x = (i % width) * size;
    y = Math.floor(i / width) * size;
    column = (i % width);
    row = Math.floor(i / width);

    nodes[i] = new Node(id, x, y, column, row);
  }
}

function linkNodes() {
  var currentRow;
  var north, south, east, west;

  for (var i = nodeCount - 1; i >= 0; i--) {
    currentRow = Math.floor(i / width);

    if (currentRow) {
      north = nodes[i - width];
    } else {
      north = nodes[nodeCount - width + i];
    }
    
    if (currentRow < height - 1) {
      south = nodes[i + width];
    } else {
      south = nodes[i % width];
    }

    if ((i + 1) % width) {
      east = nodes[i + 1];
    } else {
      east = nodes[i - width + 1];
    }

    if (i % width) {
      west = nodes[i - 1];
    } else {
      west = nodes[i + width - 1];
    }

    nodes[i].n = north;
    nodes[i].s = south;
    nodes[i].e = east;
    nodes[i].w = west;
  }
}

function addWalls() {
  for (var i = 0; i < nodeCount; i++) {
    if (grid.isCollision(i % width, Math.floor(i / width))) {
      nodes[i].isWall = true;
    } else {
      nodes[i].isWall = false;
    }

    nodes[i].isOccupied = false;
  }
}

gridService.getNodeFromPos = function (x, y) {
  var gp = grid.pointToGrid(x, y);
  //What? why -.0001? why?
  if (x > XRoads.CombatMap.widthInPixels - 0.0001 || x < 0) {
    return null;
  } else {
    return nodes[(gp.y * width) + gp.x];
  }
};

gridService.isLocked = function (nn) {
  return (!nodes[nn].n.isWall && !nodes[nn].s.isWall && !nodes[nn].e.isWall && !nodes[nn].w.isWall);
};

gridService.generate = function (w, h, s) {
  width = w;
  height = h;
  size = s;
  nodes = [];
  nodeCount = width * height;

  buildNodes();
  linkNodes();
  addWalls();
};

gridService.getNodeFromCoords = function (x, y) {
  return nodes[(y * width) + x];
};

module.exports = gridService;
