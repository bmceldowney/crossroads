(function () {
    var game = XRoads.game
      , easystar = XRoads.easystar
      , grid;

    XRoads.Creep = function () {

    };

    XRoads.Creep.preload = function () {
        grid = XRoads.Grid;

        game.load.spritesheet('werewolf', 'assets/werewolf.png', 16, 16);
        game.load.spritesheet('vamp', 'assets/vamp.png', 16, 16);
        game.load.spritesheet('frank', 'assets/frank.png', 16, 16);
        game.load.spritesheet('mummy', 'assets/mummy.png', 16, 16);
        game.load.spritesheet('swamp', 'assets/swamp.png', 16, 16);
    };

    XRoads.Creep.prototype.create = function () {
        var point = grid.gridToPoint(19, 11);
        this.sprite = game.add.sprite(point.x, point.y, 'werewolf');

        this.sprite.animations.add('walkUp', [0, 1, 2], 6, true);
        this.sprite.animations.add('walkRight', [3, 4, 5], 6, true);
        this.sprite.animations.add('walkDown', [6, 7, 8], 6, true);
        this.sprite.animations.add('walkLeft', [9, 10, 11], 6, true);
    };

    XRoads.Creep.prototype.update = function () {
        var x
          , y
          , step;

        if (!this.tween) {
            x = this.sprite.x;
            y = this.sprite.y;

            step = this.findDirection(x, y);

            this.tween = game.add.tween(this.sprite).to(step, 500, null, true);
            this.tween.onComplete.add(function (tween) {
                this.tween = null;
            }, this);
        }
    };

    XRoads.Creep.prototype.findDirection = function (x, y) {
        var directions = [{ x: x + 16, y: y }, { y: y, x: x - 16 }, { x: x, y: y + 16 }, { x: x, y: y - 16 }, { x: x, y: y - 16 }]
          , direction
          , gridCoords
          , animations = ['walkRight', 'walkLeft', 'walkDown', 'walkUp', 'walkUp'];

        direction = Math.floor(Math.random() * 4);
        gridCoords = grid.pointToGrid(directions[direction].x, directions[direction].y);
        if (grid.isCollision(gridCoords.x, gridCoords.y)) {
            return this.findDirection(x, y);
        }

        this.sprite.animations.play(animations[direction]);
        return directions[direction];
    };

    XRoads.Creep.prototype.render = function () {

    };

    XRoads.Creep.seed = function (config, xBound, yBound) {
        // config format: { vamp: 4, swamp: 4, random: 25, etc... }

        config.forEach(function (monsterCount) {

        });
    };
})();
