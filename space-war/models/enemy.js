import Entity from './entity.js';

export default class Enemy extends Entity {
    static MINIMUM_RADIUS = 10;

    constructor(x, y, radius, color, velocity) {
        super(x, y);
        this.color = color;
        this.radius = radius;
        this.velocity = velocity;
    }

    static create(origin, route, radius, velocityFactor) {
        const angle = Math.atan2(route.y, route.x);
        const velocity = {
            x: Math.cos(angle) * velocityFactor,
            y: Math.sin(angle) * velocityFactor
        };
        return new Enemy(origin.x, origin.y, radius, `hsl(${Math.random() * 360}, 50%, 50%)`, velocity);
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

    survives(damage) {
        return this.radius - damage > Enemy.MINIMUM_RADIUS;
    }
}