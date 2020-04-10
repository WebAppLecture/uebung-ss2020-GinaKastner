import { GameTemplate } from "./GameTemplate.js"
import { GameObject, MovableGameObject } from "../GameObject.js";

export class FallingStones extends GameTemplate {

    // TODO: 
    // Fix bug: Player disappears when this.checkBullets/Stones added.
    // 2.6: Prevent infinite shooting.

    start() {
        this.player = new Player(8);
        this.gameOver = false;
        this.points = 0;
        this.lives = 5;
        this.bullets = [];
        this.bulletSpeed;
        this.stones = [];
        this.stoneSpeed = 1;
        this.stoneSpawnModifier = 0.2; //Determines how long it takes for new stones to appear (percent of screen).
    } 

    bindControls() {
        this.inputBinding = {
            "left": this.player.left.bind(this.player),
            "right": this.player.right.bind(this.player),
            "up": this.generateBullet()
        };
    }

    update(ctx) {
        this.player.update(ctx);
        this.generateStone(ctx);
        //this.checkBullets(ctx); //buggy
        //this.checkStones(ctx);
        //this.gameOver();
    }

    draw(ctx) {
        for(let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(ctx);
        }
        this.player.draw(ctx);
        this.displayLives(ctx);
        for(let j = 0; j < this.stones.length; j++) {
            this.stones[j].draw(ctx);
        }  
    }

    displayLives(ctx) {
        ctx.fillStyle = "#AEEDBD";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.lives, this.player.x + this.player.width/2, this.player.y + this.player.height - 10);
    }

    
    generateBullet() {
        this.bullets.push(new Bullet(this.player, this.bulletSpeed));
    }

    deleteBullet(index) {
        this.bullets.splice(index, 1);
    }
    
    generateStone(ctx) {
        // Add new stone when 
        // 1) there is no stone yet 
        // 2) the last added stone has passed a certain percentage of the screen.
        if(this.stones.length == 0 || (this.stones.length != 0 && this.stones[this.stones.length - 1].y >= ctx.canvas.height * this.stoneSpawnModifier)) { 
            this.stones.push(new Stone(Math.random() * ctx.canvas.height), this.stoneSpeed);
        }
    }

    deleteStone(index) {
        this.stones.splice(index, 1);
    }

    checkBullets(ctx) {
        //Update
        for(let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(ctx);
        }
        
        //Border
        for(let i = 0; i < this.bullets.length; i++) {
            if(this.bullets[i].borderReached(ctx)) {
                this.deleteBullet(i);
            }
        }
    }

    checkStones(ctx) {
        //Update
        for(let j = 0; j < this.stones.length; j++) {
            this.stones[j].update(ctx);
        }
        
        //Border
        for(let i = 0; i < this.stones.length; i++) {
            if(this.stones[i].borderReached(ctx)) {
                this.lives--;
                if(this.lives === 0) this.gameOver = true;
            }
        }
        
        for(let i = 0; i < this.stones.length; i++) {
            if(this.stones[i].borderPassed(ctx)) {
                this.deleteStone(i);
            }
        }

        //Hit
        for(let i = 0; i < this.stones.length; i++) {
            for(let j = 0; j < this.bullets.length; j++) {
                if(GameObject.rectangleCollision(this.stones[i], this.bullets[j])) {
                    this.points += 1;
                    this.deleteStone(i);                    
                    this.deleteBullet(j);
                }
            }
        }
    }

    gameOver() {
        if(this.gameOver) {
            this.gameOverText = [
                "GAME OVER", 
                "Score: " + this.points,
                "rematch: A"];
        }
    }

    static get NAME() {
        return "Falling Stones";
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
    
    constructor(player, bulletSpeed) {
        super(player.x + player.width/2, player.y + player.height/2, 10, 10, "#6bd26b", player.speed, -bulletSpeed);
    }

    borderPassed(ctx) {
        return this.x < 0 || this.x > ctx.canvas.width || this.y < 0 || this.y > ctx.canvas.height;
    }
}


export class Stone extends MovableGameObject {
    
    constructor(x, stoneSpeed) {
        super(x, 0, 50, 100, "#6bd26b", 0, stoneSpeed);
    }
    
    //Stone has reached border -> check for life lost. 
    borderReached(ctx) {
        return this.y > ctx.canvas.height;
    }
    
    //Stone has fully passed border -> check for deleting a stone.
    borderPassed(ctx) {
        return this.y > this.height + ctx.canvas.height;
    }
}

