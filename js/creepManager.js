XRoads.CreepManager = function (game) {
    this.game = game;
    this.game.load.spritesheet('werewolf', 'assets/werewolf.png', 16, 16);
    this.game.load.spritesheet('vamp', 'assets/vamp.png', 16, 16);
    this.game.load.spritesheet('frank', 'assets/frank.png', 16, 16);
    this.game.load.spritesheet('mummy', 'assets/mummy.png', 16, 16);
    this.game.load.spritesheet('swamp', 'assets/swamp.png', 16, 16);
};

XRoads.CreepManager.prototype = {
    populate: function () {
        this._creeps = this.game.add.group();
        var type, x, y
          , types = ['werewolf', 'swamp', 'vamp', 'frank', 'mummy'];

        for (var i = 0; i < 100; i++) {
            type = types[Math.floor(Math.random() * 5)];
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

XRoads.CreepManager.definitions = {
    //'type' is protected on sprites. Use 'creepType' instead.
    werewolf: function () {
        this.speed = 100;
        this.creepType = 'werewolf';
        this.damage = 1;
        this.life = 2;
        XRoads.Creep.apply(this, arguments);
    },
    vamp: function () {
        this.speed = 200;
        this.creepType = 'vamp';
        this.damage = 2;
        this.life = 3;
        XRoads.Creep.apply(this, arguments);
    },
    swamp: function () {
        this.speed = 300;
        this.creepType = 'swamp';
        this.damage = 2;
        this.life = 4;
        XRoads.Creep.apply(this, arguments);
    },
    mummy: function () {
        this.speed = 700;
        this.creepType = 'mummy';
        this.damage = 1;
        this.life = 6;
        XRoads.Creep.apply(this, arguments);
    },
    frank: function () {
        this.speed = 200;
        this.creepType = 'frank';
        this.damage = 2;
        this.life = 5;
        XRoads.Creep.apply(this, arguments);
    }
};
