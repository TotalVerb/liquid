define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Edge = (function () {
    function Edge(x, y, strength) {
      _classCallCheck(this, Edge);

      this.x = x;
      this.y = y;
      this.strength = strength;
    }

    _createClass(Edge, [{
      key: 'acrossTerritory',
      value: function acrossTerritory(territory) {
        for (var _ref3 of territory.coordinates) {
          var _ref2 = _slicedToArray(_ref3, 2);

          var x = _ref2[0];
          var y = _ref2[1];

          const result = this.across(x, y);
          if (result !== undefined) {
            return result;
          }
        }
      }
    }, {
      key: 'pack',
      value: function pack() {
        return `${ this.type }${ this.x } ${ this.y }`;
      }
    }]);

    return Edge;
  })();

  var VerticalEdge = (function (_Edge) {
    function VerticalEdge(x, y, _ref4) {
      var _ref42 = _ref4;
      var strength = _ref42 === undefined ? Math.random() : _ref42;

      _classCallCheck(this, VerticalEdge);

      _get(Object.getPrototypeOf(VerticalEdge.prototype), 'constructor', this).call(this, x, y, strength);
      this.type = 'v';
    }

    _inherits(VerticalEdge, _Edge);

    _createClass(VerticalEdge, [{
      key: 'neighbours',
      value: function neighbours() {
        // Return the coordinates of the two squares
        return [[this.x, this.y], [this.x + 1, this.y]];
      }
    }, {
      key: 'across',
      value: function across(x, y) {
        if (x === this.x && y === this.y) {
          return [this.x + 1, this.y];
        } else if (x === this.x + 1 && y === this.y) {
          return [this.x, this.y];
        }
      }
    }, {
      key: 'x1',
      get: function () {
        return this.x + 1;
      }
    }, {
      key: 'y1',
      get: function () {
        return this.y;
      }
    }, {
      key: 'x2',
      get: function () {
        return this.x + 1;
      }
    }, {
      key: 'y2',
      get: function () {
        return this.y + 1;
      }
    }]);

    return VerticalEdge;
  })(Edge);

  exports.VerticalEdge = VerticalEdge;

  var HorizontalEdge = (function (_Edge2) {
    function HorizontalEdge(x, y, _ref5) {
      var _ref52 = _ref5;
      var strength = _ref52 === undefined ? Math.random() : _ref52;

      _classCallCheck(this, HorizontalEdge);

      _get(Object.getPrototypeOf(HorizontalEdge.prototype), 'constructor', this).call(this, x, y, strength);
      this.type = 'h';
    }

    _inherits(HorizontalEdge, _Edge2);

    _createClass(HorizontalEdge, [{
      key: 'neighbours',
      value: function neighbours() {
        // Return the coordinates of the two squares
        return [[this.x, this.y], [this.x, this.y + 1]];
      }
    }, {
      key: 'across',
      value: function across(x, y) {
        if (x === this.x && y === this.y) {
          return [this.x, this.y + 1];
        } else if (x === this.x && y === this.y + 1) {
          return [this.x, this.y];
        }
      }
    }, {
      key: 'x1',
      get: function () {
        return this.x;
      }
    }, {
      key: 'y1',
      get: function () {
        return this.y + 1;
      }
    }, {
      key: 'x2',
      get: function () {
        return this.x + 1;
      }
    }, {
      key: 'y2',
      get: function () {
        return this.y + 1;
      }
    }]);

    return HorizontalEdge;
  })(Edge);

  exports.HorizontalEdge = HorizontalEdge;
  const EDGE_OFFSETS = {
    h: [0, -1],
    v: [-1, 0]
  };

  exports.EDGE_OFFSETS = EDGE_OFFSETS;
  const EDGE_CLASS = {
    h: HorizontalEdge,
    v: VerticalEdge
  };
  exports.EDGE_CLASS = EDGE_CLASS;
});