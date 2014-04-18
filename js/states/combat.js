XRoads.Combat = function () { };

XRoads.Combat.prototype = {
    preload: function () {
        this.creeps = new XRoads.CreepManager(this.game);
        XRoads.Map.preload(this.game);
    },

    create: function () {
        XRoads.Map.create();
        XRoads.Grid.create(this.game);
        XRoads.GridNodes.create(XRoads.Grid.getColumns(), XRoads.Grid.getRows(), 16);
        this.creeps.populate();
    },

    update: function () {
        this.creeps.update();
    },

    render: function () {
        this.creeps.render();
        // XRoads.Grid.render();
    }
};