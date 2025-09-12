/*
 * Wizards shoot 16 bullets going outwards while rotating clockwise for ~2.5 seconds,
 * and then coming back to the magician, for a total duration of 5 seconds.
 * They shoot every 8 seconds so the player has a little bit of rest between each round
 */
class Wizard extends Magician {
    constructor(pos) {
        super(pos, 6);

        this.shootCooldown = 120;
        this.cooldown = 480;
        this.rotSpeed = 0.02;
        this.spellScale = 0.05;
        this.spellColor = hsl(0.6, 1, 0.8);
        this.bulletTile = 2;
    }
}