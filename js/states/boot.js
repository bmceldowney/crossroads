"use strict";

var XRoads = {};

XRoads.Boot = function (game) {
};

XRoads.Boot.prototype = {
    create: function () {
        game.state.start('combat');
    }
}