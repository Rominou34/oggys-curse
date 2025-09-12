/*
 * Mages shoot 16 bullets going outwards in every direction and rotating slowly.
 * Their pattern is easy to follow but they can quickly fill the map with spells
 * so their strength is in their number.
 * They shoot every 4 seconds, which gives a little bit of air to breathe
 */
class Mage extends Magician {
    constructor(pos) {
        super(pos);

        this.cooldown = 240;
        this.shootCooldown = 120;
        this.rotSpeed = 0.008;
        this.spellScale = 0.025;
        this.spellColor = hsl(0.2, 1, 0.8);
    }
}