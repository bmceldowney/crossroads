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
        // direction is the next node we want to occupy.
        this.direction = { x: null, y: null, letter: null, node: null, lastNode: null };
        this.moving = false;
        this.isDead = false;
        this.currentNode = null;
        this.animations.add('walkUp', [0, 1, 2, 1], fps, true);
        this.animations.add('walkRight', [3, 4, 5, 4], fps, true);
        this.animations.add('walkDown', [6, 7, 8, 7], fps, true);
        this.animations.add('walkLeft', [9, 10, 11, 10], fps, true);
        this.animations.add('fighting', [1, 4, 7, 10], fps, true);
        this.animations.add('death', [0, 4, 8, 9], fps, true);

        this.animTranslate = { e: 'walkRight', w: 'walkLeft', s: 'walkDown', n: 'walkUp' };

        this.xPos = 0;
        this.yPos = 0;

        this.step = { x: '+0', y: '+0' };
        this.shift = { x: 0, y: 0 };

        this.tween1 = null;
        this.tween2 = null;
        this.tweenDeath = null;
        this.tweenFight = null;
    };

    XRoads.Creep.prototype = Object.create(Phaser.Sprite.prototype);

    XRoads.Creep.prototype.update = function () {
        this.upkeep();
        if (!this.moving && !this.isDead) {
            this.xPos = this.x;
            this.yPos = this.y;
            this.moving = true;
            //find next node to move to
            this.search();
            //start move sequence
            this.move();
        };
    };
    XRoads.Creep.prototype.upkeep = function () {
        game.physics.arcade.overlap(XRoads.CombatPlayer.bullets, this, this.bulletCollisionHandler, null, this);
    };

    XRoads.Creep.prototype.search = function () {
        //instead of looking for a newDirection object is this an Opportunity for dependency injection?
        if (this.newDirection) {
            this.direction = this.newDirection;
            this.currentNode = this.newDirection.node;
        } else {
            this.direction = this.findDefaultDirection(this.xPos, this.yPos);
            this.currentNode = this.direction.node;
        }
    };

    XRoads.Creep.prototype.move = function () {
        //the movement is divided into 2 steps & tweens.
        //Creeps occupy a node the instant they decide to go there (before tween1). 
        //Creeps leave their node after tween1 completes, or - the moment they leave the old space.
        //Also, 2 steps/tweens helps us with better looking world wrapping.
        if (this.direction.node[this.direction.letter]) {
            //Occupy nodes early to prevent creeps from walking into the same node
            this.direction.node[this.direction.letter].isOccupied = true;
        }
        this.step = { x: '+0', y: '+0' };
        this.shift = { x: 0, y: 0 };
        switch (this.direction.letter) {
            case 'n':
                this.step.y = '-8';
                this.shift.y = -8;
                break;
            case 's':
                this.step.y = '+8';
                this.shift.y = 8;
                break;
            case 'e':
                this.step.x = '+8';
                this.shift.x = 8;
                break;
            case 'w':
                this.step.x = '-8';
                this.shift.x = -8;
                break;
            default:
                this.step.x = '+0';
                this.step.y = '+0';
                break;
        }
        this.animations.play(this.animTranslate[this.direction.letter]);
        if (this.direction.fight) {
            this.animations.play('fighting');
            this.direction.node[this.direction.fightLetter].occupant.life -= this.damage;
            this.tweenFight = game.add.tween(this).to(this.step, this.speed, null, true);
            this.tweenFight.onComplete.add(this.onFightComplete, this);
        } else {
            //Kludgy wrap detection...
            if (Math.abs(this.direction.x - this.xPos) < 160 && Math.abs(this.direction.y - this.yPos) < 160) {
                this.tween1 = game.add.tween(this).to(this.step, this.speed, null, true);
                this.tween1.onComplete.add(this.onStepComplete, this);
            } else {
                //World wrap occurs
                this.tweenWrap = game.add.tween(this).to(this.step, this.speed, null, true);
                this.tweenWrap.onComplete.add(this.onWrapComplete, this);
            }
        }
    };

    XRoads.Creep.prototype.onStepComplete = function () {
        this.tween2 = game.add.tween(this).to(this.step, this.speed, null, true);
        this.tween2.onComplete.add(this.onDoneComplete, this);
        if (this.direction.letter) {
            this.direction.node.isOccupied = false;
            this.direction.node.occupant = null;
            this.direction.node[this.direction.letter].occupant = this;
            this.currentNode = this.direction.node[this.direction.letter];
        }
    };

    XRoads.Creep.prototype.onWrapComplete = function () {
        if (Math.abs(this.direction.x - this.xPos)) {
            this.x = this.direction.x - this.shift.x;
        } else {
            this.y = this.direction.y - this.shift.y;
        }
        this.tween2 = game.add.tween(this).to(this.step, this.speed, null, true);
        this.tween2.onComplete.add(this.onDoneComplete, this);
        if (this.direction.letter) {
            this.direction.node.isOccupied = false;
            this.direction.node.occupant = null;
        }
    };

    XRoads.Creep.prototype.onFightComplete = function () {
        this.tween2 = game.add.tween(this).to(this.step, this.speed, null, true);
        this.tween2.onComplete.add(this.onDoneComplete, this);
        if (this.direction.letter) {
            this.direction.node.isOccupied = false;
            this.direction.node.occupant = null;
            this.direction.node[this.direction.letter].occupant = this;
        }
    };

    XRoads.Creep.prototype.onDoneComplete = function () {
        this.moving = false;
        if (this.life < .1) {
            this.isDead = true;
            this.animations.play('death');

            if (this.direction.node[this.direction.letter]) {
                this.direction.node[this.direction.letter].occupant = null;
                this.direction.node[this.direction.letter].isOccupied = false;
            }

            this.tweenDeath = game.add.tween(this).to({ alpha: 0 }, 500, null, true);
            this.bringToTop();
            this.tweenDeath.onComplete.add(this.onDeathComplete, this);
        }
    };

    XRoads.Creep.prototype.onDeathComplete = function () {
        this.direction.node.isOccupied = false;
        this.direction.node.occupant = null;
        XRoads.Map.replaceTile(XRoads.CombatMap, XRoads.CombatMap.WallLayer, 13, this.direction);
        if (this.onDeath) {
            this.onDeath();
        }
        this.kill();
    }

    XRoads.Creep.prototype.findDefaultDirection = function (x, y) {
        var gridCoords;

        gridCoords = grid.pointToGrid(x, y);
        var node = XRoads.GridNodes.getNodeFromCoords(gridCoords.x, gridCoords.y);
        //var dir = XRoads.Creep.randomAvailableFromNode(node); //move randomly
        var dir = this.walkWithPurpose(node, this.lastDir.letter);
        this.lastDir.letter = dir.letter;
        dir.node = node;
        this.lastDir.node = node;
        

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
    };
    XRoads.Creep.prototype.bulletCollisionHandler = function (bullet, target) {
        target.life -= bullet.damage;
        bullet.life -= 1;
        //bullet.resetMe();
    }
    XRoads.Creep.prototype.render = function () {

    };
})();
