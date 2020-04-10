import { GameTemplate } from "./GameTemplate.js";
import { Ball } from "../GameObject.js";

export class TestGame extends GameTemplate {

    start() {
        this.ball = new Ball(200, 250, 20, 20, "#6bd26b", 0, 0);
        this.deltaV = 2;
    }
    
    input(type, active) {
        if(active) {
            switch(type) {
                case "up":
                    this.ball.vy += -this.deltaV;
                    break;
                case "down":
                    this.ball.vy += this.deltaV;
                    break;
                case "left":
                    this.ball.vx += -this.deltaV;
                    break;
                case "right":
                    this.ball.vx += this.deltaV;
                    break;
                case "primary":
                    this.ball.vx = 0;
                    this.ball.vy = 0;
                    this.ball.x = 200;
                    this.ball.y = 250;
                    break;
            }
        }
    }

    update(ctx) {
        this.ball.update(ctx);
        this.ball.borderCollision(ctx);
    }

    draw(ctx) {
        this.drawBoundingBox(ctx);
        this.ball.draw(ctx);
    }

    drawBoundingBox(ctx) {
        ctx.strokeStyle = "#6bd26b";
        ctx.lineWidth = 5;
        ctx.strokeRect(1, 1, ctx.canvas.width - 2, ctx.canvas.height - 2);
    }

    static get NAME() {
        return "TestGame";
    }
}
