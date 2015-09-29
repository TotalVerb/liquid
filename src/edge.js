class Edge {
  constructor(x, y, strength) {
    this.x = x;
    this.y = y;
    this.strength = strength;
  }

  acrossTerritory(territory) {
    for (let [x, y] of territory.coordinates) {
      const result = this.across(x, y);
      if (result !== undefined) {
        return result;
      }
    }
  }

  pack() {
    return `${this.type}${this.x} ${this.y}`;
  }
}

export class VerticalEdge extends Edge {
  constructor(x, y, strength=Math.random()) {
    super(x, y, strength);
    this.type = 'v';
  }

  get x1() {
    return this.x + 1;
  }

  get y1() {
    return this.y;
  }

  get x2() {
    return this.x + 1;
  }

  get y2() {
    return this.y + 1;
  }

  neighbours() {
    // Return the coordinates of the two squares
    return [
      [this.x, this.y],
      [this.x + 1, this.y]
    ];
  }

  across(x, y) {
    if (x === this.x && y === this.y) {
      return [this.x + 1, this.y];
    } else if (x === this.x + 1 && y === this.y) {
      return [this.x, this.y];
    }
  }
}

export class HorizontalEdge extends Edge {
  constructor(x, y, strength=Math.random()) {
    super(x, y, strength);
    this.type = 'h';
  }

  get x1() {
    return this.x;
  }

  get y1() {
    return this.y + 1;
  }

  get x2() {
    return this.x + 1;
  }

  get y2() {
    return this.y + 1;
  }

  neighbours() {
    // Return the coordinates of the two squares
    return [
      [this.x, this.y],
      [this.x, this.y + 1]
    ];
  }

  across(x, y) {
    if (x === this.x && y === this.y) {
      return [this.x, this.y + 1];
    } else if (x === this.x && y === this.y + 1) {
      return [this.x, this.y];
    }
  }
}

export const EDGE_OFFSETS = {
  h: [0, -1],
  v: [-1, 0]
};

export const EDGE_CLASS = {
  h: HorizontalEdge,
  v: VerticalEdge
};
