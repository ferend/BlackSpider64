/* eslint-disable prefer-const */
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

    set shoot(shooting: any) {
        if (shooting) {
            this.generateBullet();
            this.interval = setInterval(() => this.generateBullet(), 500);
        } else {
            clearInterval(this.interval);
        }
    }

    shootBullets(): void {
        this.bullets.forEach((b) => b.position.set(b.position.x + b.velocity.x, b.position.y + b.velocity.y));
    }

    generateBullet(): void {
        if (this.bullets.length >= this.maxBullet) {
            let b = this.bullets.shift(); // Take the oldest bullet in array
            this.app.stage.removeChild(b);
        }

        this.bullets.forEach((b) => this.app.stage.removeChild(b));
        this.bullets = this.bullets.filter(
            (b) => Math.abs(b.position.x) < this.app.screen.width && Math.abs(b.position.y) < this.app.screen.height,
        );

        this.bullets.forEach((b) => this.app.stage.addChild(b));
        const bullet = new PIXI.Graphics();
        bullet.position.set(this.player.playerSprite.position.x, this.player.playerSprite.position.y);
        bullet.endFill();
        const angle = this.player.rotation - Math.PI / 2;
        bullet.velocity = new Victor(Math.cos(angle), Math.sin(angle)).multiplyScalar(this.bulletSpeed);
        this.bullets.push(bullet);
        bullet.isSprite = true;
        bullet.addChild(this.bulletAnimatedSprite());
        this.app.stage.addChild(bullet);
    }

    bulletAnimatedSprite(): PIXI.AnimatedSprite {
        const bulletAnim = new PIXI.AnimatedSprite(
            [
                PIXI.Texture.from("Dark VFX 1 (40x32)1.png"),
                PIXI.Texture.from("Dark VFX 1 (40x32)2.png"),
                PIXI.Texture.from("Dark VFX 1 (40x32)3.png"),
                PIXI.Texture.from("Dark VFX 1 (40x32)4.png"),
                PIXI.Texture.from("Dark VFX 1 (40x32)5.png"),
                PIXI.Texture.from("Dark VFX 1 (40x32)6.png"),
                PIXI.Texture.from("Dark VFX 1 (40x32)7.png"),
            ],
            true,
        );
        bulletAnim.animationSpeed = 0.1;
        bulletAnim.play();
        bulletAnim.anchor.set(0.5);
        bulletAnim.scale.set(1.5);
        return bulletAnim;
    }
}
