function spawnEnemies(type, qty) {
    for(let i = 0; i < qty; i++) {
        const enemy = new type(vec2(randInt(2,screen_width - 2), randInt(2,screen_height - 2)));
        enemies.push(enemy);
    }
}

function clearChaos() {
    for (const enemy of enemies) enemy.destroy();
    enemies = [];
    for (const proj of projectiles) proj.destroy();
    projectiles = [];
    for (const wspe of witchSpells) wspe.destroy();
    witchSpells = [];
}

function spawnWave(waveIndex) {
    const wave = waves[waveIndex % waves.length];
    if (!wave) return;

    // Clear any remaining enemies/projectiles before spawning new wave
    clearChaos();

    const spawnAtList = (list, Type) => {
        if (!list) return;
        for (const [x, y] of list) {
            const clampedX = clamp(x, 2, screen_width - 2);
            const clampedY = clamp(y, 2, screen_height - 2);
            const enemy = new Type(vec2(clampedX, clampedY));
            enemies.push(enemy);
        }
    };

    spawnAtList(wave.magicians, Magician);
    spawnAtList(wave.mages, Mage);
    spawnAtList(wave.shooters, Shooter);
    spawnAtList(wave.wizards, Wizard);
}

// Reset game state
function launchGame() {
    player.health = 10;
    player.pos = vec2(16,8);

    if(score > bestScore) {
        bestScore = score;
    }
    score = 0;
    gameOver = false;

    // Clear enemies, projectiles
    clearChaos();

    // Also clear the mouses
    for (const mouse of mouses) mouse.destroy();
    mouses = [];

    if (gameMode === 'random') {
        // Random mode, preserve original behavior
        spawnEnemies(Shooter, 3);
        spawnEnemies(Magician, 5);
        spawnEnemies(Wizard, 2);
        spawnEnemies(Mage, 2);
    } else {
        // Wave mode
        currentWaveIndex = 0;
        spawnWave(currentWaveIndex);
    }

    // Create mouses
    for (let i = 0; i < 3; i++) {
        const mouse = new Mouse(vec2(randInt(2,30), randInt(2,14)));
        mouses.push(mouse);
    }
}