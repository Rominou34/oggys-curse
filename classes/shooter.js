class Shooter extends EngineObject {
    constructor(pos) {
        // Use tile 2 for enemy
        const enemyTile = tile(8, 16);
        super(pos, characterSize, enemyTile, 0, hsl(0,0,1), 0);
        this.speed = 0.05;
        this.health = 1;
        this.shootCooldown = 10;
        this.target = player.pos;
        this.shootDirection = vec2(0,1);
        this.shootAngle = 0;
    }

    update() {
        super.update();

        // Shoot projectiles
        if (this.shootCooldown <= 0) {
            this.shootDirection = vec2(Math.cos(this.shootAngle), Math.abs(Math.sin(this.shootAngle)) * -1);
            const projectile = new Bullet(this.pos, this.shootDirection, new Color(0.2,0.5,1,1), 0, 0.005, 3000);
            projectiles.push(projectile);

            this.shootCooldown = 10;
            this.shootAngle += PI/10;
        } else {
            this.shootCooldown--;
        }
    }
}