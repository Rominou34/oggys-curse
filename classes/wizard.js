// class Magician extends EngineObject {
//     constructor(pos) {
//         const enemyTile = tile(2, 16); // Use tile 2 for enemy
//         super(pos, vec2(1,1), enemyTile, 0, randColor(), 0);
//         this.speed = 0.05;
//         this.health = 50;
//         this.shootCooldown = 300;
//         this.target = player.pos;
//         this.shootDirection = vec2(0,1);
//     }

//     update() {
//         super.update();

//         // Shoot projectiles
//         if (this.shootCooldown <= 0) {
//             for(let i = 0; i < 2*PI; i += PI/8) {
//                 let shootDirection = vec2(Math.cos(i), Math.sin(i));
//                 const projectile = new TurningBullet(this.pos, shootDirection, hsl(0.6,1,0.8), 0.02, 0.05);
//                 projectiles.push(projectile);
//             }
//             this.shootCooldown = 300;
//         } else {
//             this.shootCooldown--;
//         }
//     }
// }

/*
 * Wizards shoot 16 bullets going outwards while rotating clockwise for ~2.5 seconds,
 * and then coming back to the magician, for a total duration of 5 seconds.
 * They shoot every 8 seconds so the player has a little bit of rest between each round
 */
class Wizard extends Magician {
    constructor(pos) {
        super(pos);

        this.shootCooldown = 120;
        this.cooldown = 480;
        this.rotSpeed = 0.02;
        this.spellScale = 0.05;
        this.spellColor = hsl(0.6, 1, 0.8);
    }
}