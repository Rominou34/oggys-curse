class Bullet extends EngineObject {
    constructor(pos, direction) {
        const projTile = tile(0, 16);
        super(pos, vec2(0.5,0.5), projTile, 0, hsl(0,1,0.5), 0);
        this.velocity = direction.scale(0.02);
        this.lifetime = 300; // 5 seconds at 60fps
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