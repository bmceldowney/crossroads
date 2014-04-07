var XRoads = {};

(function () {
    var game = XRoads.game = new Phaser.Game(624, 368, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });
    XRoads.easystar = new EasyStar.js();
    var creeps = [];

    function preload () {
        XRoads.Creep.preload();
        XRoads.Map.preload();
    }

    function create () {
        XRoads.Map.create();
        for (var i = 0; i < 10; i++) {
            var creep = new XRoads.Creep();

            creep.create();
            creeps.push(creep);
        }
    }

    function update () {
        creeps.forEach(function (creep) {
            creep.update();
        });
    }

    function render () {
        creeps.forEach(function (creep) {
            creep.render();
        });

        // XRoads.Grid.render();
    }
})();
