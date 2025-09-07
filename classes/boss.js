class Boss extends EngineObject {
    constructor(pos) {
        const enemyTile = tile(2, 16); // Use tile 2 for enemy
        super(pos, vec2(1,1), enemyTile, 0, randColor(), 0);
        this.speed = 0.05;
        this.health = 50;
        this.shootCooldown = 120;
        this.target = player.pos;
        this.shootDirection = vec2(0,1);
    }

    update() {
        super.update();

        // Shoot projectiles
        if (this.shootCooldown <= 0) {
            for(let i = 0; i < 2*PI; i += 0.2) {
                let shootDirection = vec2(Math.cos(i), Math.sin(i));
                const projectile = new Bullet(this.pos, shootDirection, hsl(0,1,0.8));
                projectiles.push(projectile);
            }
            this.shootCooldown = 120;
        } else {
            this.shootCooldown--;
        }
    }
}