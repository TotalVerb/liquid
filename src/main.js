import {EDGE_CLASS, EDGE_OFFSETS} from "edge";
import {Display} from "display";
import {Territory, pack} from "territory";

const gameArea = new fabric.Canvas('game-area');
gameArea.selection = false;

class Map {
  constructor(width=4, height=4) {
    this.width = width;
    this.height = height;

    // Map "x y" -> Territory
    this.inTerritory = {};

    // Map 5 -> Territory
    this.territories = {};

    // Map "v x y" -> Edge
    this.edgeObject = {};

    // Create territories
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < width; y++) {
        const id = x + y * width;  // Territory ID
        const newTerritory = new Territory(id, [[x, y]]);
        this.inTerritory[pack(x, y)] = newTerritory;
        this.territories[id] = newTerritory;
      }
    }

    // Create edges
    for (let t of "hv") {
      for (let x = 0; x < this.width + EDGE_OFFSETS[t][0]; x++) {
        for (let y = 0; y < this.height + EDGE_OFFSETS[t][1]; y++) {
          this.edgeObject[`${t}${x} ${y}`] = new EDGE_CLASS[t](x, y);
        }
      }
    }
  }

  getTerritory(x, y) {
    return this.inTerritory[pack(x, y)];
  }

  getTerritoryFromId(id) {
    return this.territories[id];
  }

  getEdge(packed) {
    return this.edgeObject[packed];
  }

  weakestEdge(territory) {
    // Get an array of edges...
    let edges = Array.from(territory.edges());

    // Eliminate edges that don't exist.
    edges = edges
      .filter(e => this.edgeObject[e])
      .map(e => this.edgeObject[e]);

    // Find the weakest edge.
    return edges.reduce(
      (e1, e2) => e2.strength > e1.strength ? e1 : e2, edges[0]);
  }

  fillTerritory(territory, owner, add=1 / 3) {
    const full = territory.fill(owner, add);
    if (full) {
      const weakestEdge = this.weakestEdge(territory);

      // Get the territory across from that edge.
      const acrossTerritory = this.getTerritory(
        ...weakestEdge.acrossTerritory(territory));

      // Eat that territory.
      this.territories[acrossTerritory.id] = null;
      territory.eat(acrossTerritory);
      for (let [x, y] of acrossTerritory.coordinates) {
        this.inTerritory[pack(x, y)] = territory;
      }
      this.edgeObject[weakestEdge.pack()] = null;
    }
  }
}

(new Display(new Map(), gameArea)).show();
