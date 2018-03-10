
function getEdgeColour(edg, lum = 50) {
  return `hsl(${Math.round(edg.strength * 300)}, 100%, ${lum}%)`;
}

function cursorTerritory(map, group, options, disp) {
  const hit = group.getLocalPointer(options.e);
  const x = Math.min(map.width - 1, Math.floor(hit.x / disp.scaleFactor));
  const y = Math.min(map.height - 1, Math.floor(hit.y / disp.scaleFactor));
  return map.getTerritory(x, y);
}

const STANDARD_EDGE_WIDTH = 5;
const DIM = 400;

class Player {
  constructor(id, colour) {
    this.id = id;
    this.colour = colour;
  }
}

class Sidebar {
  constructor() {
    // Load logo
    fabric.Image.fromURL('res/liquid.svg', oImg => {
      oImg = oImg.scale(0.1);
      this.playerText = new fabric.Text("You are: ", {
        top: 50,
        fontSize: 20
      });
      this.playerColour = new fabric.Rect({
        top: 50,
        left: 80,
        width: 20,
        height: 20,
        stroke: 'black',
        fill: 'white'
      });
      this.sidebarGroup = new fabric.Group([oImg, this.playerText, this.playerColour], {
        left: 500,
        top: 20
      });
    });
  }

  attach(parent, callback = () => {}) {
    if (this.sidebarGroup !== undefined) {
      parent.add(this.sidebarGroup);
      callback();
    } else {
      setTimeout(() => this.attach(parent, callback), 100);
    }
  }

  update(player, callback = () => {}) {
    if (this.sidebarGroup !== undefined) {
      this.playerColour.fill = player.colour;
      callback();
    } else {
      setTimeout(() => this.update(player, callback), 100);
    }
  }
}

export class Display {
  constructor(map, gameArea) {
    this.gameArea = gameArea;
    this.map = map;
    this.edges = {};
    this.waters = {};
    this.players = [new Player(0, 'rgba(100, 100, 255, 0.5)'), new Player(1, 'rgba(100, 255, 100, 0.5)')];
    this.currentPlayer = this.players[0];
    this.lastFatEdge = null;
    this.gameRectangle = new fabric.Rect({
      top: 0,
      left: 0,
      width: DIM,
      height: DIM,
      fill: '#CCC',
      stroke: 'black',
      strokeWidth: STANDARD_EDGE_WIDTH
    });
    this.gameGroup = new fabric.Group([this.gameRectangle], {
      top: 20,
      left: 20
    });
    this.gameGroup.on('mouseup', options => {
      const territory = cursorTerritory(map, this.gameGroup, options, this);
      if (territory.owner !== null && territory.owner != this.currentPlayer.id) {
        alert('Sorry, that square has already been taken!');
        return;
      }
      this.map.fillTerritory(territory, this.currentPlayer.id);
      this.update();
      this.redrawLiquid(territory);
      this.currentPlayer = this.players[(this.currentPlayer.id + 1) % this.players.length];
      this.beforeMove();
    });
    this.gameGroup.on('mousemove', options => {
      const territory = cursorTerritory(map, this.gameGroup, options, this);
      const weakestEdge = this.map.weakestEdge(territory);
      const lfe = this.lastFatEdge;
      const nfe = weakestEdge.pack();
      if (lfe && this.edges[lfe]) {
        this.edges[lfe].stroke = getEdgeColour(map.getEdge(lfe));
      }
      this.edges[nfe].stroke = getEdgeColour(map.getEdge(nfe), 90);
      this.lastFatEdge = nfe;
      this.gameArea.renderAll();
    });

    this.scaleFactor = Math.min(DIM / map.width, DIM / map.height);

    for (let e of Object.keys(map.edgeObject)) {
      const edg = map.getEdge(e);
      const fbObject = new fabric.Line([edg.x1 * this.scaleFactor - DIM / 2, edg.y1 * this.scaleFactor - DIM / 2, edg.x2 * this.scaleFactor - DIM / 2, edg.y2 * this.scaleFactor - DIM / 2], {
        stroke: getEdgeColour(edg),
        strokeWidth: STANDARD_EDGE_WIDTH
      });
      this.edges[edg.pack()] = fbObject;
      this.gameGroup.add(fbObject);
    }

    for (let t of Object.keys(map.territories)) {
      this.waters[t] = [];
    }

    this.sidebar = new Sidebar();
    this.beforeMove();
  }

  show() {
    const area = this.gameArea;

    area.add(this.gameGroup);
    area.forEachObject(obj => obj.selectable = false);

    this.sidebar.attach(area, () => area.forEachObject(obj => obj.selectable = false));
  }

  beforeMove() {
    // Update sidebar.
    this.sidebar.update(this.currentPlayer, () => this.gameArea.renderAll() // callback
    );
  }

  update() {
    // Update edges.
    for (let e of Object.keys(this.edges)) {
      const edg = this.map.getEdge(e);
      if (edg === null) {
        this.gameGroup.remove(this.edges[e]);
        delete this.edges[e];
      }
    }

    // Update territories
    for (let t of Object.keys(this.waters)) {
      if (this.map.getTerritoryFromId(t) === null) {
        for (let ko of this.waters[t]) {
          this.gameGroup.remove(ko);
        }
        delete this.waters[t];
      }
    }
  }

  redrawLiquid(territory) {
    for (let ko of this.waters[territory.id]) {
      this.gameGroup.remove(ko);
    }
    this.waters[territory.id] = [];

    for (let rect of territory.liquidRects()) {
      const [x, y, depth] = rect;
      const newObj = new fabric.Rect({
        left: this.scaleFactor * x - DIM / 2,
        top: this.scaleFactor * y - DIM / 2 + this.scaleFactor * (1 - depth),
        width: this.scaleFactor,
        height: this.scaleFactor * depth,
        fill: this.players[territory.owner].colour
      });
      this.waters[territory.id].push(newObj);
      this.gameGroup.add(newObj);
      newObj.moveTo(1);
    }
  }
}