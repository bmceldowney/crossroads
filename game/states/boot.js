
'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function () {

  },
  create: function () {
    this.game.state.start('preload');
  }
};

module.exports = Boot;
