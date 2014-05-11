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
    XRoads.CM._creeps.getAt(0).newDirection = this.goUpCreep(XRoads.CM._creeps.getAt(0));
}

//
XRoads.Behaviors.prototype.goUpCreep = function (creep) {
    var gridCoords;
    gridCoords = XRoads.Grid.pointToGrid(creep.x, creep.y);
    var node = XRoads.GridNodes.getNodeFromCoords(gridCoords.x, gridCoords.y);
    //var node = creep.currentNode;
    var dir = XRoads.Behaviors.getAnUpNode(node, creep);
    return dir;
};

XRoads.Behaviors.prototype.getAnUpNode = function (node, creep) {
    var tempNode = null;
    var letter = null;
    var solved = false;
    if (!node.n.isWall) {
        tempNode = node.n;
        letter = 'n';
        solved = true;
    } else if (!node.ne.iswall) {
        tempNode = node.e;
        letter = 'e';
        solved = true;
    } else if (!node.nw.iswall) {
        tempNode = node.w;
        letter = 'w';
        solved = true;
    } else if (!node.ne.e.iswall) {
        tempNode = node.e;
        letter = 'e';
        solved = true;
    } else if (!node.nw.w.iswall) {
        tempNode = node.w;
        letter = 'w';
        solved = true;
    }
    if (tempNode.isOccupied) {
        tempNode = null;
    }
    var dir = { x: 0, y: 0 };
    if (solved) {
        if (tempNode) {
            dir.x = tempNode.xPos;
            dir.y = tempNode.yPos;
            dir.letter = letter;
            dir.node = node;
            return dir;
        } else {
            dir.x = node.xPos;
            dir.y = node.yPos;
            dir.letter = letter;
            dir.node = node;
            return dir;
        }
    } else {
        return creep.findDefaultDirection(creep.x, creep.y);
    }

    //var dir = { x: node.n.xPos, y: node.n.yPos, letter: 'n', node: node };
    //return dir;
}