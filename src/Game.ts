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
    restartButton: PIXI.Text;

    constructor(app: Application) {
        //Game.Instance = this;
        this.app = app;
        this.player = new Player(app);
        //this.enemy = new Enemy(app, this.player);
        this.spawner = new Spawner(this.app, () => new Enemy(this.app, this.player));
        this.player.addPlayer();

        const gameStartScene = this.createScene("BlackSpider\n\nClick to Start");
        const gameOverScene = this.createScene("Game Over");

        this.restartButton = this.restartButtonLogic();
        gameOverScene.addChild(this.restartButton);

        this.app.gameStarted = false;
        this.addBackground();

        this.app.ticker.add((delta) => {
            gameOverScene.visible = this.player.dead;
            gameStartScene.visible = !this.app.gameStarted;
            if (this.app.gameStarted === false) return;
            this.player.playerMouseEvents();
            this.spawner.spawns.forEach(function (value) {
                value.moveEnemies();
            });
            this.bulletHit(this.player.shooting.bullets, this.spawner.spawns, 10, 16);
        });
    }

    bulletHit(bullets: Array<any>, enemies: Array<Enemy>, bulletRadius: number, enemyRadius: number): void {
        bullets.forEach((bullet) => {
            enemies.forEach((enemy, index) => {
                const distanceX = enemy.enemyGraphics.position.x - bullet.position.x;
                const distanceY = enemy.enemyGraphics.position.y - bullet.position.y;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
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
        text.style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 40,
            align: "center",
            fill: "white",
            stroke: "#ff3300",
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "#000000",

        });
        text.style.fill = 0x24012b;
        text.x = this.app.screen.width / 2;
        text.y = this.app.screen.height - 700;
        text.anchor.set(0.5, 0);
        sceneContainer.zIndex = 1;
        sceneContainer.addChild(text);
        this.app.stage.addChild(sceneContainer);
        return sceneContainer;
    }

    addBackground(): void {
        const background = new PIXI.Sprite(PIXI.Texture.from("bg.jpg"));
        background.width = this.app.screen.width;
        background.height = this.app.screen.height;
        background.zIndex = -2;
        this.app.stage.addChild(background);
    }

    restartButtonLogic(): PIXI.Text {
        const restartText = new PIXI.Text("Restart");

        restartText.anchor.set(0.5);
        restartText.position.set(this.app.screen.width / 2, this.app.screen.height - 100);
        restartText.interactive = true;
        restartText.buttonMode = true;

        restartText.style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 40,
            fill: "white",
            stroke: "#ff3300",
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "#000000",
        });

        restartText.on("pointerdown", () => {
            this.app.gameStarted = true;
            this.player.dead = false;
            this.player.playerCurrentHealth = this.player.playerMaxHealth;
            this.spawner.spawns.forEach(function (value) {
                value.kill();
            });
        });
        return restartText;
    }
}
