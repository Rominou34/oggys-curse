class Witch extends EngineObject {
	constructor(pos) {
		const witchTile = tile(4, 16); // Use tile 4 for witch
		super(pos, characterSize, witchTile, 0, hsl(0,0,1), 0);

		// Movement steps across the bottom
		this.stepPositionsX = [4, 12, Math.floor(screen_width/2), screen_width - 12, screen_width - 4];
		this.stepY = 2;
		this.stepIndex = 0;
		this.stepDir = 1; // direction : 1 forward, -1 backward
		this.moveSpeed = 0.1; // tiles per frame
		this.targetX = this.stepPositionsX[this.stepIndex];
		this.waitTimer = 0; // frames remaining to wait at a step
		this.shootCooldown = 0; // frames until next spell while waiting
		this.spellsCastThisStop = 0; // limit to 2 per stop

		// Snap start position to the first step at bottom
		this.pos.x = this.targetX;
		this.pos.y = this.stepY;
	}

	update() {
		super.update();

		// If we are waiting at a step, cast up to 2 spells with 120 frame cooldown
		if (this.waitTimer > 0) {
			if (this.shootCooldown > 0) {
				this.shootCooldown--;
			}
			if (this.spellsCastThisStop < 2 && this.shootCooldown <= 0 && enemies.length > 0) {
				const target = enemies[0];
				if (target) {
					const direction = target.pos.subtract(this.pos).normalize();
					const witchSpell = new WitchSpell(this.pos, direction);
					witchSpells.push(witchSpell);
					this.spellsCastThisStop++;
					this.shootCooldown = 240;
				}
			}
			this.waitTimer--;
			// When finished waiting, pick the next step and begin moving
			if (this.waitTimer <= 0) {
				// Bounce between ends: 0 1 2 3 4 3 2 1 0 ...
				if (this.stepIndex === this.stepPositionsX.length - 1) this.stepDir = -1;
				else if (this.stepIndex === 0) this.stepDir = 1;
				this.stepIndex += this.stepDir;
				this.targetX = this.stepPositionsX[this.stepIndex];
			}
			return;
		}

		// If not waiting, move towards target step
		const dx = this.targetX - this.pos.x;
		if (Math.abs(dx) > this.moveSpeed) {
			this.pos.x += Math.sign(dx) * this.moveSpeed;
		} else {
			// Arrived at step, snap and start waiting period
			this.pos.x = this.targetX;
			this.pos.y = this.stepY;
			this.waitTimer = 240;
			this.shootCooldown = 120;
			this.spellsCastThisStop = 0;
		}
	}
}