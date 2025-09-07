function spawnEnemies(type, qty) {
    for(let i = 0; i < qty; i++) {
        const enemy = new type(vec2(randInt(2,screen_width - 2), randInt(2,screen_height - 2)));
        enemies.push(enemy);
    }
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
    // Clear enemies and projectiles
    for (const enemy of enemies) enemy.destroy();
    enemies = [];
    for (const proj of projectiles) proj.destroy();
    projectiles = [];
    for (const mouse of mouses) mouse.destroy();
    mouses = [];

    spawnEnemies(Shooter, 3);

    spawnEnemies(Boss, 5);

    // Create mouses
    for (let i = 0; i < 3; i++) {
        const mouse = new Mouse(vec2(randInt(2,30), randInt(2,14)));
        mouses.push(mouse);
    }
}