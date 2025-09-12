class Mouse extends EngineObject {
    speed = 0.1;
    nextPos = vec2(0,0);
    direction = vec2(0,0);
    constructor(pos) {
        super(pos, vec2(1,1), tile(3,16), 0, hsl(0,0,0.8), 0);
        this.newDir();
    }

    newDir() {
        this.nextPos = vec2(randInt(2, screen_width - 2), randInt(2, screen_height - 2));
        this.direction = this.nextPos.subtract(this.pos).normalize();
    }

    update() {
        super.update();
        this.pos = this.pos.add(this.direction.scale(this.speed));
        if(this.pos.distance(this.nextPos) < 0.5) {
            this.newDir();
        }
    }
}