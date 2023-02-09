import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { gameOptions } from "./gameConfig";

export default class Game {
    //static Instance: Game;
    app: Application;
    square: PIXI.Sprite;

    constructor(app: Application) {
        //Game.Instance = this;
        this.app = app;
        this.square = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.addSquare();
        this.app.ticker.add((delta) => {
            const cursorPos = app.renderer.plugins.interaction.mouse.global;
            let angle =
                Math.atan2(cursorPos.y - this.square.position.y, cursorPos.x - this.square.position.x) + Math.PI / 2;
            this.square.rotation = angle;
        });
    }

    addSquare(): void {
        this.square.anchor.set(0.5);
        this.square.position.set(gameOptions.width / 2, gameOptions.height / 2);
        this.square.width = this.square.height = 32;
        this.app.stage.addChild(this.square);
    }
}
