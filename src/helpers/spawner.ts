export default class Spawner {
    spawnInterval: number;
    maxSpawn: number;
    element: Function;
    spawns: any[];
    constructor(element: Function) {
        this.spawnInterval = 1000;
        this.maxSpawn = 3;
        this.element = element;
        this.spawns = [];
        setInterval(() => this.spawner(), this.spawnInterval);
    }

    spawner(): void {
        if (this.spawns.length >= this.maxSpawn) return;
        let s = this.element();
        this.spawns.push(s);
    }
}
