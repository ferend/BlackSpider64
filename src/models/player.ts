import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import Shooting from "../actions/shooting";

export default class Player {
    app: Application;
    playerSprite: PIXI.Sprite;
    shooting: Shooting;
    lastMouseButton: number;
    constructor(app: Application) {
        this.app = app;
        this.playerSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.shooting = new Shooting(app, this);
        this.lastMouseButton = 0;
    }

    addPlayer(): void {
        this.playerSprite.anchor.set(0.5);
        this.playerSprite.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
        this.playerSprite.width = this.playerSprite.height = 32;
        this.app.stage.addChild(this.playerSprite);
    }

    playerMouseEvents(): void {
        const mouse = this.app.renderer.plugins.interaction.mouse;
        this.playerRotation(mouse);
        this.playerShooting(mouse);
    }

    playerRotation(mouse: any): void {
        const cursorPos = mouse.global;
        let angle =
            Math.atan2(cursorPos.y - this.playerSprite.position.y, cursorPos.x - this.playerSprite.position.x) +
            Math.PI / 2;
        this.playerSprite.rotation = angle;
    }

    playerShooting(mouse: any): void {
        if (mouse.buttons !== this.lastMouseButton) {
            this.shooting.shoot = mouse.buttons !== 0;
            this.lastMouseButton = mouse.buttons;
        }
        this.shooting.shootBullets();
    }
}
