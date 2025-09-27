import Player from './models/player.js';
import Projectile from './models/projectile.js';
import EnemyFactory from './factories/enemy-factory.js';
import Particle from './models/particle.js';

const canvas = document.querySelector('#canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreElement = document.querySelector('#score');
const levelElement = document.querySelector('#level');
const fpsElement = document.querySelector('#fps');
const bigScoreElement = document.querySelector('#big-score');
const playButton = document.querySelector('#play-button');
const modal = document.querySelector('#modal');
let projectiles = [];
let enemies = [];
let particles = [];
const player = new Player(canvas.width / 2, canvas.height / 2, 30, 'tomato');
let mainAnimation;
let frames = 0;
let fps = 0;
let score = 0;
let level = 1;
let lastTime = 0;
const minimumEnemySpawnRate = 1000;
let enemySpawnRate = minimumEnemySpawnRate;
let enemySpwanTimer = enemySpawnRate;

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
});

window.addEventListener('click', (event) => {
    if (modal.style.display !== 'none') return;

    const origin = { x: player.x, y: player.y };
    const distance = { x: event.clientX - origin.x, y: event.clientY - origin.y };
    const newProjectile = Projectile.create(origin, distance);
    projectiles.push(newProjectile);
});

playButton.addEventListener('click', () => {
    updateScore(-score);
    level = 1;
    levelElement.textContent = level;
    modal.style.display = 'none';
    mainAnimation = requestAnimationFrame(animate);
});

function reset() {
    scoreElement.textContent = score;
    bigScoreElement.textContent = score;
    projectiles = [];
    enemies = [];
    particles = [];
    cancelAnimationFrame(mainAnimation);
    modal.style.display = 'flex';
    enemySpawnRate = minimumEnemySpawnRate;
    updateBackground(1);
}

function animate(currentTime) {
    frames++;
    mainAnimation = requestAnimationFrame(animate);
    updateBackground();

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    fps = Math.round(1000 / deltaTime);
    if (frames % 30 === 0) {
        fpsElement.textContent = `${fps} fps`;
    }

    spawnEnemies(deltaTime);

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

function upLevel() {
    level++;
    levelElement.textContent = level;
}

function updateScore(points) {
    score += points;
    scoreElement.textContent = score;

    if (score / 100 >= level) upLevel();
}

function updateBackground(alpha = 0.18) {
    c.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    c.fillRect(0, 0, canvas.width, canvas.height);
}

function spawnEnemies(deltaTime) {
    enemySpwanTimer -= deltaTime;
    if (enemySpwanTimer > 0) return;
    enemies.push(EnemyFactory.create(canvas, player, level));
    enemySpwanTimer = enemySpawnRate;
}

function createParticles(enemy) {
    for (let i = 0; i < enemy.radius * 2; i++) {
        particles.push(new Particle(enemy.x, enemy.y, Math.random() * 2 + 0.5, enemy.color, {
            x: (Math.random() - 0.5) * (Math.random() * 5),
            y: (Math.random() - 0.5) * (Math.random() * 5)
        }));
    }
}