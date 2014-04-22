XRoads.Combat = function () { };

XRoads.Combat.prototype = {
    preload: function () {
        XRoads.Map.preload(this.game);
        this.creeps = new XRoads.CreepManager(this.game);
    },

    create: function () {
        XRoads.Map.create();
        XRoads.Grid.create(this.game);
        XRoads.GridNodes.create(XRoads.Grid.getColumns(), XRoads.Grid.getRows(), 16);
        this.creeps.populate();
    },

    update: function () {

    },

    render: function () {

    }
};