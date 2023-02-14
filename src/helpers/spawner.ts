import { Application } from "pixi.js";
import { Constants } from "../helpers/Constants";

export default class Spawner {
    spawnInterval: number;
    maxSpawn: number;
    element: Function;
    spawns: any[];
    app: Application;
    constructor(app: Application, element: Function) {
        this.app = app;
        this.spawnInterval = 1000;
        this.maxSpawn = Constants.maxNumberOfEnemies;
        this.element = element;
        this.spawns = [];
        setInterval(() => this.spawner(), this.spawnInterval);
    }

    spawner(): void {
        if (this.app.gameStarted === false) return;
        if (this.spawns.length >= this.maxSpawn) return;
        const s = this.element();
        this.spawns.push(s);
    }
}
