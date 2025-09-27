import Projectile from './projectile.js';

export default class Particle extends Projectile {
    static FRICTION = 0.99;

    constructor(x, y, radius, color, velocity) {
        super(x, y, radius);
        this.alpha = 1;
        this.color = color;
        this.velocity = velocity;
    }

    draw(c) {
        c.save();
        c.globalAlpha = this.alpha;
        super.draw(c);
        c.restore();
    }

    update(c) {
        this.draw(c);
        this.velocity.x *= Particle.FRICTION;
        this.velocity.y *= Particle.FRICTION;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }

    isFaded() {
        return this.alpha <= 0;
    }
}