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
    //XRoads.CM._creeps.getAt(0).newDirection = this.goUpCreep(XRoads.CM._creeps.getAt(0));
    //var tempCreep = XRoads.CM._creeps.getRandom();
    //tempCreep.newDirection = true;

    
    XRoads.CM._creeps.forEach(function(tempCreep){
        tempCreep.newDirection = true;
    });
    
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

XRoads.Behaviors.prototype.getAnUpNode = function (node, creep, searchDepth) {
    var destinationNode = null;
    var tempNode = null;
    var letter = null;
    var solved = false;
    var consider = [];
    var dir = { x: 0, y: 0 };
    
    if (creep.wayless < 1) {
        if (!node.n.isWall) {
            destinationNode = node.n;
            letter = 'n';
            solved = true;
            if (creep.rut > 0){
                creep.rut--;
            }
        }
        if (!node.ne.isWall && !node.e.isWall && !node.n.n.isWall) {
            solved = true;
            consider.push('e');
        }
        if (!node.nw.isWall && !node.w.isWall && !node.n.n.isWall) {
            solved = true;
            consider.push('w');
        }
        if (node.n.isWall && node.e.isWall) {
            destinationNode = node.w;
            letter = 'w';
            solved = true;
            creep.bias = -1;
        }
        if (node.n.isWall && node.w.isWall) {
            destinationNode = node.e;
            letter = 'e';
            solved = true;
            creep.bias = 1;
        }
        if (node.n.isWall && !node.w.isWall && !node.e.isWall) {
            if (creep.bias !== 0) {
                if (creep.bias > 0) {
                    destinationNode = node.e;
                    letter = 'e';
                    solved = true;
                } else {
                    destinationNode = node.w;
                    letter = 'w';
                    solved = true;
                }
                creep.rut++;
                if (creep.rut > 5) {
                    creep.rut = 0;
                    creep.wayless = 15;
                }
            } else {
                return creep.findDefaultDirection(creep.x, creep.y);
            }
            
        }
        if (node.n.isWall && node.e.isWall && node.w.isWall) {
            creep.bias = 0;
            creep.wayless = 9;
        }
        /*
        for (var i = 0; i < searchdepth; i++) {
            if (!node.ne.e.iswall && !node.e.isWall) {
                destinationNode = node.e;
                consider.push('e');
            }
            if (!node.nw.w.iswall && !node.w.isWall) {
                destinationNode = node.w;
                consider.push('w');
            }
        }
        */
    } else {
        creep.wayless--;
        return creep.findDefaultDirection(creep.x, creep.y);
    }

    
    if (solved) {
        if (destinationNode) {
            dir.x = destinationNode.xPos;
            dir.y = destinationNode.yPos;
            dir.letter = letter;
            dir.node = node;
        } else {
            letter = consider[Math.floor(Math.random() * consider.length)];
            destinationNode = node[letter];
            dir.x = destinationNode.xPos;
            dir.y = destinationNode.yPos;
            dir.letter = letter;
            dir.node = node;
        }
    } else {
        return creep.findDefaultDirection(creep.x, creep.y);
    }
    if (destinationNode) {
        if (destinationNode.isOccupied) {
            if (creep.wannaFight(node, letter)) {
                return { x: node.xPos, y: node.yPos, letter: null, node: node, fight: true, fightLetter: letter };
            } else {
                return creep.randomAvailableFromNode(node);
            }
        } else {
            return dir;
        }
    }

    //var dir = { x: node.n.xPos, y: node.n.yPos, letter: 'n', node: node };
    //return dir;
}