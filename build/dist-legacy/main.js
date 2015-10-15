define(["exports", "edge", "display", "territory"], function (exports, _edge, _display, _territory) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var gameArea = new fabric.Canvas("game-area");
  gameArea.selection = false;

  var Map = (function () {
    function Map() {
      var width = arguments[0] === undefined ? 4 : arguments[0];
      var height = arguments[1] === undefined ? 4 : arguments[1];

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
          var id = x + y * width; // Territory ID
          var newTerritory = new _territory.Territory(id, [[x, y]]);
          this.inTerritory[(0, _territory.pack)(x, y)] = newTerritory;
          this.territories[id] = newTerritory;
        }
      }

      // Create edges
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = "hv"[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var t = _step.value;

          for (var x = 0; x < this.width + _edge.EDGE_OFFSETS[t][0]; x++) {
            for (var y = 0; y < this.height + _edge.EDGE_OFFSETS[t][1]; y++) {
              this.edgeObject["" + t + "" + x + " " + y] = new _edge.EDGE_CLASS[t](x, y);
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
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
        var _this = this;

        // Get an array of edges...
        var edges = Array.from(territory.edges());

        // Eliminate edges that don't exist.
        edges = edges.filter(function (e) {
          return _this.edgeObject[e];
        }).map(function (e) {
          return _this.edgeObject[e];
        });

        // Find the weakest edge.
        return edges.reduce(function (e1, e2) {
          return e2.strength > e1.strength ? e1 : e2;
        }, edges[0]);
      }
    }, {
      key: "fillTerritory",
      value: function fillTerritory(territory, owner) {
        var add = arguments[2] === undefined ? 1 / 3 : arguments[2];

        var full = territory.fill(owner, add);
        if (full) {
          var weakestEdge = this.weakestEdge(territory);

          // Get the territory across from that edge.
          var acrossTerritory = this.getTerritory.apply(this, _toConsumableArray(weakestEdge.acrossTerritory(territory)));

          // Eat that territory.
          this.territories[acrossTerritory.id] = null;
          territory.eat(acrossTerritory);
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = acrossTerritory.coordinates[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _step2$value = _slicedToArray(_step2.value, 2);

              var x = _step2$value[0];
              var y = _step2$value[1];

              this.inTerritory[(0, _territory.pack)(x, y)] = territory;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          this.edgeObject[weakestEdge.pack()] = null;
        }
      }
    }]);

    return Map;
  })();

  new _display.Display(new Map(), gameArea).show();
});