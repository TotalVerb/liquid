define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.pack = pack;

  function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function pack(x, y) {
    return [x, y].join(' ');
  }

  var CoordinateSet = (function () {
    function CoordinateSet(coordinates) {
      _classCallCheck(this, CoordinateSet);

      this.backend = new Set();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = coordinates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

          var x = _step$value[0];
          var y = _step$value[1];

          this.backend.add(pack(x, y));
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
      value: regeneratorRuntime.mark(function callee$1$0() {
        var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, c;

        return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              context$2$0.prev = 3;
              _iterator2 = this.backend[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                context$2$0.next = 12;
                break;
              }

              c = _step2.value;
              context$2$0.next = 9;
              return c.split(' ').map(Number);

            case 9:
              _iteratorNormalCompletion2 = true;
              context$2$0.next = 5;
              break;

            case 12:
              context$2$0.next = 18;
              break;

            case 14:
              context$2$0.prev = 14;
              context$2$0.t0 = context$2$0['catch'](3);
              _didIteratorError2 = true;
              _iteratorError2 = context$2$0.t0;

            case 18:
              context$2$0.prev = 18;
              context$2$0.prev = 19;

              if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
              }

            case 21:
              context$2$0.prev = 21;

              if (!_didIteratorError2) {
                context$2$0.next = 24;
                break;
              }

              throw _iteratorError2;

            case 24:
              return context$2$0.finish(21);

            case 25:
              return context$2$0.finish(18);

            case 26:
            case 'end':
              return context$2$0.stop();
          }
        }, callee$1$0, this, [[3, 14, 18, 26], [19,, 21, 25]]);
      })
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
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = territory.coordinates[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var item = _step3.value;

            this.coordinates.add(item);
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
      }
    }, {
      key: 'edges',
      value: regeneratorRuntime.mark(function edges() {
        var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _step4$value, x, y;

        return regeneratorRuntime.wrap(function edges$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              context$2$0.prev = 3;
              _iterator4 = this.coordinates[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                context$2$0.next = 24;
                break;
              }

              _step4$value = _slicedToArray(_step4.value, 2);
              x = _step4$value[0];
              y = _step4$value[1];

              if (this.coordinates.has([x - 1, y])) {
                context$2$0.next = 12;
                break;
              }

              context$2$0.next = 12;
              return 'v' + (x - 1) + ' ' + y;

            case 12:
              if (this.coordinates.has([x + 1, y])) {
                context$2$0.next = 15;
                break;
              }

              context$2$0.next = 15;
              return 'v' + x + ' ' + y;

            case 15:
              if (this.coordinates.has([x, y - 1])) {
                context$2$0.next = 18;
                break;
              }

              context$2$0.next = 18;
              return 'h' + x + ' ' + (y - 1);

            case 18:
              if (this.coordinates.has([x, y + 1])) {
                context$2$0.next = 21;
                break;
              }

              context$2$0.next = 21;
              return 'h' + x + ' ' + y;

            case 21:
              _iteratorNormalCompletion4 = true;
              context$2$0.next = 5;
              break;

            case 24:
              context$2$0.next = 30;
              break;

            case 26:
              context$2$0.prev = 26;
              context$2$0.t0 = context$2$0['catch'](3);
              _didIteratorError4 = true;
              _iteratorError4 = context$2$0.t0;

            case 30:
              context$2$0.prev = 30;
              context$2$0.prev = 31;

              if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                _iterator4['return']();
              }

            case 33:
              context$2$0.prev = 33;

              if (!_didIteratorError4) {
                context$2$0.next = 36;
                break;
              }

              throw _iteratorError4;

            case 36:
              return context$2$0.finish(33);

            case 37:
              return context$2$0.finish(30);

            case 38:
            case 'end':
              return context$2$0.stop();
          }
        }, edges, this, [[3, 26, 30, 38], [31,, 33, 37]]);
      })
    }, {
      key: 'liquidRects',
      value: regeneratorRuntime.mark(function liquidRects() {
        var buckets, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _step5$value, x, y, lowestFirst, remaining, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, split, amt, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7;

        return regeneratorRuntime.wrap(function liquidRects$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              buckets = {};
              _iteratorNormalCompletion5 = true;
              _didIteratorError5 = false;
              _iteratorError5 = undefined;
              context$2$0.prev = 4;

              for (_iterator5 = this.coordinates[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                _step5$value = _slicedToArray(_step5.value, 2);
                x = _step5$value[0];
                y = _step5$value[1];

                buckets[y] = buckets[y] || [];
                buckets[y].push(x);
              }

              context$2$0.next = 12;
              break;

            case 8:
              context$2$0.prev = 8;
              context$2$0.t0 = context$2$0['catch'](4);
              _didIteratorError5 = true;
              _iteratorError5 = context$2$0.t0;

            case 12:
              context$2$0.prev = 12;
              context$2$0.prev = 13;

              if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                _iterator5['return']();
              }

            case 15:
              context$2$0.prev = 15;

              if (!_didIteratorError5) {
                context$2$0.next = 18;
                break;
              }

              throw _iteratorError5;

            case 18:
              return context$2$0.finish(15);

            case 19:
              return context$2$0.finish(12);

            case 20:
              lowestFirst = Object.keys(buckets).map(Number).sort().reverse();
              remaining = this.liquid;
              _iteratorNormalCompletion6 = true;
              _didIteratorError6 = false;
              _iteratorError6 = undefined;
              context$2$0.prev = 25;
              _iterator6 = lowestFirst[Symbol.iterator]();

            case 27:
              if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                context$2$0.next = 63;
                break;
              }

              y = _step6.value;
              split = buckets[y].length;
              amt = Math.min(1, remaining / split);
              _iteratorNormalCompletion7 = true;
              _didIteratorError7 = false;
              _iteratorError7 = undefined;
              context$2$0.prev = 34;
              _iterator7 = buckets[y][Symbol.iterator]();

            case 36:
              if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                context$2$0.next = 44;
                break;
              }

              x = _step7.value;
              context$2$0.next = 40;
              return [x, y, amt];

            case 40:
              remaining -= amt;

            case 41:
              _iteratorNormalCompletion7 = true;
              context$2$0.next = 36;
              break;

            case 44:
              context$2$0.next = 50;
              break;

            case 46:
              context$2$0.prev = 46;
              context$2$0.t1 = context$2$0['catch'](34);
              _didIteratorError7 = true;
              _iteratorError7 = context$2$0.t1;

            case 50:
              context$2$0.prev = 50;
              context$2$0.prev = 51;

              if (!_iteratorNormalCompletion7 && _iterator7['return']) {
                _iterator7['return']();
              }

            case 53:
              context$2$0.prev = 53;

              if (!_didIteratorError7) {
                context$2$0.next = 56;
                break;
              }

              throw _iteratorError7;

            case 56:
              return context$2$0.finish(53);

            case 57:
              return context$2$0.finish(50);

            case 58:
              if (!(remaining < 0.01)) {
                context$2$0.next = 60;
                break;
              }

              return context$2$0.abrupt('break', 63);

            case 60:
              _iteratorNormalCompletion6 = true;
              context$2$0.next = 27;
              break;

            case 63:
              context$2$0.next = 69;
              break;

            case 65:
              context$2$0.prev = 65;
              context$2$0.t2 = context$2$0['catch'](25);
              _didIteratorError6 = true;
              _iteratorError6 = context$2$0.t2;

            case 69:
              context$2$0.prev = 69;
              context$2$0.prev = 70;

              if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                _iterator6['return']();
              }

            case 72:
              context$2$0.prev = 72;

              if (!_didIteratorError6) {
                context$2$0.next = 75;
                break;
              }

              throw _iteratorError6;

            case 75:
              return context$2$0.finish(72);

            case 76:
              return context$2$0.finish(69);

            case 77:
            case 'end':
              return context$2$0.stop();
          }
        }, liquidRects, this, [[4, 8, 12, 20], [13,, 15, 19], [25, 65, 69, 77], [34, 46, 50, 58], [51,, 53, 57], [70,, 72, 76]]);
      })
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

// Yield all edges of the territory, in packed form.

// Yield all liquid rectangles of the territory.
// Yield "rectangles"of this form: [x, y, depth (0 to 1)]

// 1. Bucket the coordinates by y-coordinate.
// 2. Sort the bucket keys.

// 3. Fill buckets from lowest to highest.