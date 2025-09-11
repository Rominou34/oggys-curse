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
                const witchSpell = new WitchSpell(this.pos, direction);
                witchSpells.push(witchSpell);
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