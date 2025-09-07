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
            const projectile = new Projectile(this.pos, player.pos.subtract(this.pos).normalize());
            projectiles.push(projectile);
            this.shootCooldown = randInt(120, 240);
        } else {
            this.shootCooldown--;
        }
    }
}