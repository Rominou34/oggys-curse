class Bullet extends EngineObject {
    constructor(pos, direction, color, tileIndex = 0, velocity = 0.02, lifetime = 300) {
        const projTile = tile(16 + tileIndex, 16);
        super(pos, vec2(0.5,0.5), projTile, 0, color, 0);
        this.velocity = direction.scale(velocity);
        this.lifetime = lifetime;
    }

    update() {
        super.update();
        this.pos = this.pos.add(this.velocity);
        this.lifetime--;
        if (this.lifetime <= 0) {
            this.destroy();
        }
        if(this.pos.x >= (screen_width - 1) || this.pos.x <= 1 || this.pos.y >= (screen_height - 1) || this.pos.y <= 1) {
            this.destroy();
        }
    }
}