var XRoads = {};

(function () {
    var game = XRoads.game = new Phaser.Game(624, 368, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });
    XRoads.easystar = new EasyStar.js();
    var creeps;

    function preload() {
        game.load.spritesheet('werewolf', 'assets/werewolf.png', 16, 16);
        game.load.spritesheet('vamp', 'assets/vamp.png', 16, 16);
        game.load.spritesheet('frank', 'assets/frank.png', 16, 16);
        game.load.spritesheet('mummy', 'assets/mummy.png', 16, 16);
        game.load.spritesheet('swamp', 'assets/swamp.png', 16, 16);

        XRoads.Map.preload();
    }

    function create() {
        XRoads.Map.create();
        XRoads.Grid.create();
        creeps = new XRoads.CreepManager(game);
        creeps.populate();
    }

    function update() {
        creeps.update();
    }

    function render() {
        creeps.render();

        // XRoads.Grid.render();
    }
})();
