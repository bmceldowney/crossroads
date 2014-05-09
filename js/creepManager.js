XRoads.CreepManager = function (game) {
    this.game = game;
    this.game.load.spritesheet('werewolf', 'assets/werewolf.png', 16, 16);
    this.game.load.spritesheet('vamp', 'assets/vamp.png', 16, 16);
    this.game.load.spritesheet('frank', 'assets/frank.png', 16, 16);
    this.game.load.spritesheet('mummy', 'assets/mummy.png', 16, 16);
    this.game.load.spritesheet('swamp', 'assets/swamp.png', 16, 16);
    this.game.load.spritesheet('bird', 'assets/bird.png', 16, 16);
    this.game.load.spritesheet('zombie', 'assets/zombie.png', 16, 18);
    this.game.load.spritesheet('catshroom', 'assets/catshroom.png', 20, 20);
};

XRoads.CreepManager.prototype = {
    populate: function () {
        this._creeps = this.game.add.group();
        this._creeps.enableBody = true;
        this._creeps.physicsBodyType = Phaser.Physics.ARCADE;

        var type, x, y
          , types = ['werewolf', 'werewolf', 'vamp', 'mummy', 'catshroom', 'frank', 'swamp'];

        for (var i = 0; i < 10; i++) {
            type = types[Math.floor(Math.random() * types.length)];
            getStartingLocation();

            this._add(type, x, y);
        }
        //this._creeps.setAll('property', 1.5);

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

    _add: function (type, x, y) {
        var creep = XRoads.CreepManager.definitions[type];
        creep.prototype = Object.create(XRoads.Creep.prototype);
        this._creeps.add(new creep(x, y));
    }
};
XRoads.CreepManager.addCreep = function (type, x, y) {
    var creep = XRoads.CreepManager.definitions[type];
    creep.prototype = Object.create(XRoads.Creep.prototype);
    XRoads.CM._creeps.add(new creep(x, y));
};

XRoads.CreepManager.definitions = {
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
