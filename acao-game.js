class SheepJumpGame {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        this.sheep = document.getElementById('sheep');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.speedElement = document.getElementById('speed');
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.startBtn = document.getElementById('startBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.finalScoreElement = document.getElementById('finalScore');
        this.newRecordElement = document.getElementById('newRecord');
        this.cloudsContainer = document.getElementById('clouds');
        this.particlesContainer = document.getElementById('particles');
        
        this.isGameRunning = false;
        this.isJumping = false;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('sheepJumpHighScore')) || 0;
        this.gameSpeed = 3;
        this.baseSpeed = 3;
        this.fences = [];
        this.stars = [];
        this.clouds = [];
        this.gameLoop = null;
        this.cloudSpawnTimer = null;
        this.combo = 0;
        this.lastStarTime = 0;
        
        this.init();
        this.createClouds();
    }
    
    init() {
        this.highScoreElement.textContent = `Best: ${this.highScore}`;
        
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        
        // Controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.isGameRunning) {
                    this.jump();
                }
            }
        });
        
        // Mobile touch controls
        this.gameArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.isGameRunning) {
                this.jump();
            }
        });
        
        // Prevent scrolling on mobile
        document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }
    
    createClouds() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.spawnCloud();
            }, i * 3000);
        }
        
        this.cloudSpawnTimer = setInterval(() => {
            this.spawnCloud();
        }, 8000);
    }
    
    spawnCloud() {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.width = Math.random() * 40 + 60 + 'px';
        cloud.style.height = Math.random() * 20 + 30 + 'px';
        cloud.style.top = Math.random() * 150 + 20 + 'px';
        cloud.style.left = '100%';
        this.cloudsContainer.appendChild(cloud);
        
        setTimeout(() => {
            if (cloud.parentNode) {
                cloud.remove();
            }
        }, 20000);
    }
    
    startGame() {
        this.isGameRunning = true;
        this.score = 0;
        this.gameSpeed = this.baseSpeed;
        this.fences = [];
        this.stars = [];
        this.isJumping = false;
        this.combo = 0;
        this.lastStarTime = 0;
        
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        
        this.updateUI();
        
        // Clear any existing obstacles
        document.querySelectorAll('.fence, .star').forEach(el => el.remove());
        
        // Start spawning obstacles
        this.spawnObstacle();
        
        // Start game loop
        this.gameLoop = setInterval(() => this.update(), 16); // ~60fps
    }
    
    jump() {
        if (this.isJumping) return;
        
        this.isJumping = true;
        this.sheep.classList.add('jumping');
        
        // Jump sound effect (visual feedback)
        this.createParticles(this.sheep.offsetLeft + 25, 380, '#87CEEB', 5);
        
        setTimeout(() => {
            this.isJumping = false;
            this.sheep.classList.remove('jumping');
        }, 600);
    }
    
    spawnObstacle() {
        if (!this.isGameRunning) return;
        
        const random = Math.random();
        
        // 70% chance for fence, 30% chance for star
        if (random < 0.7) {
            this.spawnFence();
        } else {
            this.spawnStar();
        }
        
        // Schedule next obstacle
        const nextDelay = Math.random() * 1500 + 1000; // 1-2.5 seconds
        setTimeout(() => this.spawnObstacle(), nextDelay);
    }
    
    spawnFence() {
        const fence = document.createElement('div');
        fence.className = 'fence';
        fence.style.left = '820px';
        this.gameArea.appendChild(fence);
        this.fences.push(fence);
    }
    
    spawnStar() {
        const star = document.createElement('div');
        star.className = 'star';
        star.textContent = '⭐';
        star.style.left = '820px';
        this.gameArea.appendChild(star);
        this.stars.push(star);
    }
    
    createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + Math.random() * 20 - 10 + 'px';
            particle.style.top = y + Math.random() * 20 - 10 + 'px';
            particle.style.background = color;
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 20 + 10;
            particle.style.setProperty('--dx', Math.cos(angle) * velocity + 'px');
            particle.style.setProperty('--dy', Math.sin(angle) * velocity + 'px');
            
            this.particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 1000);
        }
    }
    
    updateUI() {
        this.scoreElement.textContent = `Score: ${this.score}`;
        this.speedElement.textContent = `Speed: ${Math.round((this.gameSpeed / this.baseSpeed) * 10) / 10}x`;
    }
    
    update() {
        if (!this.isGameRunning) return;
        
        // Move fences
        this.fences.forEach((fence, index) => {
            const currentLeft = parseInt(fence.style.left);
            const newLeft = currentLeft - this.gameSpeed;
            
            if (newLeft < -20) {
                // Fence passed, remove it and increase score
                fence.remove();
                this.fences.splice(index, 1);
                this.score += 10;
                this.combo++;
                
                // Combo bonus
                if (this.combo > 1) {
                    this.score += this.combo * 5;
                    this.createParticles(150, 150, '#FFD700', 3);
                }
                
                this.updateUI();
                
                // Increase game speed gradually
                if (this.score % 100 === 0) {
                    this.gameSpeed += 0.5;
                    this.gameArea.classList.add('speed-up');
                    setTimeout(() => {
                        this.gameArea.classList.remove('speed-up');
                    }, 300);
                }
            } else {
                fence.style.left = newLeft + 'px';
                
                // Collision detection
                if (this.checkCollision(fence)) {
                    this.gameOver();
                    return;
                }
            }
        });
        
        // Move stars
        this.stars.forEach((star, index) => {
            const currentLeft = parseInt(star.style.left);
            const newLeft = currentLeft - this.gameSpeed;
            
            if (newLeft < -30) {
                // Star missed
                star.remove();
                this.stars.splice(index, 1);
                this.combo = 0; // Reset combo if star is missed
            } else {
                star.style.left = newLeft + 'px';
                
                // Star collection
                if (this.checkStarCollection(star)) {
                    star.remove();
                    this.stars.splice(index, 1);
                    this.score += 25;
                    this.combo++;
                    this.createParticles(parseInt(star.style.left), 250, '#FFD700', 8);
                    this.updateUI();
                }
            }
        });
    }
    
    checkCollision(fence) {
        const sheepRect = this.sheep.getBoundingClientRect();
        const fenceRect = fence.getBoundingClientRect();
        
        // More precise collision detection
        const sheepBottom = this.isJumping ? sheepRect.bottom - 120 : sheepRect.bottom;
        
        return (
            sheepRect.left + 10 < fenceRect.right &&
            sheepRect.right - 10 > fenceRect.left &&
            sheepBottom > fenceRect.top + 5 &&
            sheepRect.top < fenceRect.bottom
        );
    }
    
    checkStarCollection(star) {
        const sheepRect = this.sheep.getBoundingClientRect();
        const starRect = star.getBoundingClientRect();
        
        return (
            sheepRect.left < starRect.right &&
            sheepRect.right > starRect.left &&
            sheepRect.bottom > starRect.top &&
            sheepRect.top < starRect.bottom
        );
    }
    
    gameOver() {
        this.isGameRunning = false;
        clearInterval(this.gameLoop);
        
        // Screen shake effect
        this.gameArea.classList.add('game-shake');
        setTimeout(() => {
            this.gameArea.classList.remove('game-shake');
        }, 500);
        
        // Check for new high score
        let isNewRecord = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('sheepJumpHighScore', this.highScore);
            this.highScoreElement.textContent = `Best: ${this.highScore}`;
            isNewRecord = true;
        }
        
        this.finalScoreElement.textContent = this.score;
        
        if (isNewRecord) {
            this.newRecordElement.classList.remove('hidden');
        } else {
            this.newRecordElement.classList.add('hidden');
        }
        
        this.gameOverScreen.classList.remove('hidden');
        
        // Clear all obstacles
        this.fences.forEach(fence => fence.remove());
        this.stars.forEach(star => star.remove());
        this.fences = [];
        this.stars = [];
    }
    
    restartGame() {
        this.startGame();
    }
}

// Start the game
const game = new SheepJumpGame();
