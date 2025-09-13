/*
 * Magicians are the biggest enemies, shooting a lot of spells in all direction.
 * This class is herited by the Mage and Magicians, which also shoot a lot of spells, but
 * with different patterns. In order to save space the main logic is here,
 * with some variables overridden by the child classes
 */
class Magician extends EngineObject {
    constructor(pos, tileIndex = 5) {
        // Use tile 5 by default for magician
        const enemyTile = tile(tileIndex, 16);
        super(pos, vec2(1.5,1.5), enemyTile, 0, hsl(0,0,1), 0);
        this.speed = 0.05;
        this.health = 2;
        this.shootCooldown = 240;
        this.target = player.pos;
        this.shootDirection = vec2(0,1);

        // Overridden settings
        this.cooldown = 240; // Shoot cooldown (2 sec)
        this.rotSpeed = 0; // Rotation speed of the turning spells
        this.spellScale = 0; // Scale of the veelocity vector of the spells (their speed)
        this.angleStep = PI/8; // The angle between each spell (smaller : more spells)
        this.spellColor = hsl(0, 1, 0.8);
        this.bulletTile = 0; // Tile index (16 + this value);
        this.bulletSpeed = 0.02;
        this.bulletDuration = 300;
    }

    update() {
        super.update();

        // Shoot projectiles
        if (this.shootCooldown <= 0) {
            for(let i = 0; i < 2*PI; i += this.angleStep) {
                let shootDirection = vec2(Math.cos(i), Math.sin(i));
                let projectile = null;
                if(this.rotSpeed != 0) {
                    projectile = new TurningBullet(this.pos, shootDirection, this.spellColor, this.rotSpeed, this.spellScale, this.bulletDuration);
                } else {
                    projectile = new Bullet(this.pos, shootDirection, this.spellColor, this.bulletTile, this.bulletSpeed);
                }
                projectiles.push(projectile);
            }
            this.shootCooldown = this.cooldown;
        } else {
            this.shootCooldown--;
        }
    }
}