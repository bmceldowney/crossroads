
'use strict';
function Preload() {
  this.ready = false;

  // CREEPS //
  this.game.load.spritesheet('werewolf', 'assets/werewolf.png', 16, 16);
  this.game.load.spritesheet('vamp', 'assets/vamp.png', 16, 16);
  this.game.load.spritesheet('frank', 'assets/frank.png', 16, 16);
  this.game.load.spritesheet('mummy', 'assets/mummy.png', 16, 16);
  this.game.load.spritesheet('swamp', 'assets/swamp.png', 16, 16);
  this.game.load.spritesheet('bird', 'assets/bird.png', 16, 16);
  this.game.load.spritesheet('zombie', 'assets/zombie.png', 16, 18);
  this.game.load.spritesheet('catshroom', 'assets/catshroom.png', 20, 20);

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
