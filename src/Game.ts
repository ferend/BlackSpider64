import { Vector2 } from "pixi-spine";
import * as PIXI from "pixi.js";
import { Application } from "pixi.js";

export default class Game {
    //static Instance: Game;
    app: Application;
    square: PIXI.Sprite;
    enemy: PIXI.Graphics;

    constructor(app: Application) {
        //Game.Instance = this;
        this.app = app;
        this.square = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.enemy = new PIXI.Graphics();
        this.addSquare();
        this.app.ticker.add((delta) => {
            this.mouseRotation();
        });
        this.spwanEnemies();
    }

    addSquare(): void {
        this.square.anchor.set(0.5);
        this.square.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
        this.square.width = this.square.height = 32;
        this.app.stage.addChild(this.square);
    }

    spwanEnemies(): void {
        let r = this.randomSpawPoint();
        let enemyRad = 16;
        this.enemy.position.set(r.x, r.y);
        this.enemy.beginFill(0xff0000, 1);
        this.enemy.drawCircle(0, 0, enemyRad);
        this.enemy.endFill();
        this.app.stage.addChild(this.enemy);
    }

    randomSpawPoint(): Vector2 {
        let edge = Math.floor(Math.random() * 4);
        let spawnPoint = new Vector2(0, 0);
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

    mouseRotation(): void {
        const cursorPos = this.app.renderer.plugins.interaction.mouse.global;
        let angle =
            Math.atan2(cursorPos.y - this.square.position.y, cursorPos.x - this.square.position.x) + Math.PI / 2;
        this.square.rotation = angle;
    }
}
