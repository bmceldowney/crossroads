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
    var larr = ['n', 's', 'e', 'w'];
    var randLetter = larr[Math.floor(Math.random() * 4)];
    
    XRoads.CM._creeps.forEach(function(tempCreep){
        tempCreep.newDirection = randLetter;
    });
    
}

//
XRoads.Behaviors.prototype.goUpCreep = function (creep) {
    var gridCoords;
    gridCoords = XRoads.Grid.pointToGrid(creep.x, creep.y);
    var node = XRoads.GridNodes.getNodeFromCoords(gridCoords.x, gridCoords.y);
    //var node = creep.currentNode;
    
    var dir = XRoads.Behaviors.getSmartDirectionNode(node, creep, creep.newDirection);
    return dir;
};
XRoads.Behaviors.prototype.behaviorError = function (message) {
    this.message = message;
    this.name = "BehaviorError";
}
/**
* Searches for a node in a direction(n,s,e,w) and returns a navigatable node that goes that way... eventually.
*
* @method Behaviors#getSmartDirectionNode
* @param {*} node - The node to start the search from.
* @param {*} directionLetter - The compass direction letter string we want to go to: ('n', 's', 'e', 'w')
* @return {*} newDir - an object containing:
                node - The new node to move to.
                bias - Can be used to encourage consistant movements.
                rut - Can be used to prevent repetive movements.
                noWay - If no good navigation solutions have been found recently, we can give up and wander randomly for a while.
*/
XRoads.Behaviors.prototype.getSmartDirectionNode = function (node, creep, directionLetter) {
    var newDir = null,
        destinationNode = null,
        forward = directionLetter,
        left,
        right,
        bias = 0,
        rut = 0,
        noWay = 0,
        letter = null,
        solved = false,
        consider = [],
        dir = { x: 0, y: 0 };
    switch (directionLetter) {
        case 'n':
            left = 'w';
            right = 'e';
            break;
        case 's':
            left = 'e';
            right = 'w';
            break;
        case 'e':
            left = 'n';
            right = 's';
            break;
        case 'w':
            left = 's';
            right = 'n';
            break;
        default:
            throw new this.behaviorError("InvalidDirectionLetter");
            break;
    }
    forward = directionLetter;
    if (creep.wayless < 1) {
        if (!node[forward].isWall) {
            destinationNode = node[forward];
            letter = forward;
            solved = true;
            if (creep.rut > 0) {
                creep.rut--;
            }
        }
        if (!node[forward][right].isWall && !node[right].isWall && !node[forward][forward].isWall) {
            solved = true;
            consider.push(right);
        }
        if (!node[forward][left].isWall && !node[left].isWall && !node[forward][forward].isWall) {
            solved = true;
            consider.push(left);
        }
        if (node[forward].isWall && node[right].isWall) {
            destinationNode = node[left];
            letter = left;
            solved = true;
            creep.bias = -1;
        }
        if (node[forward].isWall && node[left].isWall) {
            destinationNode = node[right];
            letter = right;
            solved = true;
            creep.bias = 1;
        }
        if (node[forward].isWall && !node[left].isWall && !node[right].isWall) {
            if (creep.bias !== 0) {
                if (creep.bias > 0) {
                    destinationNode = node[right];
                    letter = right;
                    solved = true;
                } else {
                    destinationNode = node[left];
                    letter = left;
                    solved = true;
                }
                creep.rut++;
                if (creep.rut > 5) {
                    creep.rut = 0;
                    creep.wayless = 22;
                }
            } else {
                if (Math.random() < .5) {
                    destinationNode = node[left];
                    letter = left;
                    solved = true;
                    creep.bias = -1;
                } else {
                    destinationNode = node[right];
                    letter = right;
                    solved = true;
                    creep.bias = 1;
                }
            }

        }
        if (node[forward].isWall && node[right].isWall && node[left].isWall) {
            creep.bias = 0;
            creep.wayless = 9;
        }
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
}
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
                    creep.wayless = 22;
                }
            } else {
                if (Math.random() < .5) {
                    destinationNode = node.w;
                    letter = 'w';
                    solved = true;
                    creep.bias = -1;
                } else {
                    destinationNode = node.e;
                    letter = 'e';
                    solved = true;
                    creep.bias = 1;
                }

                //return creep.findDefaultDirection(creep.x, creep.y);
                //return creep.randomAvailableFromNode(node);
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