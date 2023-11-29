import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import Player from "./models/player";
import Enemy from "./models/enemy";
import Spawner from "./helpers/spawner";

export default class Game {
    app: Application;
    player: Player;
    //enemy: Enemy;
    spawner: Spawner;
    restartButton: PIXI.Text;
    scoreText: PIXI.Text;
    mouse: PIXI.Point;

    constructor(app: Application) {
        this.app = app;
        this.player = new Player(app);
        this.spawner = new Spawner(this.app, () => new Enemy(this.app, this.player));
        this.player.addPlayer();

        const gameStartScene = this.createScene("BlackSpider\n\nClick to Start");
        const gameOverScene = this.createScene("Game Over");

        this.restartButton = this.restartButtonLogic();
        gameOverScene.addChild(this.restartButton);

        this.app.gameStarted = false;
        this.addBackground();

        this.scoreText = this.scoreTextLogic();
        this.app.stage.addChild(this.scoreText);
        this.app.stage.interactive = true;

        this.mouse = new PIXI.Point(0, 0);

        app.stage.on("pointertap", (event: PIXI.InteractionEvent) => {
            this.mouse = event.data.global;
        });

        this.app.ticker.add((delta) => {
            gameOverScene.visible = this.player.dead;
            gameStartScene.visible = !this.app.gameStarted;

            if (this.app.gameStarted === false) return;

            if (this.mouse != null) {
                this.player.playerMouseEvents(this.mouse);
            }

            this.spawner.spawns.forEach(function (value) {
                value.moveEnemies();
            });
            this.bulletHit(this.player.shooting.bullets, this.spawner.spawns, 10, 16);
            this.player.updateScoreText(this.scoreText);
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
                    this.destroyBullet(bullet);
                }
            });
        });
    }

    destroyBullet(bullet: any): void {
        const bulletAnim = new PIXI.AnimatedSprite([
            PIXI.Texture.from("Dark VFX 1 (40x32)11.png"),
            PIXI.Texture.from("Dark VFX 1 (40x32)12.png"),
            PIXI.Texture.from("Dark VFX 1 (40x32)13.png"),
            PIXI.Texture.from("Dark VFX 1 (40x32)14.png"),
            PIXI.Texture.from("Dark VFX 1 (40x32)15.png"),
        ]);
        bulletAnim.loop = false;
        bulletAnim.animationSpeed = 0.1;
        bulletAnim.anchor.set(0.5);
        bulletAnim.scale.set(1.5);
        bulletAnim.position.set(bullet.position.x, bullet.position.y);
        this.app.stage.addChild(bulletAnim);
        bulletAnim.play();
        bulletAnim.onComplete = () => {
            this.app.stage.removeChild(bulletAnim);
        };
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
            this.player.playerCurrentHealth = this.player.playerMaxHealth;
            this.player.score = 0;
            this.spawner.spawns.forEach(function (value) {
                value.kill();
            });
            this.player.dead = false;
        });
        return restartText;
    }

    scoreTextLogic(): PIXI.Text {
        const scoreText = new PIXI.Text("Score: " + this.player.score);
        scoreText.anchor.set(0.5);
        scoreText.position.set(this.app.screen.width / 2, this.app.screen.height - 150);
        scoreText.style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 40,
            fill: "white",
            stroke: "#ff3300",
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "#000000",
        });
        return scoreText;
    }
}
