/*
    Oggy's Curse
    Rominou34's entry for the js13k game jam (2025 edition)
*/

'use strict';

// show the LittleJS splash screen
setShowSplashScreen(false);

// fix texture bleeding by shrinking tile slightly
tileFixBleedScale = .5;

// sound effects
const sound_click = new Sound([1,.5]);

// game variables
let particleEmitter;
let player;
let witch;
let enemies = [];
let projectiles = [];
let mouses = [];
let score = 0;
let bestScore = 0;
let gameOver = false;

class Witch extends EngineObject {
    speed = 0.1;

    constructor(pos) {
        const witchTile = tile(1, 16); // Use tile 1 for witch
        super(pos, vec2(1, 1), witchTile, 0, hsl(0.7,0.8,0.6), 0);
        this.shootCooldown = 0;
    }

    update() {
        super.update();
        // Shoot enemies periodically
        if (this.shootCooldown <= 0) {
            // Shoot towards enemy
            if(enemies.length > 0) {
                const direction = enemies[randInt(0, enemies.length - 1)].pos.subtract(this.pos).normalize();
                const projectile = new Projectile(this.pos, direction, false);
                projectiles.push(projectile);
                this.shootCooldown = 90; // 1.5 seconds
            }
        } else {
            this.shootCooldown--;
        }
        if(this.pos.x >= 28) {
            this.speed = -0.1;
        }
        if(this.pos.x <= 2) {
            this.speed = 0.1;
        }
        this.pos.x += this.speed;
    }
}

class Player extends EngineObject {
    constructor(pos, size, tile, angle, color, renderOrder) {
        super(pos, size, tile, angle, color, renderOrder)
        this.speed = 0.1;
        this.health = 10;
    }

    move(direction) {
        this.pos = this.pos.add(direction.scale(this.speed));
        // Keep player within bounds
        this.pos.x = clamp(this.pos.x, 1, 31);
        this.pos.y = clamp(this.pos.y, 1, 15);
    }

    update() {
        super.update();
    }
}

class Mouse extends EngineObject {
    speed = 0.1;
    nextPos = vec2(0,0);
    direction = vec2(0,0);
    constructor(pos) {
        super(pos, vec2(1,1), tile(0,16), 0, hsl(0,0,0.8), 0);
        this.newDir();
    }

    newDir() {
        this.nextPos = vec2(randInt(2, 28), randInt(2, 14));
        this.direction = this.nextPos.subtract(this.pos).normalize();
    }

    update() {
        super.update();
        this.pos = this.pos.add(this.direction.scale(this.speed));
        if(this.pos.distance(this.nextPos) < 0.5) {
            this.newDir();
        }
    }
}

class Enemy extends EngineObject {
    constructor(pos) {
        const enemyTile = tile(2, 16); // Use tile 2 for enemy
        super(pos, vec2(1,1), enemyTile, 0, randColor(), 0);
        this.speed = 0.05;
        this.health = 50;
        this.shootCooldown = randInt(120, 240); // Random shoot interval
        this.target = player.pos;
    }

    update() {
        super.update();
        // Move towards player
        const direction = player.pos.subtract(this.pos).normalize();
        this.pos = this.pos.add(direction.scale(this.speed));

        // Shoot projectiles
        if (this.shootCooldown <= 0) {
            const projectile = new Projectile(this.pos, player.pos.subtract(this.pos).normalize(), false);
            projectiles.push(projectile);
            this.shootCooldown = randInt(120, 240);
        } else {
            this.shootCooldown--;
        }
    }
}

class Shooter extends EngineObject {
    constructor(pos) {
        const enemyTile = tile(2, 16); // Use tile 2 for enemy
        super(pos, vec2(1,1), enemyTile, 0, randColor(), 0);
        this.speed = 0.05;
        this.health = 50;
        this.shootCooldown = 5;
        this.target = player.pos;
        this.shootDirection = vec2(0,1);
        this.shootAngle = 0;
        this.shootMove = 0.02;
    }

    update() {
        super.update();
        this.shootAngle += this.shootMove;
        this.shootDirection = vec2(Math.cos(this.shootAngle), Math.abs(Math.sin(this.shootAngle)) * -1);

        // Shoot projectiles
        if (this.shootCooldown <= 0) {
            const projectile = new Bullet(this.pos, this.shootDirection);
            projectiles.push(projectile);
            this.shootCooldown = 5;
        } else {
            this.shootCooldown--;
        }
    }
}

class Projectile extends EngineObject {
    constructor(pos, direction) {
        const projTile = tile(1, 16);
        super(pos, vec2(0.5,0.5), projTile, 0, hsl(0,1,0.5), 0);
        this.velocity = direction.scale(0.2);
        this.lifetime = 300; // 5 seconds at 60fps
    }

    update() {
        super.update();
        this.pos = this.pos.add(this.velocity);
        this.lifetime--;
        if (this.lifetime <= 0) {
            this.destroy();
        }
    }
}

class Bullet extends EngineObject {
    constructor(pos, direction) {
        const projTile = tile(0, 16);
        super(pos, vec2(0.5,0.5), projTile, 0, hsl(0,1,0.5), 0);
        this.velocity = direction.scale(0.02);
        this.lifetime = 300; // 5 seconds at 60fps
    }

    update() {
        super.update();
        this.pos = this.pos.add(this.velocity);
        this.lifetime--;
        if (this.lifetime <= 0) {
            this.destroy();
        }
        if(this.pos.x >= 31 || this.pos.x <= 1 || this.pos.y >= 15 || this.pos.y <= 1) {
            this.destroy();
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    // Background layer
    const backgroundLayer = new TileLayer(vec2(0,0), vec2(48,32));
    for(let x = 0; x < 32; x++) {
        for (let y = 0; y < 16; y++) {
            const tileIndex = 1;
            const direction = 0;
            const mirror = false;
            const color = new Color(1, 0.5, 0.3, 1);
            const data = new TileLayerData(tileIndex, direction, mirror, color);
            backgroundLayer.setData(vec2(x,y), data);
            setTileCollisionData(vec2(x,y), 1);
        }
    }
    backgroundLayer.redraw();

    // create tile collision and visible tile layer
    initTileCollision(vec2(32,16));
    const pos = vec2();
    const tileLayer = new TileLayer(pos, tileCollisionSize);

    // get level data from the tiles image
    const tileImage = textureInfos[0].image;
    mainContext.drawImage(tileImage,0,0);
    const imageData = mainContext.getImageData(0,0,tileImage.width,tileImage.height).data;
    for (pos.x = tileCollisionSize.x; pos.x--;)
    for (pos.y = tileCollisionSize.y; pos.y--;)
    {
        // check if this pixel is set
        const i = pos.x + tileImage.width*(15 + tileCollisionSize.y - pos.y);
        if (!imageData[4*i])
            continue;
        
        // set tile data
        const tileIndex = 2;
        const direction = randInt(4)
        const mirror = !randInt(2);
        const color = randColor();
        const data = new TileLayerData(tileIndex, direction, mirror, color);
        tileLayer.setData(pos, data);
        setTileCollisionData(pos, 1);
    }

    // Adding walls all around the map
    for(let x = 0; x < 32; x++) {
        for(let y = 0; y < 16; y++) {
            if(x == 0 || x == 31 || y == 0 || y == 15) {
                const tileIndex = 1;
                const direction = 0;
                const mirror = false;
                const color = new Color(0.5, 0.25, 0.15, 1);
                const data = new TileLayerData(tileIndex, direction, mirror, color);
                const pos = vec2(x,y);
                tileLayer.setData(pos, data);
                setTileCollisionData(pos, 1);
            }
        }
    }

    // Create a player using tile 0
    const playerTile = tile(0, 16);
    player = new Player(vec2(16,8), vec2(1,1), playerTile, 0, hsl(0,0,0.2), 0);
    player.setCollision(true, true, true, true);

    // Create witch
    witch = new Witch(vec2(16,12));

    
    tileLayer.redraw();

    // setup camera
    cameraPos = vec2(16,8);
    cameraScale = 32;

    launchGame();
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    if (gameOver) {
        if(keyWasPressed('KeyR')) {
            launchGame();
        } else {
            return;
        }
    }

    if (mouseWasPressed(0))
    {
        // play sound when mouse is pressed
        sound_click.play(mousePos);
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

    // Update player
    player.update();

    // Update witch
    witch.update();

    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update();
        if (enemy.health <= 0) {
            enemy.destroy();
            enemies.splice(i, 1);
            score += 10;
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

    // Collision detection: projectiles hit player
    for (const proj of projectiles) {
        if (proj.pos.distance(player.pos) < 0.5) {
            console.log("Bullet hit player", proj);
            player.health -= 1;
            proj.destroy();
            projectiles.splice(projectiles.indexOf(proj), 1);
            break;
        }
    }

    // Collision detection : player eats mouse
    for (const mouse of mouses) {
        if (mouse.pos.distance(player.pos) < 1) {
            console.log("Player ate mouse", mouse);
            score += 1;
            mouse.destroy();
            mouses.splice(mouses.indexOf(mouse), 1);
            break;
        }
    }

    // Check game over
    if (player.health <= 0) {
        gameOver = true;
    }

    // Spawn new mouses occasionally
    if (rand() < 0.01) {
        const mouse = new Mouse(vec2(randInt(2,30), randInt(2,14)));
        mouses.push(mouse);
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

    for (let i = 0; i < 3; i++) {
        const enemyPos = vec2(randInt(2,30), randInt(2,14));
        const enemy = new Shooter(enemyPos);
        enemies.push(enemy);
    }

    // Create mouses
    for (let i = 0; i < 3; i++) {
        const mouse = new Mouse(vec2(randInt(2,30), randInt(2,14)));
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
    // draw to overlay canvas for hud rendering
    drawTextScreen(`Health: ${player.health} | Score: ${score} | Best : ${bestScore}`,
        vec2(mainCanvasSize.x/2, 70), 40,   // position, size
        hsl(0,0,1), 4, hsl(0,0,0));         // color, outline size and color

    if (gameOver) {
        drawTextScreen('Game Over! Press R to Restart',
            vec2(mainCanvasSize.x/2, mainCanvasSize.y/2), 60,
            hsl(0,1,0.5), 6, hsl(0,0,0));
    }
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['tiles.png']);