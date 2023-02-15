import * as PIXI from "pixi.js";
import "./style.css";
import Game from "./Game";
import { gameOptions } from "./gameConfig";
import { Application } from "pixi.js";

const app = new Application(gameOptions);
window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);

    resizeCanvas();

    new Game(app);

    startGame();
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = PIXI.Loader.shared;
        loader.add("sprites", "./assets/player/spritesheet.json");
        loader.add("sprites2", "./assets/player/vfx.json");
        loader.add("sprites3", "./assets/enemy/hero.json");
        loader.onComplete.once(() => {
            res();
        });

        loader.onError.once(() => {
            rej();
        });

        loader.load();
    });
}

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    };

    resize();

    window.addEventListener("resize", resize);
}

function startGame(): void {
    const start = () => {
        app.gameStarted = true;
    };

    document.addEventListener("pointerdown", start);
}
