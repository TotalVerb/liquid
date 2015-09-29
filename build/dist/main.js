define(["exports", "edge", "display", "territory"], function (exports, _edge, _display, _territory) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  const gameArea = new fabric.Canvas("game-area");
  gameArea.selection = false;

  var Map = (function () {
    function Map(width = 4, height = 4) {
      _classCallCheck(this, Map);

      this.width = width;
      this.height = height;

      // Map "x y" -> Territory
      this.inTerritory = {};

      // Map 5 -> Territory
      this.territories = {};

      // Map "v x y" -> Edge
      this.edgeObject = {};

      // Create territories
      for (var x = 0; x < width; x++) {
        for (var y = 0; y < width; y++) {
          const id = x + y * width; // Territory ID
          const newTerritory = new _territory.Territory(id, [[x, y]]);
          this.inTerritory[(0, _territory.pack)(x, y)] = newTerritory;
          this.territories[id] = newTerritory;
        }
      }

      // Create edges
      for (var t of "hv") {
        for (var x = 0; x < this.width + _edge.EDGE_OFFSETS[t][0]; x++) {
          for (var y = 0; y < this.height + _edge.EDGE_OFFSETS[t][1]; y++) {
            this.edgeObject[`${ t }${ x } ${ y }`] = new _edge.EDGE_CLASS[t](x, y);
          }
        }
      }
    }

    _createClass(Map, [{
      key: "getTerritory",
      value: function getTerritory(x, y) {
        return this.inTerritory[(0, _territory.pack)(x, y)];
      }
    }, {
      key: "getTerritoryFromId",
      value: function getTerritoryFromId(id) {
        return this.territories[id];
      }
    }, {
      key: "getEdge",
      value: function getEdge(packed) {
        return this.edgeObject[packed];
      }
    }, {
      key: "weakestEdge",
      value: function weakestEdge(territory) {
        // Get an array of edges...
        var edges = Array.from(territory.edges());

        // Eliminate edges that don't exist.
        edges = edges.filter(e => this.edgeObject[e]).map(e => this.edgeObject[e]);

        // Find the weakest edge.
        return edges.reduce((e1, e2) => e2.strength > e1.strength ? e1 : e2, edges[0]);
      }
    }, {
      key: "fillTerritory",
      value: function fillTerritory(territory, owner, add = 1 / 3) {
        const full = territory.fill(owner, add);
        if (full) {
          const weakestEdge = this.weakestEdge(territory);

          // Get the territory across from that edge.
          const acrossTerritory = this.getTerritory(...weakestEdge.acrossTerritory(territory));

          // Eat that territory.
          this.territories[acrossTerritory.id] = null;
          territory.eat(acrossTerritory);
          for (var [x, y] of acrossTerritory.coordinates) {
            this.inTerritory[(0, _territory.pack)(x, y)] = territory;
          }
          this.edgeObject[weakestEdge.pack()] = null;
        }
      }
    }]);

    return Map;
  })();

  new _display.Display(new Map(), gameArea).show();
});