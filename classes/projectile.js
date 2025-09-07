class Projectile extends EngineObject {
    constructor(pos, direction) {
        const projTile = tile(1, 16);
        super(pos, vec2(0.5,0.5), projTile, 0, hsl(0,1,0.5), 0);
        this.velocity = direction.scale(0.2);
        this.lifetime = 300; // 5 seconds at 60fps
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