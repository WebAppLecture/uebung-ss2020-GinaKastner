export class GameObject {

    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
    }

    /**
     * https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection 
     */
    static rectangleCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
    }
}

export class StrokedObject extends GameObject {

    constructor(x, y, width, height, color, lineWidth) {
        super(x, y, width, height, color);
        this.lineWidth = lineWidth;
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.strokeRect(
            this.x + this.lineWidth/2, 
            this.y + this.lineWidth/2, 
            this.width - this.lineWidth, 
            this.height - this.lineWidth);
    }
}

export class MovableGameObject extends GameObject {

    constructor(x, y, width, height, color, vx, vy) {
        super(x, y, width, height, color)
        this.vx = vx;
        this.vy = vy;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

export class Ball extends MovableGameObject {

    borderCollision(ctx) {
        let collisions =  [];
        if(this.y < 0) { // Top border
            this.y = 0;
            this.vy = -this.vy;
            collisions.push(Ball.COLLISIONS.UP);
        } 
        if(this.y + this.height > ctx.canvas.height) { // bottom border
            this.y = ctx.canvas.height - this.height;
            this.vy = -this.vy;
            collisions.push(Ball.COLLISIONS.DOWN);
        }
        if(this.x < 0) { // left border
            this.x = 0;
            this.vx = -this.vx;
            collisions.push(Ball.COLLISIONS.LEFT);
        } 
        if(this.x + this.width > ctx.canvas.width) { // right border
            this.x = ctx.canvas.width - this.width;
            this.vx = -this.vx;
            collisions.push(Ball.COLLISIONS.RIGHT);
        }
        return collisions.length === 0 ? false : collisions;
    }

    static get COLLISIONS() {
        return {
            LEFT: "LEFT",
            RIGHT: "RIGHT",
            UP: "UP",
            DOWN: "DOWN",
        }
    }

}

export class Mode {

    constructor(name, parameters) {
        this.NAME = name;
        this.parameters = parameters;
    }
}
