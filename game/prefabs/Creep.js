'use strict';

var Creep = function (game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'Creep', frame);

  // initialize your prefab here
  
};

Creep.prototype = Object.create(Phaser.Sprite.prototype);
Creep.prototype.constructor = Creep;

Creep.prototype.update = function () {
  
  // write your prefab's specific update code here
  
};

module.exports = Creep;
