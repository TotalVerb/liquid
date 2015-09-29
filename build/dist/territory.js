define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.pack = pack;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function pack(x, y) {
    return [x, y].join(' ');
  }

  var CoordinateSet = (function () {
    function CoordinateSet(coordinates) {
      _classCallCheck(this, CoordinateSet);

      this.backend = new Set();
      for (var [x, y] of coordinates) {
        this.backend.add(pack(x, y));
      }
    }

    _createClass(CoordinateSet, [{
      key: 'has',
      value: function has(coord) {
        return this.backend.has(pack(coord[0], coord[1]));
      }
    }, {
      key: 'add',
      value: function add(coord) {
        return this.backend.add(pack(coord[0], coord[1]));
      }
    }, {
      key: Symbol.iterator,
      value: function* () {
        for (var c of this.backend) {
          yield c.split(' ').map(Number);
        }
      }
    }, {
      key: 'size',
      get: function () {
        return this.backend.size;
      }
    }]);

    return CoordinateSet;
  })();

  var Territory = (function () {
    function Territory(id, coordinates) {
      _classCallCheck(this, Territory);

      this.id = id;
      this.coordinates = new CoordinateSet(coordinates);
      this.liquid = 0;
      this.owner = null;
    }

    _createClass(Territory, [{
      key: 'fill',
      value: function fill(owner, amount) {
        this.owner = owner;
        this.liquid += amount;
        if (this.liquid > this.coordinates.size + 0.01) {
          this.liquid = this.coordinates.size;
          return true;
        } else {
          return false;
        }
      }
    }, {
      key: 'eat',
      value: function eat(territory) {
        this.liquid += territory.liquid;
        for (var item of territory.coordinates) {
          this.coordinates.add(item);
        }
      }
    }, {
      key: 'edges',
      value: function* edges() {
        // Yield all edges of the territory, in packed form.
        for (var [x, y] of this.coordinates) {
          if (!this.coordinates.has([x - 1, y])) {
            yield `v${ x - 1 } ${ y }`;
          }
          if (!this.coordinates.has([x + 1, y])) {
            yield `v${ x } ${ y }`;
          }
          if (!this.coordinates.has([x, y - 1])) {
            yield `h${ x } ${ y - 1 }`;
          }
          if (!this.coordinates.has([x, y + 1])) {
            yield `h${ x } ${ y }`;
          }
        }
      }
    }, {
      key: 'liquidRects',
      value: function* liquidRects() {
        // Yield all liquid rectangles of the territory.
        // Yield "rectangles"of this form: [x, y, depth (0 to 1)]

        // 1. Bucket the coordinates by y-coordinate.
        const buckets = {};
        for (var [x, y] of this.coordinates) {
          buckets[y] = buckets[y] || [];
          buckets[y].push(x);
        }

        // 2. Sort the bucket keys.
        const lowestFirst = Object.keys(buckets).map(Number).sort().reverse();

        // 3. Fill buckets from lowest to highest.
        var remaining = this.liquid;
        for (var y of lowestFirst) {
          const split = buckets[y].length;
          const amt = Math.min(1, remaining / split);
          for (var x of buckets[y]) {
            yield [x, y, amt];
            remaining -= amt;
          }
          if (remaining < 0.01) {
            break;
          }
        }
      }
    }, {
      key: 'full',
      get: function () {
        return this.liquid >= this.coordinates.size;
      }
    }]);

    return Territory;
  })();

  exports.Territory = Territory;
});