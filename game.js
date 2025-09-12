/*
    Oggy's Curse
    Rominou34's entry for the js13k game jam (2025 edition)
*/

'use strict';

// show the LittleJS splash screen
setShowSplashScreen(false);

// fix texture bleeding by shrinking tile slightly
tileFixBleedScale = .5;


///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    // Background layer
    const backgroundLayer = new TileLayer(vec2(0,0), vec2(screen_width, screen_height));
    for(let x = 0; x < screen_width; x++) {
        for (let y = 0; y < screen_height; y++) {
            const tileIndex = 0;
            const direction = 0;
            const mirror = false;
            const color = new Color(1, 1, 1, 1);
            const data = new TileLayerData(tileIndex, direction, mirror, color);
            backgroundLayer.setData(vec2(x,y), data);
            setTileCollisionData(vec2(x,y), 1);
        }
    }
    backgroundLayer.redraw();

    // create tile collision and visible tile layer
    initTileCollision(vec2(screen_width, screen_height));
    const pos = vec2();
    const tileLayer = new TileLayer(pos, tileCollisionSize);

    // get level data from the tiles image
    // const tileImage = textureInfos[0].image;
    // mainContext.drawImage(tileImage,0,0);
    // const imageData = mainContext.getImageData(0,0,tileImage.width,tileImage.height).data;
    // for (pos.x = tileCollisionSize.x; pos.x--;)
    // for (pos.y = tileCollisionSize.y; pos.y--;)
    // {
    //     // check if this pixel is set
    //     const i = pos.x + tileImage.width*(15 + tileCollisionSize.y - pos.y);
    //     if (!imageData[4*i])
    //         continue;
        
    //     // set tile data
    //     const tileIndex = 0;
    //     const direction = randInt(4)
    //     const mirror = !randInt(2);
    //     const color = randColor();
    //     const data = new TileLayerData(tileIndex, direction, mirror, color);
    //     tileLayer.setData(pos, data);
    //     setTileCollisionData(pos, 1);
    // }

    // Adding walls all around the map
    for(let x = 0; x < screen_width; x++) {
        for(let y = 0; y < screen_height; y++) {
            if(x == 0 || x == (screen_width - 1) || y == 0 || y == (screen_height - 1)) {
                const tileIndex = 1;
                const direction = 0;
                const mirror = false;
                const color = new Color(1, 1, 1, 1);
                const data = new TileLayerData(tileIndex, direction, mirror, color);
                const pos = vec2(x,y);
                tileLayer.setData(pos, data);
                setTileCollisionData(pos, 1);
            }
        }
    }

    // Create a player using tile 0
    const playerTile = tile(2, 16);
    player = new Player(vec2(16,8), vec2(1,1), playerTile, 0, hsl(0,0,0.2), 0);
    player.setCollision(true, true, true, true);

    // Create witch
    witch = new Witch(vec2(16,12));


    tileLayer.redraw();

    // Load best score from localStorage (persisted between sessions)
    try {
        const savedBest = localStorage.getItem(BEST_KEY);
        if (savedBest !== null) {
            bestScore = Number(savedBest) || 0;
        }
    } catch (e) {}

    // setup camera
    cameraPos = vec2(screen_width / 2, screen_height / 2);
    cameraScale = 32;
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    if (gameOver) {
        if(keyWasPressed('KeyR')) {
            launchGame();
        }
        if(keyWasPressed('KeyM')) {
            inMenu = true;
            gameOver = false;
        }
        return;
    } else if (inMenu) {
        // Handle mode selection from menu
        // Keyboard shortcuts
        if (keyWasPressed('KeyW')) {
            gameMode = 'wave';
            inMenu = false;
            launchGame();
        }
        if (keyWasPressed('KeyR')) {
            gameMode = 'random';
            inMenu = false;
            launchGame();
        }

        // Mouse click on on-screen buttons
        if (mouseWasPressed(0)) {
            // Convert world mouse to screen coordinates
            const mouseScreen = mousePos.subtract(cameraPos).scale(cameraScale).add(vec2(mainCanvasSize.x/2, mainCanvasSize.y/2));

            // Button bounds (computed to match draw positions in gameRenderPost)
            const btnSize = 40;
            const makeBounds = (center, text) => {
                const estimatedWidth = text.length * btnSize * 0.6;
                const halfW = estimatedWidth / 2;
                const halfH = btnSize * 0.7 / 2;
                return { x0: center.x - halfW, y0: center.y - halfH, x1: center.x + halfW, y1: center.y + halfH };
            };
            const waveCenter = vec2(mainCanvasSize.x/2 - 120, mainCanvasSize.y/2 + 20);
            const randomCenter = vec2(mainCanvasSize.x/2 + 120, mainCanvasSize.y/2 + 20);
            const waveBounds = makeBounds(waveCenter, 'Wave Mode');
            const randomBounds = makeBounds(randomCenter, 'Random Mode');

            const inside = (p, b) => p.x >= b.x0 && p.x <= b.x1 && p.y >= b.y0 && p.y <= b.y1;
            if (inside(mouseScreen, waveBounds)) {
                gameMode = 'wave';
                inMenu = false;
                launchGame();
            } else if (inside(mouseScreen, randomBounds)) {
                gameMode = 'random';
                inMenu = false;
                launchGame();
            }
        }
        return;
    }

    if (mouseWheel)
    {
        // zoom in and out with mouse wheel
        cameraScale -= sign(mouseWheel)*cameraScale/5;
        cameraScale = clamp(cameraScale, 10, 300);
    }

    // Move the player using the arrow keys
    if (keyIsDown('ArrowUp')) {
        player.move(vec2(0,1));
    }
    if (keyIsDown('ArrowDown')) {
        player.move(vec2(0,-1));
    }
    if (keyIsDown('ArrowLeft')) {
        player.move(vec2(-1,0));
    }
    if (keyIsDown('ArrowRight')) {
        player.move(vec2(1,0));
    }

    // Wave progression with delay: when all enemies are cleared, start a countdown before the next wave
    if (!inMenu && !gameOver && gameMode === 'wave') {
        if (enemies.length === 0) {
            if (!pendingNextWave) {
                pendingNextWave = true;
                waveDelayFrames = 120; // 2 seconds at 60fps
            } else if (waveDelayFrames > 0) {
                waveDelayFrames--;
            } else {
                pendingNextWave = false;
                currentWaveIndex++;
                spawnWave(currentWaveIndex);
            }
        } else {
            // If enemies appear again (e.g., mid-wave), cancel pending
            pendingNextWave = false;
        }
    }

    // Update projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const proj = projectiles[i];
        proj.update();
        if (proj.lifetime <= 0) {
            proj.destroy();
            projectiles.splice(i, 1);
        }
    }

    // Update witch spells
    for (let i = witchSpells.length - 1; i >= 0; i--) {
        const wspe = witchSpells[i];
        wspe.update();
        if (wspe.lifetime <= 0) {
            wspe.destroy();
            witchSpells.splice(i, 1);
        }
    }

    // Collision detection: projectiles hit player (with invincibility window)
    for (const proj of projectiles) {
        if (proj.pos.distance(player.pos) < 0.5) {
            console.log("Bullet hit player", proj);
            const tookDamage = player.takeDamage(1);
            proj.destroy();
            projectiles.splice(projectiles.indexOf(proj), 1);
            break;
        }
    }

    // Collision detection: witch spells hit enemies or the player
    for (const wspe of witchSpells) {
        if (wspe.pos.distance(player.pos) < 0.5) {
            console.log("Witch spell hit player", wspe);
            const tookDamage = player.takeDamage(2);
            wspe.destroy();
            witchSpells.splice(witchSpells.indexOf(wspe), 1);
            break;
        }

        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (wspe.pos.distance(enemy.pos) < 0.5) {
                console.log("Witch spell hit enemy", wspe);
                enemy.health -= 1;
                wspe.destroy();
                witchSpells.splice(witchSpells.indexOf(wspe), 1);
            }
            if (enemy.health <= 0) {
                enemy.destroy();
                enemies.splice(i, 1);
            }
        }
    }

    // Collision detection : player eats mouse
    for (const mouse of mouses) {
        if (mouse.pos.distance(player.pos) < 1) {
            console.log("Player ate mouse", mouse);
            score += 1;
            mouse.destroy();
            mouses.splice(mouses.indexOf(mouse), 1);

            player.eatMouse();
            break;
        }
    }

    // Update player
    player.update();

    // Update witch
    witch.update();

    // Update enemies
    for (const enemy of enemies) {
        enemy.update();
    }

    // Check game over
    if (player.health <= 0) {
        gameOver = true;
    }

    // Spawn new mouses occasionally
    if (rand() < 0.01) {
        const mouse = new Mouse(vec2(randInt(2, screen_width - 1), randInt(2, screen_height - 2)));
        mouses.push(mouse);
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{

}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    if (inMenu) {
        drawTextScreen('Oggy\'s Curse',
            vec2(mainCanvasSize.x/2, mainCanvasSize.y/2 - 70), 60,
            hsl(0,0,1));

        // Instruction
        drawTextScreen('Select a Mode:',
            vec2(mainCanvasSize.x/2, mainCanvasSize.y/2), 40,
            hsl(0,0,1));

        // Buttons as clickable text
        drawTextScreen('Wave Mode (W)',
            vec2(mainCanvasSize.x/2, mainCanvasSize.y/2 + 60), 40,
            hsl(0.6,0.8,0.8));
        drawTextScreen('Random Mode (R)',
            vec2(mainCanvasSize.x/2, mainCanvasSize.y/2 + 100), 40,
            hsl(0.1,0.8,0.8));
    } else if (!gameOver) {
        // draw to overlay canvas for hud rendering
        let waveInfo = gameMode == 'random' ? '' : ` | Wave : ${currentWaveIndex + 1}`;
        drawTextScreen(`Score: ${score} | Best : ${bestScore}${waveInfo}`,
            vec2(mainCanvasSize.x/2, 70), 40,   // position, size
            hsl(0,0,1));         // color, outline size and color

        // draw to overlay canvas for hud rendering
        drawTextScreen(`HP : ${player.health}🤍 | Heal : ${player.heal}`,
            vec2(mainCanvasSize.x / 2, 120), 40,   // position, size
            hsl(0,0,1));         // color, outline size and color
    }

    if (gameOver) {
        drawTextScreen('Game Over! Press R to Restart | M for Menu',
            vec2(mainCanvasSize.x/2, mainCanvasSize.y/2), 60,
            hsl(0,1,0.5), 6, hsl(0,0,0));
    }
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['tiles.png']);