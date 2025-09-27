import Entity from './entity.js';

export default class Projectile extends Entity {
    constructor(x, y, radius, color, velocity) {
        super(x, y);
        this.color = color;
        this.radius = radius;
        this.velocity = velocity;
    }

    static create(origin, distance) {
        const angle = Math.atan2(distance.y, distance.x);
        const velocity = {
            x: Math.cos(angle) * 10,
            y: Math.sin(angle) * 10
        };
        return new Projectile(origin.x, origin.y, 5, 'white', velocity);
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
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}