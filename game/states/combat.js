'use strict';
var behaviors = require('./services/behaviorService');

function Combat() {}

function changeDirectionClicked() {
  behaviors.massDirectionShift(this.creepManager._creeps);
}

Combat.prototype = {
  preload: function () {
    XRoads.Map.preload(this.game);
    XRoads.CM = this.creepManager = new XRoads.CreepManager(this.game);
    XRoads.CombatPlayer = new CombatPlayer(this.game);
    XRoads.CombatPlayer.preload();

    this.game.load.spritesheet('upcreep', 'assets/upcreep_button.png', 150, 75);
  },

  create: function () {
    XRoads.Map.create();
    XRoads.Grid.create(this.game);
    XRoads.GridNodes.create(XRoads.Grid.getColumns(), XRoads.Grid.getRows(), 16);
    this.creepManager.populate();
    XRoads.CombatPlayer.create();

    this.game.stage.smoothed = false;
    this.game.stage.backgroundColor = '#000000';
    // Hax0rz for IE
    if (this.game.context.msImageSmoothingEnabled) {
        this.game.context.msImageSmoothingEnabled = false;
    }

    this.game.add.button(this.game.world.centerX - 175, this.game.world.height - 80, 'upcreep', changeDirectionClicked, this, 2, 1, 0);
  },

  update: function () {
    XRoads.CombatPlayer.update();
  },
  paused: function () {
    // This method will be called when game paused.
  },
  render: function () {
    // Put render operations here.
  },
  shutdown: function () {
    // This method will be called when the state is shut down 
    // (i.e. you switch to another state from this one).
  }
};

module.exports = Combat;
