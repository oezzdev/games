import Entity from './entity.js';

export default class Player extends Entity {
    constructor(x, y, radius, color) {
        super(x, y);
        this.radius = radius;
        this.color = color;
    }

    draw(c) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }

    update(c) {
        this.draw(c);
    }
}