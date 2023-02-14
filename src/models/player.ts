/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as PIXI from "pixi.js";
import { Application, Sprite } from "pixi.js";
import Shooting from "../actions/shooting";
import { Constants } from "../helpers/Constants";

export default class Player {
    app: Application;
    playerSprite: PIXI.Sprite;
    rotation: number;
    shooting: Shooting;
    lastMouseButton: number;
    healthBar: PIXI.Graphics;
    playerMaxHealth: number;
    playerCurrentHealth: number;
    dead: boolean;
    score: number;
    constructor(app: Application) {
        this.app = app;
        this.playerSprite = new PIXI.Sprite(PIXI.Texture.from("Idle.png"));
        this.healthBar = new PIXI.Graphics();
        this.shooting = new Shooting(app, this);
        this.playerMaxHealth = 100;
        this.playerCurrentHealth = this.playerMaxHealth;
        this.lastMouseButton = 0;
        this.dead = false;
        this.rotation = 0;
        this.score = 0;
        this.createPlayerHealthBar();
    }

    addPlayer(): void {
        this.playerSprite.anchor.set(0.5);
        this.playerSprite.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
        this.app.stage.addChild(this.playerSprite);
    }

    playerMouseEvents(): void {
        if (this.dead === true) return;
        const mouse = this.app.renderer.plugins.interaction.mouse;
        this.playerRotation(mouse);
        this.playerShooting(mouse);
    }

    playerRotation(mouse: any): void {
        const cursorPos = mouse.global;
        const angle =
            Math.atan2(cursorPos.y - this.playerSprite.position.y, cursorPos.x - this.playerSprite.position.x) +
            Math.PI / 2;
        this.rotation = angle;
        if (angle < 0) {
            this.playerSprite.scale.x = -1;
        } else {
            this.playerSprite.scale.x = 1;
        }
    }

    playerShooting(mouse: any): void {
        if (mouse.buttons !== this.lastMouseButton) {
            this.shooting.shoot = mouse.buttons !== 0;
            this.lastMouseButton = mouse.buttons;
        }
        this.shooting.shootBullets();
    }
    createPlayerHealthBar(): void {
        const margin = 16;
        const barHeight = 8;
        this.healthBar.beginFill(0xff0000);
        // @ts-ignore
        this.healthBar.initialWidth = this.app.screen.width - 2 * margin;
        this.healthBar.drawRect(
            margin,
            this.app.screen.height - barHeight - margin / 2,
            // @ts-ignore
            this.healthBar.initialWidth,
            barHeight,
        );
        this.healthBar.endFill();
        this.healthBar.zIndex = 1;
        this.app.stage.sortableChildren = true; // get z-index to work
        this.app.stage.addChild(this.healthBar);
    }
    reducePlayerHealth(): void {
        this.playerCurrentHealth -= 1;
        // @ts-ignore
        this.healthBar.width = (this.playerCurrentHealth / this.playerMaxHealth) * this.healthBar.initialWidth;
        if (this.playerCurrentHealth <= 0) {
            this.dead = true;
        }
    }
    increasePlayerScore(): void {
        this.score += 1;
    }
    updateScoreText(scoreText: PIXI.Text): string {
        return (scoreText.text = `Score: ${this.score}`);
    }
}
