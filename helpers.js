function clearChaos() {
    for (const enemy of enemies) enemy.destroy();
    enemies = [];
    for (const proj of projectiles) proj.destroy();
    projectiles = [];
    for (const wspe of witchSpells) wspe.destroy();
    witchSpells = [];
}

function spawnWave(waveIndex) {
    // Determine base wave (1-based index wrapping over waves length)
    const baseIndex = ((waveIndex) % waves.length);
    const wave = waves[baseIndex];
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

    // Spawn base wave
    spawnAtList(wave.magicians || [], Magician);
    spawnAtList(wave.mages || [], Mage);
    spawnAtList(wave.sbires || [], Sbire);
    spawnAtList(wave.shooters || [], Shooter);
    spawnAtList(wave.wizards || [], Wizard);

    // Inject additional enemies based on 10-wave thresholds
    // waveIndex is 0-based in code; display is +1. Compute threshold using display index.
    const displayWaveNumber = waveIndex + 1;
    const threshold = Math.floor(displayWaveNumber / 10) * 10;
    console.log('> threshold', threshold);
    if (threshold >= 10 && addEnemies && addEnemies[threshold]) {
        const extra = addEnemies[threshold];
        console.log('>>>> extra', extra);
        spawnAtList(extra.magicians || [], Magician);
        spawnAtList(extra.mages || [], Mage);
        spawnAtList(extra.sbires || [], Sbire);
        spawnAtList(extra.shooters || [], Shooter);
        spawnAtList(extra.wizards || [], Wizard);
    }
}

// Reset game state
function launchGame() {
    music.play();
    player.health = 1;
    player.pos = vec2(16,8);

    if(score > bestScore) {
        bestScore = score;
        try { localStorage.setItem(BEST_KEY, String(bestScore)); } catch (e) {}
    }
    score = 0;
    gameOver = false;

    // Clear enemies, projectiles
    clearChaos();

    // Also clear the mouses
    for (const mouse of mouses) mouse.destroy();
    mouses = [];

    currentWaveIndex = 0;
    // First wave spawns immediately; clear any pending delay
    pendingNextWave = false;
    waveDelayFrames = 0;
    spawnWave(currentWaveIndex);

    // Create mouses
    for (let i = 0; i < 3; i++) {
        const mouse = new Mouse(vec2(randInt(2,30), randInt(2,14)));
        mouses.push(mouse);
    }
}