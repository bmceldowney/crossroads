(function () {
    var game = XRoads.game
      , grid = XRoads.Grid;

    XRoads.Creep = function (type, x, y) {
        var point = grid.gridToPoint(x, y);
        this.sprite = game.add.sprite(point.x, point.y, type);

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
          , animations = {e: 'walkRight', w: 'walkLeft', s: 'walkDown', n: 'walkUp'};

        gridCoords = grid.pointToGrid(x, y);
        var node = XRoads.GridNodes.getNodeFromCoords(gridCoords.x, gridCoords.y);
        var dir = XRoads.GridNodes.randomAvailableFromNode(node);

        this.sprite.animations.play(animations[dir.letter]);

        return { x:dir.x, y:dir.y };
        //returndir;
        /*
        if (grid.isCollision(gridCoords.x, gridCoords.y)) {
            return this.findDirection(x, y);
        }



        this.sprite.animations.play(animations[direction]);
        return directions[direction];
        */
    };

    XRoads.Creep.prototype.render = function () {

    };
})();
