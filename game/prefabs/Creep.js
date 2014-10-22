'use strict';
var grid = require('./grid.js');

var Creep = function (game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, this.creepType);

  var fps = (5 + 11) - Math.floor((((this.speed - 200) / 500) * 6) + 5);
  game.add.existing(this);

  this.lastDir = { x: null, y: null, letter: null, node: null, lastNode: null };

  // direction is the next node we want to occupy.
  this.direction = { x: null, y: null, letter: null, node: null, lastNode: null };
  this.moving = false;

  this.currentNode = null;
  this.animations.add('walkUp', [0, 1, 2, 1], fps, true);
  this.animations.add('walkRight', [3, 4, 5, 4], fps, true);
  this.animations.add('walkDown', [6, 7, 8, 7], fps, true);
  this.animations.add('walkLeft', [9, 10, 11, 10], fps, true);
  this.animations.add('fighting', [1, 4, 7, 10], fps, true);
  this.animations.add('death', [0, 4, 8, 9], fps, true);

  this.animTranslate = { e: 'walkRight', w: 'walkLeft', s: 'walkDown', n: 'walkUp' };

  this.xPos = 0;
  this.yPos = 0;

  this.step = { x: '+0', y: '+0' };
  this.shift = { x: 0, y: 0 };

  this.tween1 = null;
  this.tween2 = null;
  this.tweenDeath = null;
  this.tweenFight = null;

  //behaviors
  this.wayless = 0;
  this.bias = 0;
  this.rut = 0;
  this.waypoints = [];
};

Creep.prototype = Object.create(Phaser.Sprite.prototype);
Creep.prototype.constructor = Creep;

Creep.prototype.update = function () {
  this.upkeep();
  if (!this.moving && this.alive) {
    this.xPos = this.x;
    this.yPos = this.y;
    this.moving = true;
    //find next node to move to
    this.search();
    //start move sequence
    this.move();
  }
};

Creep.prototype.upkeep = function () {
  // NOTE: move this to the state and compare group to group
  game.physics.arcade.overlap(XRoads.CombatPlayer.bullets, this, this.bulletCollisionHandler, null, this);
};


Creep.prototype.findDefaultDirection = function (x, y) {
  var gridCoords;

  gridCoords = grid.pointToGrid(x, y);
  var node = XRoads.GridNodes.getNodeFromCoords(gridCoords.x, gridCoords.y);

  var dir = this.walkWithPurpose(node, this.lastDir.letter);
  this.lastDir.letter = dir.letter;
  dir.node = node;
  this.lastDir.node = node;
  

  return dir;
};


module.exports = Creep;
