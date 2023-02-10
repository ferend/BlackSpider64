import { Application } from "pixi.js";
import Player from "../models/player";
import * as PIXI from "pixi.js";
import Victor from "victor";

export default class Shooting {
    app: Application;
    player: Player;
    bulletSpeed: number;
    bullets: any[];
    bulletRadius: number;
    maxBullet: 3;
    interval: any;
    constructor(app: Application, player: Player) {
        this.app = app;
        this.player = player;
        this.bulletSpeed = 4;
        this.bulletRadius = 8;
        this.maxBullet = 3;
        this.bullets = [];
    }

    fire(): void {
        const bullet = new PIXI.Graphics();
        bullet.position.set(this.player.playerSprite.position.x, this.player.playerSprite.position.y);
        bullet.beginFill(0x0000ff, 1);
        bullet.drawCircle(0, 0, this.bulletRadius);
        bullet.endFill();
        let angle = this.player.playerSprite.rotation - Math.PI / 2;
        bullet.velocity = new Victor(Math.cos(angle), Math.sin(angle)).multiplyScalar(this.bulletSpeed);
        this.bullets.push(bullet);
        this.app.stage.addChild(bullet);
    }

    set shoot(shooting: any) {
        if (shooting) {
            this.fire();
            this.interval = setInterval(() => this.fire(), 500);
        } else {
            clearInterval(this.interval);
        }
    }

    update(): void {
        this.bullets.forEach((b) => b.position.set(b.position.x + b.velocity.x, b.position.y + b.velocity.y));
    }
}
