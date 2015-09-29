export function pack(x, y) {
  return [x, y].join(' ');
}

class CoordinateSet {
  constructor(coordinates) {
    this.backend = new Set();
    for (let [x, y] of coordinates) {
      this.backend.add(pack(x, y));
    }
  }

  has(coord) {
    return this.backend.has(pack(coord[0], coord[1]));
  }

  add(coord) {
    return this.backend.add(pack(coord[0], coord[1]));
  }

  get size() {
    return this.backend.size;
  }

  * [Symbol.iterator]() {
    for (let c of this.backend) {
      yield c.split(' ').map(Number);
    }
  }
}

export class Territory {
  constructor(id, coordinates) {
    this.id = id;
    this.coordinates = new CoordinateSet(coordinates);
    this.liquid = 0;
    this.owner = null;
  }

  get full() {
    return this.liquid >= this.coordinates.size;
  }

  fill(owner, amount) {
    this.owner = owner;
    this.liquid += amount;
    if (this.liquid > this.coordinates.size + 0.01) {
      this.liquid = this.coordinates.size;
      return true;
    } else {
      return false;
    }
  }

  eat(territory) {
    this.liquid += territory.liquid;
    for (let item of territory.coordinates) {
      this.coordinates.add(item);
    }
  }

  * edges() {
    // Yield all edges of the territory, in packed form.
    for (let [x, y] of this.coordinates) {
      if (!this.coordinates.has([x - 1, y])) {
        yield `v${x - 1} ${y}`;
      }
      if (!this.coordinates.has([x + 1, y])) {
        yield `v${x} ${y}`;
      }
      if (!this.coordinates.has([x, y - 1])) {
        yield `h${x} ${y - 1}`;
      }
      if (!this.coordinates.has([x, y + 1])) {
        yield `h${x} ${y}`;
      }
    }
  }

  * liquidRects() {
    // Yield all liquid rectangles of the territory.
    // Yield "rectangles"of this form: [x, y, depth (0 to 1)]

    // 1. Bucket the coordinates by y-coordinate.
    const buckets = {};
    for (let [x, y] of this.coordinates) {
      buckets[y] = buckets[y] || [];
      buckets[y].push(x);
    }

    // 2. Sort the bucket keys.
    const lowestFirst = Object.keys(buckets).map(Number).sort().reverse();

    // 3. Fill buckets from lowest to highest.
    let remaining = this.liquid;
    for (let y of lowestFirst) {
      const split = buckets[y].length;
      const amt = Math.min(1, remaining / split);
      for (let x of buckets[y]) {
        yield [x, y, amt];
        remaining -= amt;
      }
      if (remaining < 0.01) {
        break;
      }
    }
  }
}
