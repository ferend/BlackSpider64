import { Application } from "pixi.js";
import * as PIXI from "pixi.js";
import Victor from "victor";
import Player from "./player";

export default class Enemy {
    app: Application;
    enemyGraphics: PIXI.Graphics;
    enemySpeed: number;
    player: Player;
    constructor(app: Application, player: Player) {
        this.app = app;
        this.player = player;
        this.enemyGraphics = new PIXI.Graphics();
        this.enemySpeed = 2;
    }

    spwanEnemies(): void {
        let r = this.randomSpawPoint();
        let enemyRad = 16;
        this.enemyGraphics.position.set(r.x, r.y);
        this.enemyGraphics.beginFill(0xff0000, 1);
        this.enemyGraphics.drawCircle(0, 0, enemyRad);
        this.enemyGraphics.endFill();
        this.app.stage.addChild(this.enemyGraphics);
    }

    randomSpawPoint(): Victor {
        let edge = Math.floor(Math.random() * 4);
        let spawnPoint = new Victor(0, 0);
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
        let e = new Victor(this.enemyGraphics.position.x, this.enemyGraphics.position.y);
        let s = new Victor(this.player.playerSprite.position.x, this.player.playerSprite.position.y);
        if (e.distance(s) < this.player.playerSprite.width / 2) {
            let r = this.randomSpawPoint();
            this.enemyGraphics.position.set(r.x, r.y);
            return;
        }
        let d = s.subtract(e);
        let v = d.normalize().multiplyScalar(this.enemySpeed);
        this.enemyGraphics.position.set(this.enemyGraphics.position.x + v.x, this.enemyGraphics.position.y + v.y);
    }
}
