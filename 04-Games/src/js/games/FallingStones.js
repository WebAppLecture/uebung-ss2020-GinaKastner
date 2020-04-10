import { GameTemplate } from "./GameTemplate.js"
import { GameObject, MovableGameObject } from "../GameObject.js";

export class FallingStones extends GameTemplate {

    // TODO: 
    // Fix bug: Player disappears when this.generateBullet() added.
    // Movement directions correct?
    // 2.4, 2.5: Delete bullets & stones.
    // 2.6: Implement hit check (rectangle collision).  
    // 2.6: Prevent infinite shooting.

    start() {
        this.player = new Player(8);
        this.gameOver = false;
        this.points = 0;
        this.lives = 5;
        this.bullets = [];
        this.bulletSpeed;
        this.stones = [];
        this.stoneSpeed = 3;
        this.stoneSpawnModifier = 0.2; //Determines how long it takes for new stones to appear (percent of screen).
    } 

    bindControls() {
        this.inputBinding = {
            "left": this.player.left.bind(this.player),
            "right": this.player.right.bind(this.player),
            //"up": this.generateBullet() //Causes bug.
        };
    }

    update(ctx) {
        this.player.update(ctx)
        this.bullets.forEach(bullet => bullet.update(ctx));
        //this.checkBullets(ctx);
        //this.checkStones(ctx);
        //this.gameOver();
    }

    draw(ctx) {
        this.player.draw(ctx);
        this.bullets.forEach(bullet => bullet.draw(ctx));
        this.stones.forEach(stone => stone.draw(ctx));
        this.displayLives(ctx);
    }

    displayLives(ctx) {
        ctx.fillStyle = "#AEEDBD";
        ctx.font = "40px Arial"
        ctx.textAlign = "center";
        ctx.fillText(this.lives, this.player.x + this.player.width/2, this.player.y + this.player.height - 10);
    }

    
    generateBullet() {
        this.bullets.push(new Bullet(this.player));
    }

    
    generateStone(ctx) {
        // Add new stone when 
        // 1) there is no stone yet 
        // 2) the last added stone has passed a certain percentage of the screen.
        if(this.stones.length === 0 || (this.stones.length !== 0 && this.stones[this.stones.length - 1].y >= ctx.canvas.height * this.stoneSpawnModifier)) { 
            this.stones.push(new Stone(Math.random() * ctx.canvas.height), this.stoneSpeed);
        }
    }

    
    checkBullets(ctx) {
        //Update
        this.bullets.forEach(bullet => {
            bullet.update(ctx);
        });

        
        //Border
        this.bullets.forEach(bullet => {
            if(bullet.borderReached(ctx)) {
                //remove bullet?
            }
        });
    }

    checkStones(ctx) {
        //Update
        this.stones.forEach(stone => {
            stone.update(ctx);
        });

        //Border
        this.bullets.forEach(stone => {
            if(stone.borderReached(ctx)) {
                this.lives--;
                if(this.lives <= 0) this.gameOver();
            }
            if(stone.borderPassed(ctx)) {
                //remove stone? 
            }
        });

        //Hit
        this.stones.forEach(stone => {
            if(stone.successfulHit(ctx)) {
                this.points += 10;
                //remove bullet?
                //remove stone? 
            }
        }); 
    }

    successfulHit(ctx) {
        this.stones.forEach(bullet => {
            if(false) return true; //check bullet-stone rectangle collision
        });
    }

    gameOver() {
        this.gameOver = true;
        this.gameOverText = [
            "GAME OVER", 
            "Score: " + this.points,
            "rematch: A"];
    }

    static get NAME() {
        return "FallingStones";
    }   
}


export class Player extends MovableGameObject {
    
    constructor(speed) {
        super(180, 450, 50, 50, "#6bd26b", 0, 0);
        this.speed = speed;
    }

    left(bool) {    
        this.vx = bool * -this.speed; 
    }

    right(bool) {
        this.vx = bool * this.speed;
    }

    update(ctx) {
        if(this.x < 2) {
            this.x = 2;
        } 
        if(this.x + this.width > ctx.canvas.width - 2) {
            this.x = ctx.canvas.width - this.width - 2;
        }
        super.update();
    }
}


export class Bullet extends MovableGameObject {
    
    constructor(player) {
        super(player.x + player.width/2, player.y + player.height/2, 10, 10, "#6bd26b", 0, -this.bulletSpeed);
        this.speed = 20;
    }

    borderPassed(ctx) {
        return this.x < 0 || this.x > ctx.canvas.width || this.y < 0 || this.y > ctx.canvas.height;
    }
}


export class Stone extends MovableGameObject {
    
    constructor(x, stoneSpeed) {
        super(x, 0, 50, 100, "#6bd26b", 0, stoneSpeed);
    }
    
    //Stone has reached border -> life lost. 
    borderReached(ctx) {
        return this.y > ctx.canvas.height;
    }
    
    //Stone has fully passed border -> delete stone.
    borderPassed(ctx) {
        return this.y > this.height + ctx.canvas.height;
    }
}
