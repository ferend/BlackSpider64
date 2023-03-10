import { Application } from "pixi.js";
import * as PIXI from "pixi.js";
import Victor from "victor";
import Player from "./player";
import { Constants } from "../helpers/Constants";

export default class Enemy {
    app: Application;
    enemyGraphics: any;
    enemySpeed: number;
    player: Player;
    attacking: boolean;
    attackInterval: any;

    constructor(app: Application, player: Player) {
        this.app = app;
        this.player = player;
        this.enemyGraphics = this.playerAnimatedSprite();
        this.enemySpeed = Constants.speedOfEnemies;
        this.attacking = false;
        this.spawnEnemies();
    }
    spawnEnemies(): void {
        const r = this.randomSpawnPoint();
        this.enemyGraphics.anchor.set(0.5);
        this.enemyGraphics.position.set(r.x, r.y);
        this.app.stage.addChild(this.enemyGraphics);
    }


    randomSpawnPoint(): Victor {
        const edge = Math.floor(Math.random() * 4);
        const spawnPoint = new Victor(0, 0);
        switch (edge) {
            case 0: // TOP
                spawnPoint.x = this.app.screen.width * Math.random();
                break;
            case 1: // RIGHT
                spawnPoint.x = this.app.screen.width;
                spawnPoint.y = this.app.screen.width * Math.random();
                break;
            case 2: // BOTTOM
                spawnPoint.x = this.app.screen.width * Math.random();
                spawnPoint.y = this.app.screen.width;
                break;
            default: // LEFT
                spawnPoint.x = 0;
                spawnPoint.x = this.app.screen.width * Math.random();
                break;
        }
        return spawnPoint;
    }

    moveEnemies(): void {
        const e = new Victor(this.enemyGraphics.position.x, this.enemyGraphics.position.y);
        const s = new Victor(this.player.playerSprite.position.x, this.player.playerSprite.position.y);
        if (e.distance(s) < this.player.playerSprite.width / 2) {
            // let r = this.randomSpawnPoint();
            // this.enemyGraphics.position.set(r.x, r.y);
            this.attackPlayer();
            return;
        }
        const d = s.subtract(e);
        const v = d.normalize().multiplyScalar(this.enemySpeed);
        this.enemyGraphics.position.set(this.enemyGraphics.position.x + v.x, this.enemyGraphics.position.y + v.y);
    }

    attackPlayer(): void {
        if (this.attacking) return;
        this.attacking = true;
        this.attackInterval = setInterval(() => this.player.reducePlayerHealth(), 400);
        this.enemyGraphics.stop();
    }

    kill(): void {
        this.app.stage.removeChild(this.enemyGraphics);
        clearInterval(this.attackInterval);
        if (this.player.dead) return;
        this.player.increasePlayerScore();
    }

    get position(): any {
        return this.enemyGraphics.position;
    }

    playerAnimatedSprite(): PIXI.AnimatedSprite {
        const playerAnim = new PIXI.AnimatedSprite(
            [
                PIXI.Texture.from("HeroKnight_Run_0.png"),
                PIXI.Texture.from("HeroKnight_Run_1.png"),
                PIXI.Texture.from("HeroKnight_Run_2.png"),
                PIXI.Texture.from("HeroKnight_Run_3.png"),
                PIXI.Texture.from("HeroKnight_Run_4.png"),
                PIXI.Texture.from("HeroKnight_Run_5.png"),
                PIXI.Texture.from("HeroKnight_Run_6.png"),
                PIXI.Texture.from("HeroKnight_Run_7.png"),
                PIXI.Texture.from("HeroKnight_Run_8.png"),
                PIXI.Texture.from("HeroKnight_Run_9.png"),
            ],
            true,
        );
        playerAnim.animationSpeed = 0.2;
        playerAnim.play();
        playerAnim.anchor.set(0.5);
        return playerAnim;
    }
}
