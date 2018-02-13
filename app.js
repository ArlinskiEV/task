class Circle {
  constructor(x = 0, y = 0, color = [255, 0, 0]) {
    // this.color = color;
    this.pos = [x, y, ...color, 10]; // [x, y, r-color, g-color, b-color, radius]
    this.speed = 3; // just some coefficient

    this.norm = this.pos.map(() => 0);

    // this.radius = 10;
    this.onMove = false;

    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.render();

    this.canvas.addEventListener('click', (e) => {
      const newX = e.pageX - e.target.offsetLeft;
      const newY = e.pageY - e.target.offsetTop;
      const targetColor = this.pos[4] !== 255
        ? [0, 0, 255]
        : [255, 0, 0];
      const targetRadius = this.radius !== 10
        ? 10
        : 50;
      this.moveTo([newX, newY, ...targetColor, targetRadius]);
    });

    document.addEventListener('keyup', (e) => {
      switch (e.keyCode) {
        case 40: {
          this.speed -= 1;
          if (this.speed < 1) this.speed = 1;
          break;
        }
        case 38: {
          this.speed += 1;
          if (this.speed > 50) this.speed = 50;
          break;
        }
        default: break;
      }
    });
  }

  get color() {
    return `rgb(${
      this.pos
        .slice(2, 5)
        .map(item => Math.trunc(item))
        .join(',')
    })`;
  }

  get radius() {
    return this.pos[5];
  }

  moveTo(target) {
    this.target = target; // format like pos
    if (!this.onMove) {
      this.onMove = true;
      this.move();
    }
    // window.console.log(`target=${target}`);
  }

  move() {
    const length = Math.sqrt(this.target.reduce((prev, item, i) => {
      const sum = item - this.pos[i];
      return prev + (sum * sum);
    }, 0));

    const norm = this.target.map((item, i) => ((item - this.pos[i]) / length));

    // check
    // window.console.log(`normDiff = ${this.norm[0] - norm[0]}, ${this.norm[1] - norm[1]}`);
    this.norm = norm;

    if (this.speed < length) {
      this.pos = this.pos.map((item, i) => {
        const coordinate = item + (norm[i] * this.speed);
        return ((coordinate < 0) || (coordinate > 500)) ? this.target[i] : coordinate;
      });
      this.render();
      requestAnimationFrame(() => {
        this.move();
      });
    } else {
      this.pos = this.pos.map((item, i) => this.target[i]);
      this.render();
      this.onMove = false;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.beginPath();
    this.ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);

    // window.console.log(`color = ${color}`);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
}

const dot = new Circle(20, 20);
