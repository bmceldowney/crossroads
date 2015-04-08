'use strict';

var gameService = {};
var gameObj;

gameService.register = function (game) {
	gameObj = game;
}

gameService.get = function () {
	return gameObj;
}

module.exports = gameService;