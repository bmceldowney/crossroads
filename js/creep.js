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
        var point = grid.gridToPoint(3, 1);
        this.sprite = game.add.sprite(point.x, point.y, 'werewolf');

        this.sprite.animations.add('walkUp', [0, 1, 2], 6, true);
        this.sprite.animations.add('walkRight', [3, 4, 5], 6, true);
        this.sprite.animations.add('walkDown', [6, 7, 8], 6, true);
        this.sprite.animations.add('walkLeft', [9, 10, 11], 6, true);
    };

    XRoads.Creep.prototype.update = function () {
        
        this.sprite.animations.play('walkLeft');
    };

    XRoads.Creep.prototype.render = function () {

    };
})();
