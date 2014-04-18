XRoads.Menu = function () { };

(function () {
    XRoads.Menu.prototype = {
        preload: function () {
            this.game.load.spritesheet('world', 'assets/world_button.png', 150, 75);
            this.game.load.spritesheet('combat', 'assets/combat_button.png', 150, 75);
        },
        create: function () {
            this.game.add.button(this.game.world.centerX - 175, 125, 'world', worldClicked, this, 2, 1, 0);
            this.game.add.button(this.game.world.centerX + 25, 125, 'combat', combatClicked, this, 2, 1, 0);
        }
    };

    function worldClicked() {
        this.game.state.start('world');
    }

    function combatClicked() {
        this.game.state.start('combat');
    }
})();
