class Circle {
    constructor(x, y) {
        this.pos = [x, y];
        this.speed = 1; // just some coefficient



        this.norm = [0, 0];



        this.radius = 5;
        this.onMove = false;

        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.render();

        this.canvas.addEventListener('click', (e) => {
            const x = e.pageX - e.target.offsetLeft;
            const y = e.pageY - e.target.offsetTop;
            this.moveTo([x, y]);
          });

        document.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
                case 40: {
                    this.speed -= 1;
                    if (this.speed < 1) this.speed = 1;
                    break;
                };
                case 38: {
                    this.speed += 1;
                    if (this.speed > 50) this.speed = 50;
                    break;
                }
            }
        });

    }

    moveTo(target) {
        this.target = target;
        if (!this.onMove) {
            this.onMove = true;
            this.move();
        }
        window.console.log(`target=${target}`);
    }

    move() {
        const length = Math.sqrt((this.target[0] - this.pos[0]) * (this.target[0] - this.pos[0]) + 
            (this.target[1] - this.pos[1]) * (this.target[1] - this.pos[1]));
        
        const norm = this.target.map((item, i) => {
            return (item - this.pos[i]) / length;
        });

        // check
        window.console.log(`normDiff = ${this.norm[0] - norm[0]}, ${this.norm[1] - norm[1]}`);
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
            this.pos = this.pos.map((item, i) => {
                return this.target[i];
            });
            this.render();
            this.onMove = false;
          }
    }

    render() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.ctx.beginPath();
        this.ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);

        this.ctx.fillStyle = 'green';
        this.ctx.fill();
    }

}

const dot = new Circle(20, 20);