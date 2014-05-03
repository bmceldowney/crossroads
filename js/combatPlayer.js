var CombatPlayer;

(function () {

    CombatPlayer = function (game) {
        var sprite
          , isMoving
          , controls
          , direction
          , velocity
          , creepType = 'player'
          , spriteStr = 'dude';

        this.preload = function () {
            game.load.spritesheet(spriteStr, 'assets/beav.png', 48, 48);
            game.load.image('bullet', 'assets/playerbullet.png');
        };

        this.create = function () {
            this.speed = 150;
            this.stepDistance = 2;
            //var fps = (5 + 11) - Math.floor((((this.speed - 200) / 500) * 6) + 5);
            var fps = 10;

            this.sprite = sprite = game.add.sprite(240, 180, spriteStr);

            this.sprite.anchor.setTo(.5, .5);//anchor

            this.lastDir = { x: null, y: null, letter: null, node: null, lastNode: null };
            this.moving = false;
            this.isDead = false;
            this.creepType = 'player';
            this.life = 10;
            this.damage = 1;
            this.currentNode = null;
            this.lastNode = null;
            this.nextNode = null;
            //this.sprite.animations.add('walkUp', [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35], fps, true);
            //this.sprite.animations.add('walkRight', [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], fps, true);
            //this.sprite.animations.add('walkDown', [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47], fps, true);
            //this.sprite.animations.add('walkLeft', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], fps, true);
            this.sprite.animations.add('walkUp', [9, 10, 11, 10], fps, true);
            this.sprite.animations.add('walkRight', [0, 1, 2, 1], fps, true);
            this.sprite.animations.add('walkDown', [6, 7, 8, 7], fps, true);
            this.sprite.animations.add('walkLeft', [3, 4, 5, 4], fps, true);
            this.sprite.animations.add('fighting', [1, 4, 7, 10], fps, true);
            this.sprite.animations.add('death', [0, 4, 8, 9], fps, true);
            this.sprite.animations.add('shooting', [11, 12, 13], fps, true);

            this.bulletVector = { x: 0, y: 0 };
            this.bulletSpeed = 200;
            this.bulletRate = 350;
            this.bulletTime = 0;
            this.bulletDamage = 1;
            this.bulletWrap = true;
            this.bullet;

            controls = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                shoot: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
            };

            XRoads.CombatPlayer.bullets = game.add.group();
            XRoads.CombatPlayer.bullets.enableBody = true;
            XRoads.CombatPlayer.bullets.physicsBodyType = Phaser.Physics.ARCADE;

            for (var i = 0; i < 20; i++) {
                var b = new XRoads.PlayerBullet(0, 0, 'bullet');
                XRoads.CombatPlayer.bullets.add(b);
                b.anchor.setTo(.5, .5);
                b.name = 'bullet' + i;
                b.damage = this.bulletDamage;
                b.exists = false;
                b.visible = false;
                b.life = 1;
                //insurance if bullets get wrong
                b.checkWorldBounds = true;
                b.events.onOutOfBounds.add(this.resetBullet, this);
            }

        };

        this.update = function () {
            //Dunno why this shit does not work
            //game.physics.arcade.overlap(this.bullets, this.sprite, this.bulletSelfCollisionHandler, null, this);
            this.upkeep();
            this.move();
            this.shoot();
            
        };
        this.upkeep = function () {
            //upkeep() must occur before move()
            
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
            function onDeathComplete() {
                game.state.start('menu');
            }
        };
        this.move = function () {
            var tempNode = {};
            isMoving = false;
            
            
            if (!this.isDead) {
                if (controls.up.isDown) { // && !sprite.body.blocked.up
                    tempNode = XRoads.GridNodes.getNodeFromPos(this.sprite.x, this.sprite.y - this.sprite.height * .5);
                    if (tempNode) {
                        if (!tempNode.isWall && !tempNode.isOccupied) {
                            sprite.y -= this.stepDistance;
                        }
                        if (tempNode.isOccupied && tempNode.occupant === this) {
                            sprite.y -= this.stepDistance;
                        }
                    } else if (!this.currentNode.n.isWall && !this.currentNode.n.isOccupied) {
                        sprite.y = XRoads.CombatMap.heightInPixels - this.stepDistance;
                    }
                    sprite.animations.play('walkUp');
                    this.bulletVector.y = -1;
                    this.bulletVector.x = 0;
                    isMoving = true;
                };
                if (controls.down.isDown) { // && !sprite.body.blocked.down
                    tempNode = XRoads.GridNodes.getNodeFromPos(this.sprite.x, this.sprite.y + this.sprite.height * .5);
                    if (tempNode) {
                        if (!tempNode.isWall && !tempNode.isOccupied) {
                            sprite.y += this.stepDistance;
                        }
                        if (tempNode.isOccupied && tempNode.occupant === this) {
                            sprite.y += this.stepDistance;
                        }
                    } else if (!this.currentNode.s.isWall && !this.currentNode.s.isOccupied) {
                        sprite.y = this.stepDistance;
                    }
                    sprite.animations.play('walkDown');
                    this.bulletVector.y = 1;
                    this.bulletVector.x = 0;
                    isMoving = true;
                };
                if (controls.left.isDown) { // && !sprite.body.blocked.left
                    tempNode = XRoads.GridNodes.getNodeFromPos(this.sprite.x - this.sprite.width * .5, this.sprite.y);
                    if (tempNode) {
                        if (!tempNode.isWall && !tempNode.isOccupied) {
                            sprite.x -= this.stepDistance;
                        }
                        if (tempNode.isOccupied && tempNode.occupant === this) {
                            sprite.x -= this.stepDistance;
                        }
                    } else if (!this.currentNode.w.isWall && !this.currentNode.w.isOccupied) {
                        sprite.x = XRoads.CombatMap.widthInPixels - this.stepDistance;
                    }
                    sprite.animations.play('walkLeft');
                    this.bulletVector.x = -1;
                    this.bulletVector.y = 0;
                    isMoving = true;
                };
                if (controls.right.isDown) { // && !sprite.body.blocked.right
                    tempNode = XRoads.GridNodes.getNodeFromPos(this.sprite.x + this.sprite.width * .5, this.sprite.y);
                    if (tempNode) {
                        if (!tempNode.isWall && !tempNode.isOccupied) {
                            sprite.x += this.stepDistance;
                        }
                        if (tempNode.isOccupied && tempNode.occupant === this) {
                            sprite.x += this.stepDistance;
                        }
                    } else if (!this.currentNode.e.isWall && !this.currentNode.e.isOccupied) {
                        sprite.x = this.stepDistance;
                    }
                    sprite.animations.play('walkRight');
                    this.bulletVector.x = 1;
                    this.bulletVector.y = 0;
                    isMoving = true;
                };
                
                if (!isMoving) {
                    sprite.animations.stop();
                };
                //Do stuff and Lay a trail if the node changes
                this.nextNode = XRoads.GridNodes.getNodeFromPos(this.sprite.x, this.sprite.y);
                if (this.currentNode != this.nextNode) {
                    if (!this.nextNode.isWall) {
                        //XRoads.Map.replaceTile(XRoads.CombatMap, XRoads.CombatMap.WallLayer, 49, { x: this.nextNode.xPos, y: this.nextNode.yPos });
                        this.nextNode.occupant = this;
                        this.nextNode.isOccupied = true;
                        this.currentNode.occupant = null;
                        this.currentNode.isOccupied = false;
                    };
                };
            };
        };

        this.shoot = function () {
            if (controls.shoot.isDown) {
                if (game.time.now > this.bulletTime) {
                    this.bullet = this.bullets.getFirstExists(false);

                    if (this.bullet) {
                        this.bullet.reset(this.sprite.x, this.sprite.y);
                        this.bullet.body.velocity.y = this.bulletVector.y * this.bulletSpeed;
                        this.bullet.body.velocity.x = this.bulletVector.x * this.bulletSpeed;
                        this.bulletTime = game.time.now + this.bulletRate;
                    }
                }
            }
        };
        this.bulletSelfCollisionHandler = function (bullet, mySprite) {
            //this.life -= this.bulletDamage;
            this.life -= bullet.damage;
            //bullet.resetMe();
        }
        this.resetBullet = function (bullet) {
            bullet.resetMe();
        };
    };

})();
