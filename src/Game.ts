import { Vector2 } from "pixi-spine";
import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import Victor from "victor";
import Player from "./models/player";
import Enemy from "./models/enemy";
import Spawner from "./helpers/spawner";

export default class Game {
    //static Instance: Game;
    app: Application;
    player: Player;
    //enemy: Enemy;
    spawner: Spawner;

    constructor(app: Application) {
        //Game.Instance = this;
        this.app = app;
        this.player = new Player(app);
        //this.enemy = new Enemy(app, this.player);
        this.spawner = new Spawner(this.app,() => new Enemy(this.app, this.player));

        this.player.addPlayer();

        let gameStartScene = this.createScene("Click to Start");
        let gameOverScene = this.createScene("Game Over");
        this.app.gameStarted = false;

        this.app.ticker.add((delta) => {
            gameOverScene.visible = this.player.dead;
            gameStartScene.visible = !this.app.gameStarted;
            if(this.app.gameStarted === false) return;
            this.player.playerMouseEvents();
            this.spawner.spawns.forEach(function (value) {
                value.moveEnemies();
            });
            this.bulletHit(this.player.shooting.bullets, this.spawner.spawns, 8, 16);
        });
    }

    bulletHit(bullets: Array<any>, enemies: Array<Enemy>, bulletRadius: number, enemyRadius: number): void {
        bullets.forEach((bullet) => {
            enemies.forEach((enemy, index) => {
                let distanceX = enemy.enemyGraphics.position.x - bullet.position.x;
                let distanceY = enemy.enemyGraphics.position.y - bullet.position.y;
                let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                if (distance < bulletRadius + enemyRadius) {
                    // Add to radiuses to calculate interference and distance
                    enemies.splice(index, 1);
                    enemy.kill();
                }
            });
        });
    }
    createScene(sceneText: any): PIXI.Container {
        const sceneContainer = new PIXI.Container();
        const text = new PIXI.Text(sceneText);
        text.style.fill = 0x00FF00;
        text.x = this.app.screen.width / 2;
        text.y = 0;
        text.anchor.set(0.5,0);
        sceneContainer.zIndex = 1;
        sceneContainer.addChild(text);
        this.app.stage.addChild(sceneContainer);
        return sceneContainer;
    }

}
