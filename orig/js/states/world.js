XRoads.World = function () { };

XRoads.World.prototype = {
    preload: function () {
        this.game.load.tilemap('worldMap', 'assets/worldMap.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('worldTiles', 'assets/worldTileset_1.png');
    },

    create: function () {
        var map;
        var layer;

        map = this.game.add.tilemap('worldMap');
        map.addTilesetImage('ground', 'worldTiles');
        layer = map.createLayer('ground');
    },
};