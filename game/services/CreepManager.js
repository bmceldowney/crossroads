'use strict';

var creepDefinitions = require('../data/creepDefinitions');
var CreepPool = require('../prefabs/CreepPool');
var gameService = require('../services/gameService')
var pools = {};

var CreepManager = {};

CreepManager.addCreep = function (type, x, y) {
	var game = gameService.get();
	if (!pools[type]) { 
		pools[type] = new CreepPool(game, null, type); 
	};

  var creep = creepDefinitions[type];
  creep.prototype = Object.create(XRoads.Creep.prototype);
  pools[type].spawn(x, y);
}

module.exports = CreepManager;
