(function () {
    var game
      , grid = XRoads.Grid
      , manager;

    XRoads.Creep = function (x, y) {
        var point = grid.gridToPoint(x, y);
        game = XRoads.game;
        var fps = (5 + 11) - Math.floor((((this.speed - 200) / 500) * 6) + 5);
        Phaser.Sprite.call(this, game, point.x, point.y, this.creepType);
        game.add.existing(this);
        
        //this.anchor.setTo(.5, .5);
        this.lastDir = { x: null, y: null, letter: null, node: null, lastNode: null };
        this.moving = false;
        this.isDead = false;
        this.currentNode = null;
        this.animations.add('walkUp', [0, 1, 2, 1], fps, true);
        this.animations.add('walkRight', [3, 4, 5, 4], fps, true);
        this.animations.add('walkDown', [6, 7, 8, 7], fps, true);
        this.animations.add('walkLeft', [9, 10, 11, 10], fps, true);
        this.animations.add('fighting', [1, 4, 7, 10], fps, true);
        this.animations.add('death', [0, 4, 8, 9], fps, true);
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
            this.currentNode = dir.node;
            if (dir.node[dir.letter]) {
                //Occupy nodes early to prevent creeps from walking into the same node
                dir.node[dir.letter].isOccupied = true;
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
                    dir.node.isOccupied = false;
                    dir.node.occupant = null;
                    dir.node[dir.letter].occupant = this;
                    this.currentNode = dir.node[dir.letter];
                }
            };
            function onDoneComplete() {
                this.moving = false;
                if (this.life < .1) {
                    this.isDead = true;
                    this.animations.play('death');
                    
                    if (dir.node[dir.letter]){
                        dir.node[dir.letter].occupant = null;
                        dir.node[dir.letter].isOccupied = false;
                    }

                    this.tweenDeath = game.add.tween(this).to({ alpha: 0 }, 2000, null, true);
                    this.bringToTop();
                    this.tweenDeath.onComplete.add(onDeathComplete, this);
                }
            };
            function onDeathComplete() {
                dir.node.isOccupied = false;
                dir.node.occupant = null;
                XRoads.Map.replaceTile(XRoads.CombatMap, XRoads.CombatMap.WallLayer, 13, dir)
                if (this.onDeath) {
                    this.onDeath();
                }
                this.kill();
            }
            function onWrapComplete() {
                if (Math.abs(dir.x - x)) {
                    this.x = dir.x - shift.x;
                } else {
                    this.y = dir.y - shift.y;
                }
                this.tween2 = game.add.tween(this).to(step, this.speed, null, true);
                this.tween2.onComplete.add(onDoneComplete, this);
                if (dir.letter) {
                    dir.node.isOccupied = false;
                    dir.node.occupant = null;
                }
            };
            function onFightComplete() {
                this.tween2 = game.add.tween(this).to(step, this.speed, null, true);
                this.tween2.onComplete.add(onDoneComplete, this);
                if (dir.letter) {
                    dir.node.isOccupied = false;
                    dir.node.occupant = null;
                    dir.node[dir.letter].occupant = this;
                }
            };
            if (dir.fight) {
                this.animations.play('fighting');
                dir.node[dir.fightLetter].occupant.life -= this.damage;
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
        //var dir = XRoads.Creep.randomAvailableFromNode(node); //move randomly
        var dir = this.walkWithPurpose(node, this.lastDir.letter);
        this.lastDir.letter = dir.letter;
        dir.node = node;
        this.lastDir.node = node;
        this.animations.play(animations[dir.letter]);

        return dir;
    };
    XRoads.Creep.prototype.randomAvailableFromNode = function (node) {
        var directions = [];
        var dLetter = [];
        var m = 0;

        if (!node.n.isWall && !node.n.isOccupied) {
            directions.push(node.n);
            dLetter.push('n');
            m++;
        }
        if (!node.s.isWall && !node.s.isOccupied) {
            directions.push(node.s);
            dLetter.push('s');
            m++;
        }
        if (!node.e.isWall && !node.e.isOccupied) {
            directions.push(node.e);
            dLetter.push('e');
            m++;
        }
        if (!node.w.isWall && !node.w.isOccupied) {
            directions.push(node.w);
            dLetter.push('w');
            m++;
        }

        if (m === 0) {
            //No where to go. Stay put
            return { x: node.xPos, y: node.yPos, letter: null, node: node };
        } else {
            //Math.random() will never return 1;
            var r = Math.floor(Math.random() * m);

            var dir = { x: 0, y: 0 };
            dir.x = directions[r].xPos;
            dir.y = directions[r].yPos;
            dir.letter = dLetter[r];
            dir.node = node;
            return dir;
        }
    };

    XRoads.Creep.prototype.walkWithPurpose = function (node, letter) {
        if (!letter) {
            return this.randomAvailableFromNode(node);
        }

        if (this.wannaFight(node, letter)) {
            return { x: node.xPos, y: node.yPos, letter: null, node: node, fight: true, fightLetter: letter };
        }

        if (!node[letter].isWall && !node[letter].isOccupied && Math.random() * 16 < 15) {
            var dir = { x: 0, y: 0 };
            dir.x = node[letter].xPos;
            dir.y = node[letter].yPos;
            dir.letter = letter;
            dir.node = node;
            return dir;
        } else {
            return this.randomAvailableFromNode(node);
        }
    };
    XRoads.Creep.prototype.wannaFight = function (node, letter) {
        if (node[letter].occupant && node.occupant) {
            for (var i = 0; i < node.occupant.hates.length; i++) {
                if (node[letter].occupant.creepType === node.occupant.hates[i]) {
                    return true;
                }
            }
        }
    }
    XRoads.Creep.prototype.render = function () {

    };
})();
