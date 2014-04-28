(function () {
    var game;

    XRoads.PlayerBullet = function (x, y, asset) {
        game = XRoads.game;
        //var fps = (5 + 11) - Math.floor((((this.speed - 200) / 500) * 6) + 5);
        Phaser.Sprite.call(this, game, x, y, asset);
    };

    XRoads.PlayerBullet.prototype = Object.create(Phaser.Sprite.prototype);
    XRoads.PlayerBullet.prototype.constructor = XRoads.PlayerBullet;

    XRoads.PlayerBullet.prototype.update = function () {
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
    };
})();
