class Player extends EngineObject {
    constructor(pos) {
		const playerTile = tile(2, 16); // Use tile 2 for player
        super(pos, vec2(1, 1), playerTile, 0, hsl(0,0,1), 0);

        this.speed = 0.12;
        this.health = 10;
        // Gain 1 HP after having eaten 3 mice
        this.heal = 0;
		// Invincibility frames after taking damage
		this.invincibleTimer = 0; // frames remaining invincible
		this.blinkTick = 0; // for visual blinking
		// Store base color to restore after blinking
		this.baseColor = new Color(this.color.r, this.color.g, this.color.b, this.color.a);

        // Sound
        this.damageSound = new Sound([2.1,,191,.08,.04,,3,3,5,,,,,.5,5,.3,.13,.48]);
        this.eatingSound = new Sound([,,539,,.06,.2,1,2,,,500,.04,.02,,,,.04]);
        this.healingSound = new Sound([,0,847,,.3,.5,1,,,,-800,.05,.01,,,,.1]);
    }

    move(direction) {
        this.pos = this.pos.add(direction.scale(this.speed));
        // Keep player within bounds
        this.pos.x = clamp(this.pos.x, 1, screen_width - 1);
        this.pos.y = clamp(this.pos.y, 1, screen_height - 1);
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

        this.damageSound.play();
        // zzfx(...[2.1,,191,.03,.08,,3,3,5,,,,,.5,14,.3,.13,.48]);

		return true;
	}

    eatMouse() {
        // Sound effect of mouse eating
        // zzfx(...[,,539,,.06,.2,1,2,,,500,.04,.02,,,,.04]);
        // zzfx(...[,,353,.02,.02,,,2.5,-10,-5,,,,,,.1,,.64,.08,,298]);

        // If we are not full health we gain back 1 hp every 5 mice
        if(this.health < 10) {
            this.heal++;
        }
        if(this.heal >= 5) {
            this.health++;
            this.heal = 0;
            this.healingSound.play();
        } else {
            this.eatingSound.play();
        }
    }
}