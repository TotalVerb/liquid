define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function getEdgeColour(edg) {
    return `hsl(${ Math.round(edg.strength * 300) }, 100%, 50%)`;
  }

  function cursorTerritory(map, group, options, disp) {
    const hit = group.getLocalPointer(options.e);
    const x = Math.min(map.width - 1, Math.floor(hit.x / disp.scaleFactor));
    const y = Math.min(map.height - 1, Math.floor(hit.y / disp.scaleFactor));
    return map.getTerritory(x, y);
  }

  const DIM = 400;

  var Player = function Player(id, colour) {
    _classCallCheck(this, Player);

    this.id = id;
    this.colour = colour;
  };

  var Sidebar = (function () {
    function Sidebar() {
      _classCallCheck(this, Sidebar);

      // Load logo
      fabric.Image.fromURL('res/liquid.svg', oImg => {
        oImg = oImg.scale(0.1);
        this.playerText = new fabric.Text('You are: ', {
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

    _createClass(Sidebar, [{
      key: 'attach',
      value: function attach(parent, callback = () => {}) {
        if (this.sidebarGroup !== undefined) {
          parent.add(this.sidebarGroup);
          callback();
        } else {
          setTimeout(() => this.attach(parent, callback), 100);
        }
      }
    }, {
      key: 'update',
      value: function update(player, callback = () => {}) {
        if (this.sidebarGroup !== undefined) {
          this.playerColour.fill = player.colour;
          callback();
        } else {
          setTimeout(() => this.update(player, callback), 100);
        }
      }
    }]);

    return Sidebar;
  })();

  var Display = (function () {
    function Display(map, gameArea) {
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
        fill: '#AAA',
        stroke: 'black',
        strokeWidth: 2
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
        if (this.lastFatEdge && this.edges[this.lastFatEdge]) {
          this.edges[this.lastFatEdge].strokeWidth = 2;
        }
        this.edges[weakestEdge.pack()].strokeWidth = 5;
        this.lastFatEdge = weakestEdge.pack();
        this.gameArea.renderAll();
      });

      this.scaleFactor = Math.min(DIM / map.width, DIM / map.height);

      for (var e of Object.keys(map.edgeObject)) {
        const edg = map.getEdge(e);
        const fbObject = new fabric.Line([edg.x1 * this.scaleFactor - DIM / 2, edg.y1 * this.scaleFactor - DIM / 2, edg.x2 * this.scaleFactor - DIM / 2, edg.y2 * this.scaleFactor - DIM / 2], {
          stroke: getEdgeColour(edg),
          strokeWidth: 2
        });
        this.edges[edg.pack()] = fbObject;
        this.gameGroup.add(fbObject);
      }

      for (var t of Object.keys(map.territories)) {
        this.waters[t] = [];
      }

      this.sidebar = new Sidebar();
      this.beforeMove();
    }

    _createClass(Display, [{
      key: 'show',
      value: function show() {
        const area = this.gameArea;

        area.add(this.gameGroup);
        area.forEachObject(obj => obj.selectable = false);

        this.sidebar.attach(area, () => area.forEachObject(obj => obj.selectable = false));
      }
    }, {
      key: 'beforeMove',
      value: function beforeMove() {
        // Update sidebar.
        this.sidebar.update(this.currentPlayer, () => this.gameArea.renderAll() // callback
        );
      }
    }, {
      key: 'update',
      value: function update() {
        // Update edges.
        for (var e of Object.keys(this.edges)) {
          const edg = this.map.getEdge(e);
          if (edg === null) {
            this.gameGroup.remove(this.edges[e]);
            delete this.edges[e];
          }
        }

        // Update territories
        for (var t of Object.keys(this.waters)) {
          if (this.map.getTerritoryFromId(t) === null) {
            for (var ko of this.waters[t]) {
              this.gameGroup.remove(ko);
            }
            delete this.waters[t];
          }
        }
      }
    }, {
      key: 'redrawLiquid',
      value: function redrawLiquid(territory) {
        for (var ko of this.waters[territory.id]) {
          this.gameGroup.remove(ko);
        }
        this.waters[territory.id] = [];

        for (var rect of territory.liquidRects()) {
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
    }]);

    return Display;
  })();

  exports.Display = Display;
});