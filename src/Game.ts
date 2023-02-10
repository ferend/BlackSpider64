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
        this.spawner = new Spawner(() => new Enemy(app, this.player));

        this.player.addPlayer();
        this.app.ticker.add((delta) => {
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
}
