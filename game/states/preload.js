
'use strict';
function Preload() {
  this.ready = false;
}

Preload.prototype = {
  preload: function () {

  },
  create: function () {
    this.ready = true;
  },
  update: function () {
    if (!!this.ready) {
      this.game.state.start('menu');
    }
  }
};

module.exports = Preload;
