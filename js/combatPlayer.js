var CombatPlayer;

(function () {
    var isJumpStarted;

    CombatPlayer = function (game) {
        var sprite
          , isMoving
          , cursors
          , direction
          , velocity
          , creepType = 'player'
          , spriteStr = 'dude';

        this.preload = function () {
            game.load.spritesheet(spriteStr, 'assets/player.png', 16, 18);
        };

        this.create = function () {
            this.speed = 150;
            var fps = (5 + 11) - Math.floor((((this.speed - 200) / 500) * 6) + 5);

            this.sprite = sprite = game.add.sprite(240, 180, spriteStr);

            this.sprite.anchor.setTo(.5, .5);//anchor

            this.lastDir = { x: null, y: null, letter: null, node: null, lastNode: null };
            this.moving = false;
            this.isDead = false;
            this.creepType = 'player';
            this.life = 70;
            this.damage = 1;
            this.currentNode = null;
            this.lastNode = null;
            this.nextNode = null;
            this.sprite.animations.add('walkUp', [0, 1, 2, 1], fps, true);
            this.sprite.animations.add('walkRight', [3, 4, 5, 4], fps, true);
            this.sprite.animations.add('walkDown', [6, 7, 8, 7], fps, true);
            this.sprite.animations.add('walkLeft', [9, 10, 11, 10], fps, true);
            this.sprite.animations.add('fighting', [1, 4, 7, 10], fps, true);
            this.sprite.animations.add('death', [0, 4, 8, 9], fps, true);

            cursors = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S)
            };
        };

        this.update = function () {
            var tempNode = {};
            isMoving = false;
            this.currentNode = XRoads.GridNodes.getNodeFromPos(this.sprite.x, this.sprite.y);
            if (this.life < .1) {
                this.isDead = true;
                this.sprite.animations.play('death');

                if (this.currentNode) {
                    this.currentNode.occupant = null;
                    this.currentNode.isOccupied = false;
                }
                XRoads.Map.replaceTile(XRoads.CombatMap, XRoads.CombatMap.WallLayer, 15, { x: this.currentNode.xPos, y: this.currentNode.yPos });
                this.sprite.tweenDeath = game.add.tween(this.sprite).to({ alpha: 0 }, 5000, null, true);
                this.sprite.tweenDeath.onComplete.add(onDeathComplete, this);
                this.sprite.bringToTop();
            };
            if (!this.isDead) {
                if (cursors.left.isDown) { // && !sprite.body.blocked.left
                    tempNode = XRoads.GridNodes.getNodeFromPos(this.sprite.x - 8, this.sprite.y);
                    if (tempNode) {
                        if (!tempNode.isWall && !tempNode.isOccupied) {
                            sprite.x -= 2;
                        }
                        if (tempNode.isOccupied && tempNode.occupant === this) {
                            sprite.x -= 2;
                        }
                    }
                    sprite.animations.play('walkLeft');
                    isMoving = true;
                };
                if (cursors.right.isDown) { // && !sprite.body.blocked.right
                    tempNode = XRoads.GridNodes.getNodeFromPos(this.sprite.x + 8, this.sprite.y);
                    if (tempNode) {
                        if (!tempNode.isWall && !tempNode.isOccupied) {
                            sprite.x += 2;
                        }
                        if (tempNode.isOccupied && tempNode.occupant === this) {
                            sprite.x += 2;
                        }
                    }
                    sprite.animations.play('walkRight');
                    isMoving = true;
                };
                if (cursors.up.isDown) { // && !sprite.body.blocked.right
                    tempNode = XRoads.GridNodes.getNodeFromPos(this.sprite.x, this.sprite.y - 8);
                    if (tempNode) {
                        if (!tempNode.isWall && !tempNode.isOccupied) {
                            sprite.y -= 2;
                        }
                        if (tempNode.isOccupied && tempNode.occupant === this) {
                            sprite.y -= 2;
                        }
                    }
                    sprite.animations.play('walkUp');
                    isMoving = true;
                };
                if (cursors.down.isDown) { // && !sprite.body.blocked.right
                    tempNode = XRoads.GridNodes.getNodeFromPos(this.sprite.x, this.sprite.y + 8);
                    if (tempNode) {
                        if (!tempNode.isWall && !tempNode.isOccupied) {
                            sprite.y += 2;
                        }
                        if (tempNode.isOccupied && tempNode.occupant === this) {
                            sprite.y += 2;
                        }
                    }
                    sprite.animations.play('walkDown');
                    isMoving = true;
                };
                if (!isMoving) {
                    sprite.animations.stop();
                };
                //Do stuff and Lay a trail if the node changes
                this.nextNode = XRoads.GridNodes.getNodeFromPos(this.sprite.x, this.sprite.y);
                if (this.currentNode != this.nextNode) {
                    if (!this.nextNode.isWall) {
                        XRoads.Map.replaceTile(XRoads.CombatMap, XRoads.CombatMap.WallLayer, 49, { x: this.nextNode.xPos, y: this.nextNode.yPos });
                        this.nextNode.occupant = this;
                        this.nextNode.isOccupied = true;
                        this.currentNode.occupant = null;
                        this.currentNode.isOccupied = false;
                    };
                };
            };
            function onDeathComplete() {
                game.state.start('menu');
            }
            
        };
    };

})();
