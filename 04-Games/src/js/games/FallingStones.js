import { GameTemplate } from "./GameTemplate.js"
import { GameObject, MovableGameObject } from "../GameObject.js";
import { Paddle } from "./Pong.js";

export class FallingStones extends GameTemplate {

    start() {
        this.player = new Player(8);
        this.gameOver = false;
        this.points = 0;
        this.lives = 5;
        this.bullets = [];
        this.maxBullets = 3;
        this.bulletSpeed = 8;
        this.stones = [];
        this.stoneSpeed = 2;
        this.stoneSpawnModifier = 0.1; //Determines how long it takes for new stones to appear (percent of screen).
    } 

    bindControls() {
        this.inputBinding = {
            "left": this.player.left.bind(this.player),
            "right": this.player.right.bind(this.player),
            "up": (bool) => this.generateBullet(bool),
        };
    }

    update(ctx) {
        this.player.update(ctx);
        this.generateStone(ctx);
        this.checkBullets(ctx); 
        this.checkStones(ctx);
        this.gameOverMessage();
    }

    draw(ctx) {
        for(let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(ctx);
        }
        this.player.draw(ctx);
        this.displayLives(ctx);
        for(let i = 0; i < this.stones.length; i++) {
            this.stones[i].draw(ctx);
        }  
    }

    displayLives(ctx) {
        ctx.fillStyle = "#AEEDBD";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.lives, this.player.x + this.player.width/2, this.player.y + this.player.height - 10);
    }

    
    generateBullet(bool) {
        if(bool) {
            if(this.bullets.length < this.maxBullets) {
                this.bullets.push(new Bullet(this.player, this.bulletSpeed));
            }
        }
    }

    deleteBullet(index) {
        this.bullets.splice(index, 1);
    }
    
    generateStone(ctx) {
        // Add new stone when 
        // 1) there is no stone yet 
        // 2) the last added stone has passed a certain percentage of the screen.
        if(this.stones.length == 0 || this.stones[this.stones.length - 1].y >= ctx.canvas.height * this.stoneSpawnModifier) { 
            let positionStone;
            do {
                positionStone = Math.random() * ctx.canvas.width;
            } while(positionStone < 0 || positionStone > ctx.canvas.width - 50); //Ensure stone fully shown in screen (stone width = 50))
            this.stones.push(new Stone(positionStone, this.stoneSpeed, true));
        }
    }

    deleteStone(index) {
        this.stones.splice(index, 1);
    }

    checkBullets(ctx) {
        for(let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update(ctx);

            //Border
            if(this.bullets[i].bulletBorderPassed(ctx)) {
                this.deleteBullet(i);
            }
        }
    }

    checkStones(ctx) {
        for(let i = this.stones.length - 1; i >= 0; i--) {
            this.stones[i].update(ctx);

            //Border
            //Active stone: When first contact to border one life is lost.
            if(this.stones[i].isActive) {
                if(this.stones[i].stoneBorderReached(ctx)) {
                    this.lives--;
                    this.stones[i].isActive = false; //Inactive stone: Life already lost.
                    if(this.lives === 0) this.gameOver = true;
                }
            }
            //Inactive stones get deleted when out of screen.
            else if(this.stones[i].stoneBorderPassed(ctx)) {
                this.deleteStone(i);
            }

            //Hit
            for(let j = this.bullets.length - 1; j >= 0; j--) {
                if(GameObject.rectangleCollision(this.stones[i], this.bullets[j])) {
                    this.points += 1;
                    this.deleteStone(i);                    
                    this.deleteBullet(j);
                }
            }
        }
    }

    gameOverMessage() {
        if(this.gameOver === true) {
            if(this.lives * 1 === 0) {
                this.gameOverText = [
                    "GAME OVER", 
                    " ",
                    "Score: " + this.points,
                    " ", 
                    " ",
                    "New Game: E"];
            } 
            else {
                this.gameOverText = [
                    "EXITED GAME", 
                    " ",
                    "Score: " + this.points,
                    " ", 
                    " ",
                    "New Game: E"];
            }
        }
    }

    static get NAME() {
        return "Falling Stones";
    }   
}


export class Player extends Paddle {
   
    constructor(speed) {
        super(180, 450, 50, 50, speed);
    }
}


export class Bullet extends MovableGameObject {

    constructor(player, bulletSpeed) {
        super(player.x + player.width/2, player.y, 10, 10, "#6bd26b", player.vx, -bulletSpeed);
    }

    bulletBorderPassed(ctx) {
        return this.y < 0;
    }
}


export class Stone extends MovableGameObject {
    
    constructor(x, stoneSpeed, isActive) {
        super(x, -100, 50, 100, "#6bd26b", 0, stoneSpeed);
        this.isActive = isActive;
    }
    
    //Stone has reached border (used for lives). 
    stoneBorderReached(ctx) {
        return this.y > ctx.canvas.height - 100;
    }
    
    //Stone has fully passed border (used for deleting stones).
    stoneBorderPassed(ctx) {
        return this.y > ctx.canvas.height;
    }
}

