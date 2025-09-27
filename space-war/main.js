const canvas = document.querySelector('#canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreElement = document.querySelector('#score');
const bigScoreElement = document.querySelector('#big-score');
const playButton = document.querySelector('#play-button');
const modal = document.querySelector('#modal');
let projectiles = [];
let enemies = [];
let particles = [];
const player = new Player(canvas.width / 2, canvas.height / 2, 30, 'tomato');
let mainAnimation;
let score = 0;
let enemyInterval;

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
});

window.addEventListener('click', (event) => {
    const origin = { x: player.x, y: player.y };
    const distance = { x: event.clientX - origin.x, y: event.clientY - origin.y };
    const newProjectile = Projectile.create(origin, distance);
    projectiles.push(newProjectile);
});

playButton.addEventListener('click', () => {
    updateScore(-score);
    modal.style.display = 'none';
    animate();
    spawnEnemies();
});

function reset() {
    scoreElement.textContent = score;
    bigScoreElement.textContent = score;
    projectiles = [];
    enemies = [];
    particles = [];
    cancelAnimationFrame(mainAnimation);
    modal.style.display = 'flex';
    clearInterval(enemyInterval);
}

function animate() {
    mainAnimation = requestAnimationFrame(animate);

    clear();

    projectiles.forEach((entity, index) => {
        entity.update(c);
        if (entity.isOutOfBounds(canvas.width, canvas.height)) {
            setTimeout(() => projectiles.splice(index, 1), 0);
        }
    });

    player.update(c);

    enemies.forEach((enemy, enemyIndex) => {
        enemy.update(c);

        if (enemy.isOutOfBounds(canvas.width, canvas.height)) {
            setTimeout(() => enemies.splice(enemyIndex, 1), 0);
            return;
        }

        if (player.isCollidingWith(enemy)) {
            reset();
            return;
        }

        particles.forEach((particle, particleIndex) => {
            if (particle.isFaded()) {
                setTimeout(() => particles.splice(particleIndex, 1), 0);
            } else {
                particle.update(c);
            }
        });

        projectiles.forEach((projectile, projectileIndex) => {
            const damage = 10;
            if (projectile.isCollidingWith(enemy)) {
                createParticles(enemy);
                if (enemy.survives(damage)) {
                    updateScore(1);
                    enemy.radius -= damage;
                    setTimeout(() => projectiles.splice(projectileIndex, 1), 0);
                } else {
                    updateScore(5);
                    setTimeout(() => {
                        enemies.splice(enemyIndex, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            }
        });
    });
};

function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

function clear() {
    c.fillStyle = 'rgba(0, 0, 0, 0.18)';
    c.fillRect(0, 0, canvas.width, canvas.height);
}

function spawnEnemies() {
    enemyInterval = setInterval(() => {
        enemies.push(EnemyFactory.create(canvas, player));
    }, 1000);
}

function createParticles(enemy) {
    for (let i = 0; i < enemy.radius * 2; i++) {
        particles.push(new Particle(enemy.x, enemy.y, Math.random() * 2 + 1, enemy.color, {
            x: (Math.random() - 0.5) * (Math.random() * 6),
            y: (Math.random() - 0.5) * (Math.random() * 6)
        }));
    }
}