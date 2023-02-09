import * as PIXI from "pixi.js";
import { Application } from "pixi.js";

export default class Player {
    app: Application;
    playerSprite: PIXI.Sprite;

    constructor(app: Application) {
        this.app = app;
        this.playerSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    }

    addPlayer(): void {
        this.playerSprite.anchor.set(0.5);
        this.playerSprite.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
        this.playerSprite.width = this.playerSprite.height = 32;
        this.app.stage.addChild(this.playerSprite);
    }

    playerRotation(): void {
        const cursorPos = this.app.renderer.plugins.interaction.mouse.global;
        let angle =
            Math.atan2(cursorPos.y - this.playerSprite.position.y, cursorPos.x - this.playerSprite.position.x) +
            Math.PI / 2;
        this.playerSprite.rotation = angle;
    }
}
