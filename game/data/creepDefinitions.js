'use strict';

var definitions = {
  //'type' is protected on sprites. Use 'creepType' instead.
  werewolf: function () {
    this.speed = 100;
    this.creepType = 'werewolf';
    this.hates = ['player', 'vamp', 'mummy', 'frank', 'bird', 'zombie'];
    this.damage = 1;
    this.life = 2;
    this.onDeath = function (x, y) {
      XRoads.CM._add('zombie', this.currentNode.column, this.currentNode.row);
    };

    XRoads.Creep.apply(this, arguments);
  },
  vamp: function () {
    this.speed = 200;
    this.creepType = 'vamp';
    this.hates = ['player', 'werewolf', 'mummy', 'frank', 'zombie'];
    this.damage = 2;
    this.life = 3;

    this.onDeath = function (x, y) {
      XRoads.CM._add('bird', this.currentNode.n.column, this.currentNode.n.row);
      XRoads.CM._add('bird', this.currentNode.s.column, this.currentNode.s.row);
      XRoads.CM._add('bird', this.currentNode.e.column, this.currentNode.e.row);
      XRoads.CM._add('bird', this.currentNode.w.column, this.currentNode.w.row);
    };

    XRoads.Creep.apply(this, arguments);
  },
  swamp: function () {
    this.speed = 300;
    this.creepType = 'swamp';
    this.hates = ['player', 'mummy', 'vamp', 'werewolf', 'bird', 'zombie'];
    this.damage = 2;
    this.life = 3;
    XRoads.Creep.apply(this, arguments);
  },
  mummy: function () {
    this.speed = 700;
    this.creepType = 'mummy';
    this.hates = ['player', 'swamp', 'vamp', 'frank', 'bird', 'catshroom'];
    this.damage = 1;
    this.life = 4;
    XRoads.Creep.apply(this, arguments);
  },
  frank: function () {
    this.speed = 400;
    this.creepType = 'frank';
    //frank hates everyone
    this.hates = ['player', 'werewolf', 'vamp', 'swamp', 'mummy', 'frank', 'bird', 'zombie'];
    this.damage = 2;
    this.life = 4;
    XRoads.Creep.apply(this, arguments);
  },
  bird: function () {
    this.speed = 100;
    this.creepType = 'bird';
    this.hates = ['player', 'werewolf', 'swamp', 'zombie', 'frank', 'mummy', 'catshroom'];
    this.damage = .5;
    this.life = 1;
    XRoads.Creep.apply(this, arguments);
  },
  zombie: function () {
    this.speed = 700;
    this.creepType = 'zombie';
    this.hates = ['player', 'werewolf', 'vamp', 'swamp', 'catshroom'];
    this.damage = 1;
    this.life = 2;
    XRoads.Creep.apply(this, arguments);
  },
  catshroom: function () {
	  this.speed = 250;
	  this.creepType = 'catshroom';
	  this.hates = ['player', 'werewolf', 'vamp', 'swamp', 'bird'];
	  this.damage = 1;
	  this.life = 4;
	  XRoads.Creep.apply(this, arguments);
	}
};

module.exports = definitions;