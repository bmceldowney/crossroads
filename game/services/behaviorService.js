'use strict';
var behaviorService = {};

behaviorService.massDirectionShift = function (creeps) {
  var directions = ['n', 's', 'e', 'w'];
  var direction = directions[~~(Math.random() * 4)];

  creeps.forEach(function (tempCreep) {
    tempCreep.newDirection = direction;
  });
};

module.exports = behaviorService;