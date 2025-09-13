class TurningBullet extends Bullet {
    constructor(pos, direction, color, rotSpeed, scale, lifetime) {
        super(pos, direction, color, 0);
        this.direction = direction;
        this.rotSpeed = rotSpeed;
        this.scale = scale;
        this.lifetime = lifetime;
    }

    update() {
        this.direction = this.direction.rotate(this.rotSpeed);
        this.velocity = this.direction.scale(this.scale);

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