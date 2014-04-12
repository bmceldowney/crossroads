(function () {
    var game = XRoads.game
      , grid = XRoads.Grid;

    XRoads.Creep = function (type, x, y) {
        var point = grid.gridToPoint(x, y);
        this.sprite = game.add.sprite(point.x, point.y, type);
        
        this.moving = false;
        this.sprite.animations.add('walkUp', [0, 1, 2], 6, true);
        this.sprite.animations.add('walkRight', [3, 4, 5], 6, true);
        this.sprite.animations.add('walkDown', [6, 7, 8], 6, true);
        this.sprite.animations.add('walkLeft', [9, 10, 11], 6, true);
    };

    XRoads.Creep.prototype.update = function () {
        //the movement is divided into 2 steps & tweens.
        //this is so creeps only occupy a node the instant the sprite cross into it.
        //Also, it will help us with better looking world wraps.
        var x
          , y
          , move
          //tweens can use relative movement coordinates
          , step = {x: '+0', y: '+0'};

        if (!this.moving) {
            x = this.sprite.x;
            y = this.sprite.y;
            this.moving = true;
            move = this.findDirection(x, y);

            switch (move.letter) {
                case 'n' :
                    step.y = '+8';
                    break;
                case 's' :
                    step.y = '-8';
                    break;
                case 'e' :
                    step.x = '+8';
                    break;
                case 'w' :
                    step.x = '-8';
                    break;
                default :
                    step.x = '+0';
                    step.y = '+0';
                    break;
            }

            this.tween1 = game.add.tween(this.sprite).to(step, 500, null, true);
            this.tween1.onComplete.add(onStepComplete, this);

            function onStepComplete() {
                this.tween2 = game.add.tween(this.sprite).to(step, 4500, null, true);
                this.tween2.onComplete.add(onDoneComplete, this);
            };
            function onDoneComplete() {
                this.moving = false;
            };
            //if (Math.abs(step.x - x) < 100 && Math.abs(step.y - y) < 100) {
            //    this.tween1 = game.add.tween(this.sprite).to(shuf, 500, null, true);
            //} else {
            //    //World wrap occurs
            //    if (Math.abs(step.x - x)) {
            //        this.sprite.x = step.x;
            //    } else {
            //        this.sprite.y = step.y;
            //    }
            //    this.tween = game.add.tween(this.sprite).to(step, 500, null, true);
            //}

            

            //this.tween.onComplete.add(function (tween) {
            //    this.tween = null;
            //}, this);
        }
    };
    

    XRoads.Creep.prototype.findDirection = function (x, y) {
        var gridCoords
          , animations = {e: 'walkRight', w: 'walkLeft', s: 'walkDown', n: 'walkUp'};

        gridCoords = grid.pointToGrid(x, y);
        var node = XRoads.GridNodes.getNodeFromCoords(gridCoords.x, gridCoords.y);
        var dir = XRoads.GridNodes.randomAvailableFromNode(node);

        this.sprite.animations.play(animations[dir.letter]);

        return dir;
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
