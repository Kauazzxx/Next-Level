// SUPER JOGO DE PLATAFORMA 2D - ESTRUTURA AVANÇADA
// Menus, HUD, Barra de Progresso, Sistema de Fases, Modularização
// (Etapa 1: menus, HUD, barra de progresso, sistema de fases)

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// --- CORES E VISUAL ---
const COLORS = {
    bg: '#181c25',
    ground: '#23283a',
    grass: '#2e354a',
    hudBg: '#23283a',
    hudText: '#f5f5f5',
    playerBody: '#3ec6e0',
    playerFace: '#ffe0b2',
    playerHair: '#222',
    playerShirt: '#ff7b00',
    playerPants: '#1976d2',
    playerShoe: '#333',
    coin: '#ffe066',
    coinDetail: '#fffde7',
    coinStroke: '#b8860b',
    coinSpecial: '#ff4081',
    monster1: '#7c3aed',
    monster2: '#e94560',
    monster3: '#43a047',
    monsterFly: '#00bcd4',
    monsterEye: '#fff',
    monsterPupil: '#222',
    monsterMouth: '#fff',
    monsterTooth: '#e94560',
    particle: '#ffe066',
    jumpParticle: '#3ec6e0',
    powerup: '#00e676',
    powerupGlow: '#b9f6ca',
    speedup: '#00b0ff',
    shield: '#ffd600',
    flag: '#ffd600',
    flagPole: '#fff',
    flagBase: '#bdbdbd',
    spike: '#ff1744',
    life: '#e94560',
    level: '#3ec6e0',
    highscore: '#ffe066',
    win: '#00e676',
    checkpoint: '#ff9800',
    checkpointActive: '#00e676',
    vanish: '#bdbdbd',
    boss: '#ff5722',
    bossEye: '#fff',
    bossPupil: '#222',
    bossMouth: '#fff',
    bossTooth: '#fff',
    progressBar: '#00e676',
    progressBg: '#333'
};

// --- ESTADOS DO JOGO ---
const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAMEOVER: 'gameover',
    WIN: 'win',
    CREDITS: 'credits',
    CONTROLS: 'controls',
    TUTORIAL: 'tutorial'
};
let gameState = GAME_STATES.MENU;
let currentLevel = 0;
let levels = [];
let score = 0;
let specialScore = 0;
let highscore = localStorage.getItem('acao_highscore') || 0;
let lives = 3;
let level = 1;
let particles = [];
let win = false;
let lastCheckpoint = { x: 80, y: 320 };
let showTip = true;
let activePowerups = { speed: 0, shield: 0 };
let cameraX = 0;
let menuSelection = 0;
let menuOptions = ['Jogar', 'Controles', 'Créditos'];
let pauseSelection = 0;
let pauseOptions = ['Continuar', 'Reiniciar', 'Menu'];
let showTutorial = true;

// --- ESTRUTURA DE FASES (exemplo de 2 fases, pode expandir) ---
function createLevel1() {
    return {
        name: 'Floresta Inicial',
        length: 4200,
        platforms: [
            { x: 0, y: 360, w: 600 },
            { x: 700, y: 320, w: 200 },
            { x: 1000, y: 360, w: 300 },
            { x: 1400, y: 300, w: 180 },
            { x: 1700, y: 360, w: 400 },
            { x: 2200, y: 320, w: 200 },
            { x: 2500, y: 360, w: 500 },
            { x: 850, y: 220, w: 100 },
            { x: 1250, y: 180, w: 120 },
            { x: 2000, y: 220, w: 100 },
            { x: 2800, y: 200, w: 120 }
        ],
        // ... (demais elementos: buracos, moedas, inimigos, etc)
        // Para simplificar, só estrutura inicial nesta etapa
    };
}
function createLevel2() {
    return {
        name: 'Caverna Sombria',
        length: 5000,
        platforms: [
            { x: 0, y: 360, w: 400 },
            { x: 600, y: 320, w: 200 },
            { x: 900, y: 260, w: 180 },
            { x: 1200, y: 360, w: 400 },
            { x: 1800, y: 320, w: 200 },
            { x: 2100, y: 260, w: 120 },
            { x: 2400, y: 360, w: 600 },
            { x: 3200, y: 320, w: 200 },
            { x: 3500, y: 260, w: 120 },
            { x: 3800, y: 360, w: 400 },
            { x: 4300, y: 320, w: 200 }
        ]
    };
}
levels = [createLevel1(), createLevel2()];

// --- PERSONAGEM ---
const player = {
    x: 80,
    y: 320,
    w: 40,
    h: 48,
    vy: 0,
    vx: 0,
    onGround: true,
    blink: false,
    blinkTimer: 0,
    jumps: 0,
    maxJumps: 2
};

// --- ESTRUTURA DE CHEFÃO ---
const boss = {
    x: 0, y: 0, w: 80, h: 100, life: 20, active: false, phase: 1, attackTimer: 0, direction: 1
    // Adicione mais propriedades conforme necessário
};

// --- INIMIGOS INTELIGENTES ---
let smartEnemies = [
    // Exemplo: perseguidor
    { x: 2000, y: 320, w: 40, h: 48, type: 'chaser', speed: 2, active: true }
    // Adicione mais tipos: atirador, voador, etc
];

// --- POWER-UPS AVANÇADOS ---
let advancedPowerups = [
    { x: 1800, y: 200, r: 18, type: 'superJump', taken: false },
    { x: 3500, y: 400, r: 18, type: 'magnet', taken: false }
    // superJump: pulo mais alto, magnet: atrai moedas
];

// --- CONQUISTAS ---
let achievements = [
    { name: 'Primeira Moeda', unlocked: false, condition: () => score > 0 },
    { name: 'Sem Morrer', unlocked: false, condition: () => lives === 3 && gameState === GAME_STATES.WIN },
    { name: 'Todas as Moedas', unlocked: false, condition: () => /* lógica para todas as moedas */ false }
    // Adicione mais conquistas
];

// --- RANKING LOCAL ---
function saveScore(newScore) {
    let ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
    ranking.push(newScore);
    ranking.sort((a, b) => b - a);
    ranking = ranking.slice(0, 10);
    localStorage.setItem('ranking', JSON.stringify(ranking));
}
function drawRanking() {
    let ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = COLORS.hudBg;
    ctx.fillRect(350, 100, 500, 400);
    ctx.restore();
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = COLORS.coin;
    ctx.textAlign = 'center';
    ctx.fillText('RANKING', GAME_WIDTH / 2, 150);
    ctx.font = '20px Arial';
    ctx.fillStyle = COLORS.hudText;
    ranking.forEach((score, i) => {
        ctx.fillText(`${i + 1}º - ${score} pontos`, GAME_WIDTH / 2, 200 + i * 30);
    });
    ctx.font = '18px Arial';
    ctx.fillText('Pressione ESC para voltar', GAME_WIDTH / 2, 550);
}

// --- FUNÇÕES DE MENUS ---
function drawMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = COLORS.coin;
    ctx.textAlign = 'center';
    ctx.fillText('SUPER JOGO DE PLATAFORMA', canvas.width / 2, 120);
    ctx.font = '28px Arial';
    menuOptions.forEach((opt, i) => {
        ctx.fillStyle = i === menuSelection ? COLORS.level : COLORS.hudText;
        ctx.fillText(opt, canvas.width / 2, 200 + i * 60);
    });
    ctx.font = '18px Arial';
    ctx.fillStyle = COLORS.hudText;
    ctx.fillText('Use ↑/↓ e ENTER para navegar', canvas.width / 2, 380);
}
function drawPause() {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = COLORS.hudBg;
    ctx.fillRect(150, 100, 500, 200);
    ctx.restore();
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = COLORS.coin;
    ctx.textAlign = 'center';
    ctx.fillText('PAUSADO', canvas.width / 2, 160);
    ctx.font = '24px Arial';
    pauseOptions.forEach((opt, i) => {
        ctx.fillStyle = i === pauseSelection ? COLORS.level : COLORS.hudText;
        ctx.fillText(opt, canvas.width / 2, 210 + i * 40);
    });
    ctx.font = '16px Arial';
    ctx.fillStyle = COLORS.hudText;
    ctx.fillText('Pressione P para voltar', canvas.width / 2, 320);
}
function drawCredits() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = COLORS.coin;
    ctx.textAlign = 'center';
    ctx.fillText('CRÉDITOS', canvas.width / 2, 100);
    ctx.font = '20px Arial';
    ctx.fillStyle = COLORS.hudText;
    ctx.fillText('Desenvolvido por Você', canvas.width / 2, 160);
    ctx.fillText('Powered by JavaScript + Canvas', canvas.width / 2, 200);
    ctx.fillText('Com ajuda da IA', canvas.width / 2, 240);
    ctx.font = '18px Arial';
    ctx.fillText('Pressione ESC para voltar', canvas.width / 2, 350);
}
function drawControls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = COLORS.coin;
    ctx.textAlign = 'center';
    ctx.fillText('CONTROLES', canvas.width / 2, 100);
    ctx.font = '20px Arial';
    ctx.fillStyle = COLORS.hudText;
    ctx.fillText('Setas: mover', canvas.width / 2, 160);
    ctx.fillText('ESPAÇO: pular', canvas.width / 2, 200);
    ctx.fillText('Shift: correr', canvas.width / 2, 240);
    ctx.fillText('P: pausar', canvas.width / 2, 280);
    ctx.font = '18px Arial';
    ctx.fillText('Pressione ESC para voltar', canvas.width / 2, 350);
}
function drawTutorial() {
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = COLORS.hudBg;
    ctx.fillRect(100, 80, 600, 240);
    ctx.restore();
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = COLORS.coin;
    ctx.textAlign = 'center';
    ctx.fillText('TUTORIAL', canvas.width / 2, 130);
    ctx.font = '20px Arial';
    ctx.fillStyle = COLORS.hudText;
    ctx.fillText('Colete moedas, ative checkpoints, desvie dos inimigos!', canvas.width / 2, 180);
    ctx.fillText('Pegue power-ups para ganhar habilidades temporárias.', canvas.width / 2, 210);
    ctx.fillText('Chegue até a bandeira para vencer a fase!', canvas.width / 2, 240);
    ctx.font = '18px Arial';
    ctx.fillText('Pressione qualquer tecla para começar', canvas.width / 2, 310);
}

// --- HUD AVANÇADA ---
function drawHUD(levelObj) {
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = COLORS.hudBg;
    ctx.fillRect(0, 0, canvas.width, 50);
    ctx.globalAlpha = 1;
    ctx.font = 'bold 22px Arial';
    ctx.fillStyle = COLORS.coin;
    ctx.fillText('Moedas: ' + score, 30, 35);
    ctx.fillStyle = COLORS.coinSpecial;
    ctx.fillText('Moedas Especiais: ' + specialScore, 180, 35);
    ctx.fillStyle = COLORS.life;
    ctx.fillText('Vidas: ' + lives, 350, 35);
    ctx.fillStyle = COLORS.level;
    ctx.fillText('Fase: ' + (currentLevel + 1) + ' - ' + levelObj.name, 480, 35);
    ctx.fillStyle = COLORS.highscore;
    ctx.fillText('Recorde: ' + highscore, 700, 35);
    // Barra de progresso
    let progress = Math.min(1, player.x / (levelObj.length - 100));
    ctx.fillStyle = COLORS.progressBg;
    ctx.fillRect(20, 10, 200, 8);
    ctx.fillStyle = COLORS.progressBar;
    ctx.fillRect(20, 10, 200 * progress, 8);
    ctx.restore();
}

// --- GAME LOOP PRINCIPAL ---
function mainGameLoop() {
    // Aqui virá o loop do jogo, HUD, chamada de drawHUD(levels[currentLevel]), etc
    // Por enquanto, só HUD e fundo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawHUD(levels[currentLevel]);
    // ... (desenhar plataformas, inimigos, player, etc)
}

// --- LOOP DE RENDERIZAÇÃO ---
function renderLoop() {
    switch (gameState) {
        case GAME_STATES.MENU:
            drawMenu();
            break;
        case GAME_STATES.PAUSED:
            mainGameLoop();
            drawPause();
            break;
        case GAME_STATES.CREDITS:
            drawCredits();
            break;
        case GAME_STATES.CONTROLS:
            drawControls();
            break;
        case GAME_STATES.TUTORIAL:
            mainGameLoop();
            drawTutorial();
            break;
        default:
            mainGameLoop();
            break;
    }
    requestAnimationFrame(renderLoop);
}

// --- CONTROLES DE MENU E JOGO ---
document.addEventListener('keydown', (e) => {
    if (gameState === GAME_STATES.MENU) {
        if (e.key === 'ArrowUp') menuSelection = (menuSelection + menuOptions.length - 1) % menuOptions.length;
        if (e.key === 'ArrowDown') menuSelection = (menuSelection + 1) % menuOptions.length;
        if (e.key === 'Enter') {
            if (menuSelection === 0) gameState = GAME_STATES.TUTORIAL;
            if (menuSelection === 1) gameState = GAME_STATES.CONTROLS;
            if (menuSelection === 2) gameState = GAME_STATES.CREDITS;
        }
    } else if (gameState === GAME_STATES.PAUSED) {
        if (e.key === 'ArrowUp') pauseSelection = (pauseSelection + pauseOptions.length - 1) % pauseOptions.length;
        if (e.key === 'ArrowDown') pauseSelection = (pauseSelection + 1) % pauseOptions.length;
        if (e.key === 'Enter') {
            if (pauseSelection === 0) gameState = GAME_STATES.PLAYING;
            if (pauseSelection === 1) startGame();
            if (pauseSelection === 2) gameState = GAME_STATES.MENU;
        }
        if (e.key === 'p' || e.key === 'P') gameState = GAME_STATES.PLAYING;
    } else if (gameState === GAME_STATES.CREDITS || gameState === GAME_STATES.CONTROLS) {
        if (e.key === 'Escape') gameState = GAME_STATES.MENU;
    } else if (gameState === GAME_STATES.TUTORIAL) {
        gameState = GAME_STATES.PLAYING;
    } else if (gameState === GAME_STATES.PLAYING) {
        if (e.key === 'p' || e.key === 'P') gameState = GAME_STATES.PAUSED;
        // Aqui virão os controles do player, pulo, etc
    }
});

// --- INICIAR JOGO ---
function startGame() {
    score = 0;
    specialScore = 0;
    lives = 3;
    level = 1;
    win = false;
    activePowerups.speed = 0;
    activePowerups.shield = 0;
    player.x = 80;
    player.y = 320;
    player.vy = 0;
    player.vx = 0;
    player.onGround = true;
    player.blink = false;
    player.blinkTimer = 0;
    player.jumps = 0;
    lastCheckpoint = { x: 80, y: 320 };
    particles = [];
    cameraX = 0;
    showTip = true;
    gameState = GAME_STATES.PLAYING;
}

// --- INICIAR LOOP ---
renderLoop(); 
