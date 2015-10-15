define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function getEdgeColour(edg) {
    var lum = arguments[1] === undefined ? 50 : arguments[1];

    return 'hsl(' + Math.round(edg.strength * 300) + ', 100%, ' + lum + '%)';
  }

  function cursorTerritory(map, group, options, disp) {
    var hit = group.getLocalPointer(options.e);
    var x = Math.min(map.width - 1, Math.floor(hit.x / disp.scaleFactor));
    var y = Math.min(map.height - 1, Math.floor(hit.y / disp.scaleFactor));
    return map.getTerritory(x, y);
  }

  var STANDARD_EDGE_WIDTH = 5;
  var DIM = 400;

  var Player = function Player(id, colour) {
    _classCallCheck(this, Player);

    this.id = id;
    this.colour = colour;
  };

  var Sidebar = (function () {
    function Sidebar() {
      var _this = this;

      _classCallCheck(this, Sidebar);

      // Load logo
      fabric.Image.fromURL('res/liquid.svg', function (oImg) {
        oImg = oImg.scale(0.1);
        _this.playerText = new fabric.Text('You are: ', {
          top: 50,
          fontSize: 20
        });
        _this.playerColour = new fabric.Rect({
          top: 50,
          left: 80,
          width: 20,
          height: 20,
          stroke: 'black',
          fill: 'white'
        });
        _this.sidebarGroup = new fabric.Group([oImg, _this.playerText, _this.playerColour], {
          left: 500,
          top: 20
        });
      });
    }

    _createClass(Sidebar, [{
      key: 'attach',
      value: function attach(parent) {
        var _this2 = this;

        var callback = arguments[1] === undefined ? function () {} : arguments[1];

        if (this.sidebarGroup !== undefined) {
          parent.add(this.sidebarGroup);
          callback();
        } else {
          setTimeout(function () {
            return _this2.attach(parent, callback);
          }, 100);
        }
      }
    }, {
      key: 'update',
      value: function update(player) {
        var _this3 = this;

        var callback = arguments[1] === undefined ? function () {} : arguments[1];

        if (this.sidebarGroup !== undefined) {
          this.playerColour.fill = player.colour;
          callback();
        } else {
          setTimeout(function () {
            return _this3.update(player, callback);
          }, 100);
        }
      }
    }]);

    return Sidebar;
  })();

  var Display = (function () {
    function Display(map, gameArea) {
      var _this4 = this;

      _classCallCheck(this, Display);

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
      this.gameGroup.on('mouseup', function (options) {
        var territory = cursorTerritory(map, _this4.gameGroup, options, _this4);
        if (territory.owner !== null && territory.owner != _this4.currentPlayer.id) {
          alert('Sorry, that square has already been taken!');
          return;
        }
        _this4.map.fillTerritory(territory, _this4.currentPlayer.id);
        _this4.update();
        _this4.redrawLiquid(territory);
        _this4.currentPlayer = _this4.players[(_this4.currentPlayer.id + 1) % _this4.players.length];
        _this4.beforeMove();
      });
      this.gameGroup.on('mousemove', function (options) {
        var territory = cursorTerritory(map, _this4.gameGroup, options, _this4);
        var weakestEdge = _this4.map.weakestEdge(territory);
        var lfe = _this4.lastFatEdge;
        var nfe = weakestEdge.pack();
        if (lfe && _this4.edges[lfe]) {
          _this4.edges[lfe].stroke = getEdgeColour(map.getEdge(lfe));
        }
        _this4.edges[nfe].stroke = getEdgeColour(map.getEdge(nfe), 90);
        _this4.lastFatEdge = nfe;
        _this4.gameArea.renderAll();
      });

      this.scaleFactor = Math.min(DIM / map.width, DIM / map.height);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(map.edgeObject)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var e = _step.value;

          var edg = map.getEdge(e);
          var fbObject = new fabric.Line([edg.x1 * this.scaleFactor - DIM / 2, edg.y1 * this.scaleFactor - DIM / 2, edg.x2 * this.scaleFactor - DIM / 2, edg.y2 * this.scaleFactor - DIM / 2], {
            stroke: getEdgeColour(edg),
            strokeWidth: STANDARD_EDGE_WIDTH
          });
          this.edges[edg.pack()] = fbObject;
          this.gameGroup.add(fbObject);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(map.territories)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var t = _step2.value;

          this.waters[t] = [];
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.sidebar = new Sidebar();
      this.beforeMove();
    }

    _createClass(Display, [{
      key: 'show',
      value: function show() {
        var area = this.gameArea;

        area.add(this.gameGroup);
        area.forEachObject(function (obj) {
          return obj.selectable = false;
        });

        this.sidebar.attach(area, function () {
          return area.forEachObject(function (obj) {
            return obj.selectable = false;
          });
        });
      }
    }, {
      key: 'beforeMove',
      value: function beforeMove() {
        var _this5 = this;

        // Update sidebar.
        this.sidebar.update(this.currentPlayer, function () {
          return _this5.gameArea.renderAll() // callback
          ;
        });
      }
    }, {
      key: 'update',
      value: function update() {
        // Update edges.
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = Object.keys(this.edges)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var e = _step3.value;

            var edg = this.map.getEdge(e);
            if (edg === null) {
              this.gameGroup.remove(this.edges[e]);
              delete this.edges[e];
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3['return']) {
              _iterator3['return']();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        // Update territories
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = Object.keys(this.waters)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var t = _step4.value;

            if (this.map.getTerritoryFromId(t) === null) {
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                for (var _iterator5 = this.waters[t][Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                  var ko = _step5.value;

                  this.gameGroup.remove(ko);
                }
              } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                    _iterator5['return']();
                  }
                } finally {
                  if (_didIteratorError5) {
                    throw _iteratorError5;
                  }
                }
              }

              delete this.waters[t];
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4['return']) {
              _iterator4['return']();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }
    }, {
      key: 'redrawLiquid',
      value: function redrawLiquid(territory) {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = this.waters[territory.id][Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var ko = _step6.value;

            this.gameGroup.remove(ko);
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6['return']) {
              _iterator6['return']();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }

        this.waters[territory.id] = [];

        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = territory.liquidRects()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var rect = _step7.value;

            var _rect = _slicedToArray(rect, 3);

            var x = _rect[0];
            var y = _rect[1];
            var depth = _rect[2];

            var newObj = new fabric.Rect({
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
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7['return']) {
              _iterator7['return']();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }
      }
    }]);

    return Display;
  })();

  exports.Display = Display;
});