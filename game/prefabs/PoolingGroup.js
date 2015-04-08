'use strict';

var PoolingGroup = function(game, parent, name, addToStage, enableBody, physicsBodyType) {
  Phaser.Group.call(this, game, parent, name, addToStage, enableBody, physicsBodyType);
  this.key = name;
}

PoolingGroup.prototype = Object.create(Phaser.Group.prototype);

PoolingGroup.prototype.constructor = PoolingGroup;

PoolingGroup.prototype.spawn = function(x, y, health) {
	var child = this.getFirstDead() || this.create(0, 0);

	child.reset(x || 0, y || 0, health || 1);
	return child;
};

module.exports = PoolingGroup;
