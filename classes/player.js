class Player extends EngineObject {
    constructor(pos, size, tile, angle, color, renderOrder) {
        super(pos, size, tile, angle, color, renderOrder)
        this.speed = 0.1;
        this.health = 10;
        // Gain 1 HP after having eaten 3 mice
        this.heal = 0;
		// Invincibility frames after taking damage
		this.invincibleTimer = 0; // frames remaining invincible
		this.blinkTick = 0; // for visual blinking
		// Store base color to restore after blinking
		this.baseColor = new Color(this.color.r, this.color.g, this.color.b, this.color.a);
    }

    move(direction) {
        this.pos = this.pos.add(direction.scale(this.speed));
        // Keep player within bounds
        this.pos.x = clamp(this.pos.x, 1, 31);
        this.pos.y = clamp(this.pos.y, 1, 15);
    }

    update() {
        super.update();
		// Handle invincibility countdown and blinking visual
		if (this.invincibleTimer > 0) {
			this.invincibleTimer--;
            // Toggle twice per 12 frames, so it blinks 5 times per second
			this.blinkTick = (this.blinkTick + 1) % 12;
			const alpha = this.blinkTick < 6 ? 0.2 : 1;
			this.color = new Color(this.baseColor.r, this.baseColor.g, this.baseColor.b, alpha);
			if (this.invincibleTimer <= 0) {
				// Restore base color when invincibility ends
				this.color = new Color(this.baseColor.r, this.baseColor.g, this.baseColor.b, this.baseColor.a);
				this.blinkTick = 0;
			}
		}
    }

	// Apply damage if not currently invincible, and starts the 2 seconds of
    // invincibility. Returns true if damage applied
	takeDamage(amount) {
		if (this.invincibleTimer > 0)
			return false;
		this.health -= amount;
		this.invincibleTimer = 120;
        this.heal = 0;
		return true;
	}
}