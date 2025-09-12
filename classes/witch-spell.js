class WitchSpell extends EngineObject {
    constructor(pos, direction) {
        // Tile : 5th tile on the spells line
        const projTile = tile(20, 16);
        super(pos, vec2(1,1), projTile, 0, hsl(0,0,1), 0);
        this.velocity = direction.scale(0.05);
        this.lifetime = 600;
    }

    update() {
        super.update();
        this.pos = this.pos.add(this.velocity);
        this.lifetime--;
        if (this.lifetime <= 0) {
            this.destroy();
        }
    }
}