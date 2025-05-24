// Jogo de plataforma simples estilo Mario
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Personagem
const player = {
    x: 80,
    y: 320,
    w: 40,
    h: 40,
    color: '#ff7b00',
    vy: 0,
    onGround: true
};

// Chão
const ground = {
    y: 360,
    color: '#4caf50'
};

// Moedas
const coins = [
    { x: 300, y: 320, r: 12, collected: false },
    { x: 500, y: 320, r: 12, collected: false }
];

// Gravidade
const gravity = 1.5;
let keys = {};
let score = 0;

// Humaninhos (inimigos)
const enemies = [
    { x: 600, y: 320, w: 32, h: 48, color: '#2196f3', dir: -1, face: '#fff', hair: '#222', shirt: '#4caf50', pants: '#1976d2' },
    { x: 450, y: 320, w: 32, h: 48, color: '#e91e63', dir: 1, face: '#ffe0b2', hair: '#a0522d', shirt: '#ffb300', pants: '#d84315' }
];

let coinEffect = null;

function drawPlayer() {
    // Corpo
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.w, player.h);
    // Olhos
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(player.x + 12, player.y + 14, 5, 0, Math.PI * 2);
    ctx.arc(player.x + 28, player.y + 14, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(player.x + 12, player.y + 14, 2, 0, Math.PI * 2);
    ctx.arc(player.x + 28, player.y + 14, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawGround() {
    ctx.fillStyle = ground.color;
    ctx.fillRect(0, ground.y, canvas.width, canvas.height - ground.y);
}

function drawCoins() {
    coins.forEach(coin => {
        if (!coin.collected) {
            ctx.save();
            ctx.shadowColor = '#ffb300';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(coin.x, coin.y, coin.r, 0, Math.PI * 2);
            ctx.fillStyle = '#ffeb3b';
            ctx.fill();
            ctx.restore();
            ctx.strokeStyle = '#b8860b';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
}

function drawHumaninho(e) {
    ctx.save();
    // Pernas
    ctx.fillStyle = e.pants;
    ctx.fillRect(e.x + 4, e.y + 36, 8, 12);
    ctx.fillRect(e.x + 20, e.y + 36, 8, 12);
    // Corpo
    ctx.fillStyle = e.shirt;
    ctx.fillRect(e.x + 6, e.y + 20, 20, 18);
    // Braços
    ctx.fillStyle = e.face;
    ctx.fillRect(e.x - 6, e.y + 22, 10, 8);
    ctx.fillRect(e.x + 28, e.y + 22, 10, 8);
    // Cabeça
    ctx.beginPath();
    ctx.arc(e.x + 16, e.y + 12, 12, 0, Math.PI * 2);
    ctx.fillStyle = e.face;
    ctx.fill();
    // Cabelo
    ctx.beginPath();
    ctx.arc(e.x + 16, e.y + 8, 10, Math.PI, 2 * Math.PI);
    ctx.fillStyle = e.hair;
    ctx.fill();
    // Olhos
    ctx.beginPath();
    ctx.arc(e.x + 11, e.y + 14, 2, 0, Math.PI * 2);
    ctx.arc(e.x + 21, e.y + 14, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    // Sorriso
    ctx.beginPath();
    ctx.arc(e.x + 16, e.y + 18, 5, 0, Math.PI);
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
}

function drawCoinEffect() {
    if (coinEffect) {
        ctx.save();
        ctx.globalAlpha = coinEffect.alpha;
        ctx.beginPath();
        ctx.arc(coinEffect.x, coinEffect.y, coinEffect.r, 0, Math.PI * 2);
        ctx.fillStyle = '#fffde7';
        ctx.fill();
        ctx.restore();
        coinEffect.r += 2;
        coinEffect.alpha -= 0.05;
        if (coinEffect.alpha <= 0) coinEffect = null;
    }
}

function drawScore() {
    ctx.font = '24px Arial';
    ctx.fillStyle = '#ff7b00';
    ctx.fillText('Moedas: ' + score, 20, 40);
}

function update() {
    // Movimento lateral
    if (keys['ArrowLeft']) player.x -= 5;
    if (keys['ArrowRight']) player.x += 5;
    // Limites
    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
    // Gravidade
    if (!player.onGround) {
        player.vy += gravity;
        player.y += player.vy;
        if (player.y + player.h >= ground.y) {
            player.y = ground.y - player.h;
            player.vy = 0;
            player.onGround = true;
        }
    }
    updateEnemies();
    checkPlayerEnemyCollision();
    // Colisão com moedas
    coins.forEach(coin => {
        if (!coin.collected &&
            player.x + player.w > coin.x - coin.r &&
            player.x < coin.x + coin.r &&
            player.y + player.h > coin.y - coin.r &&
            player.y < coin.y + coin.r) {
            coin.collected = true;
            score++;
            coinEffect = { x: coin.x, y: coin.y, r: 12, alpha: 0.7 };
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawCoins();
    enemies.forEach(drawHumaninho);
    drawPlayer();
    drawScore();
    drawCoinEffect();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if ((e.key === ' ' || e.key === 'ArrowUp') && player.onGround) {
        player.vy = -20;
        player.onGround = false;
    }
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Controles por botão
window.moveLeft = function() { keys['ArrowLeft'] = true; setTimeout(()=>{keys['ArrowLeft']=false;}, 100); };
window.moveRight = function() { keys['ArrowRight'] = true; setTimeout(()=>{keys['ArrowRight']=false;}, 100); };
window.jump = function() { if (player.onGround) { player.vy = -20; player.onGround = false; } };
window.stopPlayer = function() { keys['ArrowLeft'] = false; keys['ArrowRight'] = false; };

function updateEnemies() {
    enemies.forEach(e => {
        e.x += e.dir * 2;
        if (e.x < 400 || e.x > 700) e.dir *= -1;
    });
}

function checkPlayerEnemyCollision() {
    for (const e of enemies) {
        if (
            player.x + player.w > e.x &&
            player.x < e.x + e.w &&
            player.y + player.h > e.y &&
            player.y < e.y + e.h
        ) {
            coins.forEach(c => c.collected = false);
            score = 0;
            player.x = 80;
            player.y = 320;
        }
    }
}

gameLoop(); 
