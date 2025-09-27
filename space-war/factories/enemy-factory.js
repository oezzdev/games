import Enemy from '../models/enemy.js';

export default class EnemyFactory {
    static create(canvas, objective, level) {
        const radius = Math.random() * (30 - 10) + 10;
        const side = Math.floor(Math.random() * 4);
        let x, y; 

        switch (side) {
            case 0: // Top
                x = Math.random() * canvas.width;
                y = 0 - radius;
                break;
            case 1: // Bottom
                x = Math.random() * canvas.width;
                y = canvas.height + radius;
                break;
            case 2: // Left
                x = 0 - radius;
                y = Math.random() * canvas.height;
                break;
            case 3: // Right
                x = canvas.width + radius;
                y = Math.random() * canvas.height;
                break;
        }
        const route = {
            x: objective.x - x,
            y: objective.y - y
        };
        return Enemy.create({ x, y }, route, radius, level);
    }
}