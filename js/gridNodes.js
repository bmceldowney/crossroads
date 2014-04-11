XRoads.GridNodes = {};
//Grid nodes creates a data model for the game environment - XRoads.GridNodes.nodes
//each node has a reference to it's surrounding nodes in the game world (North, South, East West etc...), using world wrapping.
//each node contains other properties like id, isWall, isOccupied etc...
(function () {
    var nodes = XRoads.GridNodes.nodes = [],
        width,
        height;

    XRoads.GridNodes.create = function (w, h, size) {
        width = w;
        height = h;
        var a = w * h;
        //First we create a bunch of node objects
        for (var i = 0; i < a; i++) {
            nodes[i] = {};
            nodes[i].id = i;
            nodes[i].xPos = (i % w) * size;
            nodes[i].yPos = Math.floor(i / w) * size;
        }
        //Add reference to next, prev, n(orth), s(outh), e(ast), w(est)
        for (var j = 0; j < a; j++) {
            //d is basically the row number.
            var d = Math.floor(j / w);
				
            //node.next -- the last node.next is null
            if (j < a-1){
                nodes[j].next = nodes[j + 1];
            }
				
            //node.prev -- the first node.prev is null
            if (j > 0){
                nodes[j].prev = nodes[j - 1];
            }
				
            //NORTH (n)
            if (d) {
                nodes[j].n = nodes[j - w]; 
            } else {
                //world wraps to the bottom
                nodes[j].n = nodes[a - w + j];
            }
				
            //SOUTH (s)
            if (d < h - 1) {
                nodes[j].s = nodes[j+w];
            } else {
                //World wraps to the top tooo!
                nodes[j].s = nodes[j % w];
            }
				
            //EAST (e)
            if ((j+1) % w) {
                nodes[j].e = nodes[j + 1];
					
            } else {
                //World Wraps east
                nodes[j].e = nodes[j - w + 1];
            }
				
            //WEST
            if (j % w) {
                nodes[j].w = nodes[j - 1];
					 
            } else {
                //World Wraps Westward
                nodes[j].w = nodes[j + w - 1];
            }
        }
			
        //Add references to nw, sw, ne, se
        for (var k = 0; k < a; k++) {
            nodes[k].nw = nodes[k].n.w;
            nodes[k].sw = nodes[k].s.w;
				
            nodes[k].ne = nodes[k].n.e;
            nodes[k].se = nodes[k].s.e;
				
        }
        XRoads.GridNodes.addWalls();
    };
    //We add an isWall & isOccupied to each node
    XRoads.GridNodes.addWalls = function () {
        var a = width * height;
        for (var i = 0; i < a; i++) {
            if (XRoads.Grid.isCollision(i % width, Math.floor(i / width))) {
                nodes[i].isWall = true;
            } else {
                nodes[i].isWall = false;
            }
            nodes[i].isOccupied = false;
        }
    };

    XRoads.GridNodes.getNodeFromCoords = function (x, y) {
        return nodes[x * y];
    };

    XRoads.GridNodes.randomAvailableNode = function (nn) {
        var directions = [];
        var m = 0;
        
        if (!nodes[nn].n.isWall && !nodes[nn].n.isOccupied) {
            directions.push(nodes[nn].n);
            m++;
        }
        if (!nodes[nn].s.isWall && !nodes[nn].s.isOccupied) {
            directions.push(nodes[nn].s);
            m++;
        }
        if (!nodes[nn].e.isWall && !nodes[nn].e.isOccupied) {
            directions.push(nodes[nn].e);
            m++;
        }
        if (!nodes[nn].w.isWall && !nodes[nn].w.isOccupied) {
            directions.push(nodes[nn].w);
            m++;
        }
        //Math.random() will never return 1;
        var r = Math.floor(Math.random() * m);

        var pos = {x: 0, y: 0};
        pos.x = directions[r].xPos;
        pos.y = directions[r].yPos;
        //return { x: directions[r].xPos, y: directions[r].yPos };
        return pos;
        //return directions[r];
        
    };


})();