'use strict';
var PoolingGroup = require('./PoolingGroup');

var CreepPool = function(game, parent, name, addToStage) {
	PoolingGroup.call(this, game, parent, name, addToStage, true, Phaser.Physics.ARCADE);
}

CreepPool.prototype = Object.create(PoolingGroup.prototype);

CreepPool.prototype.constructor = CreepPool;

CreepPool.prototype.populate = function () {
	var type, 
			x, 
			y, 
			types = ['werewolf', 'werewolf', 'vamp', 'mummy', 'catshroom', 'frank', 'swamp'];

	for (var i = 0; i < 160; i++) {
		type = types[Math.floor(Math.random() * types.length)];
		getStartingLocation();

		this._add(type, x, y);
	}

	function getStartingLocation() {
		var node;
		x = Math.floor(Math.random() * XRoads.Grid.getColumns());
		y = Math.floor(Math.random() * XRoads.Grid.getRows());
		node = x * y;

		if (XRoads.GridNodes.isLocked(node)) {
			getStartingLocation();
		}

		return;
	}
},


module.exports = CreepPool;
