class TurningBullet extends Bullet {
    constructor(pos, direction, color, rotSpeed, scale) {
        super(pos, direction, color);
        this.direction = direction;
        this.rotSpeed = rotSpeed;
        this.scale = scale;
    }

    update() {
        // this.direction = this.direction.rotate(0.02);
        // this.velocity = this.direction.scale(0.05);

        // this.direction = this.direction.rotate(0.008);
        // this.velocity = this.direction.scale(0.025);

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