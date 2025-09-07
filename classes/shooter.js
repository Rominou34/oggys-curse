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
            const projectile = new Bullet(this.pos, this.shootDirection, hsl(0,1,0.5));
            projectiles.push(projectile);
            this.shootCooldown = 5;
        } else {
            this.shootCooldown--;
        }
    }
}