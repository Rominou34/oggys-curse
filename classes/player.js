class Player extends EngineObject {
    constructor(pos, size, tile, angle, color, renderOrder) {
        super(pos, size, tile, angle, color, renderOrder)
        this.speed = 0.1;
        this.health = 10;
    }

    move(direction) {
        this.pos = this.pos.add(direction.scale(this.speed));
        // Keep player within bounds
        this.pos.x = clamp(this.pos.x, 1, 31);
        this.pos.y = clamp(this.pos.y, 1, 15);
    }

    update() {
        super.update();
    }
}