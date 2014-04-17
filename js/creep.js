(function () {
    var game
      , grid = XRoads.Grid;

    XRoads.Creep = function (type, x, y, _game) {
        var point = grid.gridToPoint(x, y);
        game = _game;

        this.sprite = game.add.sprite(point.x, point.y, type);
        this.lastDir = { x: null, y: null, letter: null, currentNode: null, lastNode: null };
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
          , dir
          //tweens can use relative movement coordinates
          , step = { x: '+0', y: '+0' }
          , shift = { x: 0, y: 0 };

        if (!this.moving) {
            x = this.sprite.x;
            y = this.sprite.y;
            this.moving = true;
            dir = this.findDirection(x, y);
            if (dir.currentNode[dir.letter]) {
                dir.currentNode[dir.letter].isOccupied = true;
            }

            switch (dir.letter) {
                case 'n' :
                    step.y = '-8';
                    shift.y = -8;
                    break;
                case 's' :
                    step.y = '+8';
                    shift.y = 8;
                    break;
                case 'e' :
                    step.x = '+8';
                    shift.x = 8;
                    break;
                case 'w' :
                    step.x = '-8';
                    shift.x = -8;
                    break;
                default :
                    step.x = '+0';
                    step.y = '+0';
                    break;
            }
            //Some browsers want these onComplete functions defined early.(firefox28.0)
            function onStepComplete() {
                this.tween2 = game.add.tween(this.sprite).to(step, 250, null, true);
                this.tween2.onComplete.add(onDoneComplete, this);
            };
            function onDoneComplete() {
                if (dir.letter) {
                    dir.currentNode.isOccupied = false;
                }
                this.moving = false;
            };
            function onWrapComplete() {
                if (Math.abs(dir.x - x)) {
                    this.sprite.x = dir.x - shift.x;
                } else {
                    this.sprite.y = dir.y - shift.y;
                }
                this.tween2 = game.add.tween(this.sprite).to(step, 250, null, true);
                this.tween2.onComplete.add(onDoneComplete, this);
            };

            //Kludgy wrap detection...
            if (Math.abs(dir.x - x) < 160 && Math.abs(dir.y - y) < 160) {
                this.tween1 = game.add.tween(this.sprite).to(step, 250, null, true);
                this.tween1.onComplete.add(onStepComplete, this);
            } else {
                //World wrap occurs
                this.tweenWrap = game.add.tween(this.sprite).to(step, 250, null, true);
                this.tweenWrap.onComplete.add(onWrapComplete, this);
            }

        }
    };
    

    XRoads.Creep.prototype.findDirection = function (x, y) {
        var gridCoords
          , animations = {e: 'walkRight', w: 'walkLeft', s: 'walkDown', n: 'walkUp'};

        gridCoords = grid.pointToGrid(x, y);
        var node = XRoads.GridNodes.getNodeFromCoords(gridCoords.x, gridCoords.y);
        //var dir = XRoads.GridNodes.randomAvailableFromNode(node); //move randomly
        var dir = XRoads.GridNodes.walkFromNodeToLetter(node, this.lastDir.letter);
        this.lastDir.letter = dir.letter;
        dir.currentNode = node;
        this.lastDir.currentNode = node;
        this.sprite.animations.play(animations[dir.letter]);

        return dir;
    };

    XRoads.Creep.prototype.render = function () {

    };
})();
