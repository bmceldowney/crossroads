XRoads.Behaviors = function (game) {
    this.game = game;
};

XRoads.Behaviors.prototype = {
    preload: function () {
        this.game.load.spritesheet('upcreep', 'assets/upcreep_button.png', 150, 75);
    },
    create: function () {
        this.game.add.button(this.game.world.centerX - 175, 425, 'upcreep', this.upClicked, this, 2, 1, 0);
    }
};

XRoads.Behaviors.prototype.upClicked = function () {
    //XRoads.CM._creeps[3].newDirection = this.goUpCreep(XRoads.CM._creeps[3]);
}

//not yet working!!!
XRoads.Behaviors.prototype.goUpCreep = function (creep) {
    var gridCoords,
        animations = { e: 'walkRight', w: 'walkLeft', s: 'walkDown', n: 'walkUp' };

    gridCoords = XRoads.Grid.pointToGrid(creep.x, creep.y);
    var node = XRoads.GridNodes.getNodeFromCoords(gridCoords.x, gridCoords.y);
    //var dir = XRoads.Creep.randomAvailableFromNode(node); //move randomly
    var dir = creep.walkWithPurpose(node, creep.lastDir.letter);
    creep.lastDir.letter = dir.letter;
    dir.node = node;
    creep.lastDir.node = node;
    creep.animations.play(animations[dir.letter]);

    return dir;
};