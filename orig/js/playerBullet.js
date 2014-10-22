(function () {
    var game,
        damage;

    XRoads.PlayerBullet = function (x, y, asset) {
        game = XRoads.game;
        //var fps = (5 + 11) - Math.floor((((this.speed - 200) / 500) * 6) + 5);
        Phaser.Sprite.call(this, game, x, y, asset);
    };

    XRoads.PlayerBullet.prototype = Object.create(Phaser.Sprite.prototype);
    XRoads.PlayerBullet.prototype.constructor = XRoads.PlayerBullet;


    XRoads.PlayerBullet.prototype.update = function () {
        this.upkeep();
        var currentNode = XRoads.GridNodes.getNodeFromPos(this.x, this.y);
        if (currentNode) {
            if (currentNode.isWall) {
                this.kill();
            }
        } else if (this.x > XRoads.CombatMap.widthInPixels) {
            this.x = this.x - XRoads.CombatMap.widthInPixels;
        } else if (this.x < 0) {
            this.x += XRoads.CombatMap.widthInPixels;
        } else if (this.y > XRoads.CombatMap.heightInPixels) {
            this.y = this.y - XRoads.CombatMap.heightInPixels;
        } else if (this.y < 0) {
            this.y += XRoads.CombatMap.heightInPixels;
        }
        game.physics.arcade.collide(this, XRoads.CombatPlayer.bullets, this.bullet2BulletCollisionHandler, null, this);
    };
    XRoads.PlayerBullet.prototype.upkeep = function () {
        if (this.life < .1) {
            this.resetMe();
        }
    };
    XRoads.PlayerBullet.prototype.bullet2BulletCollisionHandler = function (bullet, target) {
        //bullet.resetMe();
        //target.resetMe();
        target.life -= 1;
        bullet.life -= 1;
        //this.scale = {x: 2, y: 1};
    };
    XRoads.PlayerBullet.prototype.resetMe = function () {
        this.life = 1;
        this.kill();
    };
})();
