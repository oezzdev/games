export default class Entity {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw(c) {
        // Placeholder method to be overridden by subclasses
    }

    update(c) {
        // Placeholder method to be overridden by subclasses
    }

    isOutOfBounds(width, height) {
        return this.x + this.radius < 0 ||
            this.x - this.radius > width ||
            this.y + this.radius < 0 ||
            this.y - this.radius > height;
    }

    isCollidingWith(entity) {
        const distance = Math.hypot(this.x - entity.x, this.y - entity.y);
        return distance < this.radius + entity.radius;
    }
}