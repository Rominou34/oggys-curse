/**
 * Sbires are the first enemies the player will encounter, they don't have
 * patterns like the others, they just shoot waves of spells in a cone in the
 * direction of the witch
 */
class Sbire extends EngineObject {
    constructor(pos) {
        // @TODO - Create sbire sprite (tile 9)
        const enemyTile = tile(2, 16); // Use tile 2 for enemy
        super(pos, characterSize, enemyTile, 0, hsl(0,0,1), 0);
        this.speed = 0.05;
        this.health = 1;
        this.shootCooldown = 120;
        this.target = player.pos;
        this.coneWidth = PI/6; // 30 degrees cone
        this.angleStep = PI/24;
    }

    update() {
        super.update();
        this.shootAngle += this.shootMove;
        // The initial shooting direction is thw tich
        const direction = witch.pos.subtract(this.pos).normalize();

        // Shoot projectiles
        if (this.shootCooldown <= 0) {
            const endAngle = this.coneWidth / 2;
            const startAngle = endAngle * -1;

            // For each bullet we add a little deviation from the shooting
            // direction in order to create a cone
            for(let i = startAngle; i < endAngle; i += this.angleStep) {
                const newDirection = direction.rotate(i).normalize();
                const projectile = new Bullet(this.pos, newDirection, hsl(0.4,1,0.5), 1);
                projectiles.push(projectile);
            }
            this.shootCooldown = 300;
        } else {
            this.shootCooldown--;
        }
    }
}