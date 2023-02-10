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
            this.player.playerRotation();
            this.spawner.spawns.forEach(function (value) {
                value.moveEnemies();
            });
        });
    }
}
