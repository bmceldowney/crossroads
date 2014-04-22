(function () {
    var game
      , grid = XRoads.Grid;

    XRoads.Creep = function (x, y) {
        var point = grid.gridToPoint(x, y);
        game = XRoads.game;
        var fps = (5 + 11) - Math.floor((((this.speed - 200) / 500) * 6) + 5);

        Phaser.Sprite.call(this, game, point.x, point.y, this.type);
        game.add.existing(this);

        this.lastDir = { x: null, y: null, letter: null, currentNode: null, lastNode: null };
        this.moving = false;
        this.isDead = false;
        this.animations.add('walkUp', [0, 1, 2, 1], fps, true);
        this.animations.add('walkRight', [3, 4, 5, 4], fps, true);
        this.animations.add('walkDown', [6, 7, 8, 7], fps, true);
        this.animations.add('walkLeft', [9, 10, 11, 10], fps, true);
        this.animations.add('fighting', [1, 4, 7, 10], fps, true);
        //this.sprite.animations.add('death', [12, 13, 14], fps, true);
    };

    XRoads.Creep.prototype = Object.create(Phaser.Sprite.prototype);

    XRoads.Creep.prototype.update = function () {
        //the movement is divided into 2 steps & tweens.
        //Creeps occupy a node the instant they decide to go there (before tween1). 
        //Creeps leave their node after tween1 completes, or - the moment they leave the old space.
        //Also, 2 steps/tweens helps us with better looking world wrapping.
        var x
          , y
          , dir
          //tweens can use relative movement coordinates
          , step = { x: '+0', y: '+0' }
          , shift = { x: 0, y: 0 };

        if (!this.moving && !this.isDead) {
            x = this.x;
            y = this.y;
            this.moving = true;
            dir = this.findDirection(x, y);
            if (dir.currentNode[dir.letter]) {
                //Occupy nodes early to prevent creeps from walking into the same node
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
                this.tween2 = game.add.tween(this).to(step, this.speed, null, true);
                this.tween2.onComplete.add(onDoneComplete, this);
                if (dir.letter) {
                    dir.currentNode.isOccupied = false;
                    dir.currentNode.occupant = null;
                    dir.currentNode[dir.letter].occupant = this;
                }
            };
            function onDoneComplete() {
                this.moving = false;
                if (this.life < .1) {
                    this.isDead = true;
                    this.animations.play('fighting');
                    if (dir.currentNode[dir.letter]){
                        dir.currentNode[dir.letter].occupant = null;
                        dir.currentNode[dir.letter].isOccupied = false;
                    }
                    dir.currentNode.isOccupied = false;
                    dir.currentNode.occupant = null;

                    this.kill();
                }
            };
            function onWrapComplete() {
                if (Math.abs(dir.x - x)) {
                    this.x = dir.x - shift.x;
                } else {
                    this.y = dir.y - shift.y;
                }
                this.tween2 = game.add.tween(this).to(step, this.speed, null, true);
                this.tween2.onComplete.add(onDoneComplete, this);
                if (dir.letter) {
                    dir.currentNode.isOccupied = false;
                    dir.currentNode.occupant = null;
                }
            };
            function onFightComplete() {
                this.tween2 = game.add.tween(this).to(step, this.speed, null, true);
                this.tween2.onComplete.add(onDoneComplete, this);
                if (dir.letter) {
                    dir.currentNode.isOccupied = false;
                    dir.currentNode.occupant = null;
                    dir.currentNode[dir.letter].occupant = this;
                }
            };
            if (dir.fight) {
                this.animations.play('fighting');
                dir.currentNode[dir.fightLetter].occupant.life -= this.damage;
                this.tweenFight = game.add.tween(this).to(step, this.speed, null, true);
                this.tweenFight.onComplete.add(onFightComplete, this);
            } else {
                //Kludgy wrap detection...
                if (Math.abs(dir.x - x) < 160 && Math.abs(dir.y - y) < 160) {
                    this.tween1 = game.add.tween(this).to(step, this.speed, null, true);
                    this.tween1.onComplete.add(onStepComplete, this);
                } else {
                    //World wrap occurs
                    this.tweenWrap = game.add.tween(this).to(step, this.speed, null, true);
                    this.tweenWrap.onComplete.add(onWrapComplete, this);
                }
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
        this.animations.play(animations[dir.letter]);

        return dir;
    };

    XRoads.Creep.prototype.render = function () {

    };
})();
