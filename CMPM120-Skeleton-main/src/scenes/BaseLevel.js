export class BaseLevel extends Phaser.Scene {
    // To edit the maps, go to Maps and open lvl1.tmx or lvl2.tmx. I made an example lvls just for test. You can delete or build on it
    constructor(key, mapName) {
        super(key);
        this.mapName = mapName;
    }

    preload() {
        // -----------------------------PRE LOAD lvl1, lvl2 tmj files and assets-----------------------------------
        this.load.tilemapTiledJSON(this.mapName, `Maps/${this.mapName}.tmj`);
        this.load.image('animations', 'assets/animations.png');
        this.load.image('insideSheet1', 'assets/insideSheet1.png');
        this.load.image('outsideSheet1', 'assets/outsideSheet1.png');
        this.load.image('Knight_1', 'assets/Knight_1.png');
        this.load.image('Knight_2', 'assets/Knight_2.png');
        this.load.image('NPC_1', 'assets/NPC_1.png');
        this.load.image('NPC_2', 'assets/NPC_2.png');
        this.load.image('NPC_3', 'assets/NPC_3.png');
        this.load.image('NPC_4', 'assets/NPC_4.png');
        this.load.image('attackLine1', 'assets/attackLine1.png');
        this.load.image('attackLine2', 'assets/attackLine2.png');
        this.load.image('attackLine3', 'assets/attackLine3.png');

        // this.load.image('outsideSheet1', 'assets/.png');
        this.load.spritesheet('player', 'assets/playerSheets.png', { frameWidth: 16 });
    }

    create() {
        this.animTimer = 0; // For animated tiles
        this.animFrameDuration = 240; // How fast tiles animates
        this.last_time = 0;

        this.makeTilemap();
        this.setKeyboards();
        this.setUpPlayer();
        this.setCamera(3);
        this.setUpNPCs();
    }

    update(time, delta) {
        let dt = (time - this.last_time) / 1000;
        this.last_time = time;
        this.updateAnimatedTiles(delta);
        this.setAnimation();
        if (this.time.now < this.lastDamageTime + this.damageCoolDown) {
            this.player.play('idle', true);
            return;
        } else {
            this.setPlayerMovement(50);
        }
        this.setPlayerMovement(50);
        this.setInteractionArea();

        // console.log(parseInt(this.player.x) + ', '+ parseInt(this.player.y));
        console.log("Health: " + this.player.health + "\nCoins: " + this.player.coins + "\nHearts: " + this.player.health);
        // console.log(this.player.body.velocity.x, this.player.body.velocity.y)
    }

    makeTilemap() {
        this.map = this.add.tilemap(this.mapName);

        const tsInside = this.map.addTilesetImage('insideSheet1', 'insideSheet1');
        const tsOutside = this.map.addTilesetImage('outsideSheet1', 'outsideSheet1');
        const tsAn = this.map.addTilesetImage('animations', 'animations');

        // No collision, only visuals
        this.map.createLayer("background", [tsInside, tsOutside, tsAn], 0, 0);
        this.map.createLayer("decorationC", [tsInside, tsOutside, tsAn], 0, 0);
        this.obstaclesLayer = this.map.createLayer("obstacles", [tsInside, tsOutside, tsAn], 0, 0);
        this.map.createLayer("decorationB", [tsInside, tsOutside, tsAn], 0, 0);
        this.damageLayer = this.map.createLayer("damageLayer", [tsInside, tsOutside, tsAn], 0, 0);
        this.map.createLayer("decorationA", [tsInside, tsOutside, tsAn], 0, 0);
        this.collectablesLayer = this.map.createLayer("collectables", [tsInside, tsOutside, tsAn], 0, 0);

        // Collision tiles
        this.obstaclesLayer.setCollisionByExclusion([-1]);

        // Damage tiles
        this.damageLayer.setCollisionByExclusion([-1], true);

        // Collectables
        this.collectablesLayer.setCollisionByExclusion([-1], true);
    }

    setUpNPCs() {
        this.npcs = this.add.group();
        this.NPC_1 = this.addNPC("NPC_1", 500, 600, "I Need help finding...");
        this.Knight_1 = this.addNPC("Knight_1", 550, 600);
    }
    addNPC(name, x, y, message = "Hello there!") {
        let npc = this.physics.add.sprite(x, y, `${name}`)
        npc.message = message;
        this.npcs.add(npc);
        this.physics.add.collider(this.player, npc, () => {
            console.log(name);
        });
        npc.setImmovable(true);
        return npc;
    }

    setInteractionArea() {
        for (let npc of this.npcs.getChildren()) {
            const dx = this.player.x - npc.x;
            const dy = this.player.y - npc.y;
            if (Math.sqrt(dx * dx + dy * dy) < 32) {
                if (Phaser.Input.Keyboard.JustDown(this.interact)) {
                    console.log(npc.message);
                }
                console.log("Press 'E' to interact");
            }
        }
    }

    setUpPlayer() {
        this.player = this.physics.add.sprite(300, 1040, 'player');
        this.player.lastDir = new Phaser.Math.Vector2(1, 0); // default facing right
        this.attackHitbox = this.physics.add.image(0, 0, 'attackLine1');
        this.attackHitbox.setDisplaySize(16, 24);
        this.attackHitbox.setVisible(false);
        this.attackHitbox.setActive(false);
        this.attackHitbox.setImmovable(true);
        this.lastDamageTime = 0;
        this.damageCoolDown = 500;
        this.isAttacking = false;

        this.player.setSize(10, 10);
        // this.player.setOffset(0, 0);

        this.player.key = false;
        this.player.coins = 0;
        this.player.health = 10;
        this.addPlayerAnimation();

        // Regular collisions
        this.physics.add.collider(this.player, this.obstaclesLayer);

        // Damage collisions
        this.physics.add.collider(this.player, this.damageLayer, (p, t) => this.damagePlayer(p, t, this.time.now), null, this);

        // Collectables overlap with player calls collect function
        this.physics.add.overlap(this.player, this.collectablesLayer, (p, t) => this.collect(p, t), null, this);

    }

    setCamera(CAMERA_ZOOM) {
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setDeadzone(100, 50);
        this.cameras.main.setZoom(CAMERA_ZOOM);
    }

    setKeyboards() {
        this.up = this.input.keyboard.addKey("W");
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.down = this.input.keyboard.addKey("S");
        this.shift = this.input.keyboard.addKey("SHIFT");
        this.interact = this.input.keyboard.addKey("E");
        this.attack = this.input.keyboard.addKey("SPACE");
    }

    damagePlayer(player, tile, time) {

        if (time < this.lastDamageTime + this.damageCoolDown) {
            return;
        }
        this.lastDamageTime = time;

        // Bounce 
        var bounce = 20;
        if (this.up.isDown) {
            this.player.setVelocityY(bounce);
        } else if (this.down.isDown) {
            this.player.setVelocityY(-bounce);
        }

        if (this.left.isDown) {
            this.player.setVelocityX(bounce);
        }
        else if (this.right.isDown) {
            this.player.setVelocityX(-bounce);
        }

        // Take 1 damage (but not below 0)
        player.health = Math.max(0, player.health - 1);

        // flash effect
        player.setTint(0xff5555);
        this.time.delayedCall(150, () => player.clearTint());

        // this.sound.play('hit');

        // if (player.health <= 0) { this.scene.start("GameOver"); }
    }

    setPlayerMovement(PLAYER_SPEED, allowToWalk = true) {
        var speed = PLAYER_SPEED;
        var can = allowToWalk;
        if ((this.down.isDown || this.up.isDown) && (this.left.isDown || this.right.isDown)) {
            speed = PLAYER_SPEED / Math.sqrt(2);
        } else {
            speed = PLAYER_SPEED;
        }

        if (this.shift.isDown) {
            speed = speed * 1.5
        } else {
            speed = speed;
        }

        if (can === true) {
            if (this.up.isDown) {
                this.player.setVelocityY(-speed);
            }
            else if (this.down.isDown) {
                this.player.setVelocityY(speed);
            }
            else {
                this.player.setVelocityY(0);
            }

            if (this.left.isDown) {
                this.player.setVelocityX(-speed);
            }
            else if (this.right.isDown) {
                this.player.setVelocityX(speed);
            }
            else {
                this.player.setVelocityX(0);
            }
        }
    }

    addPlayerAnimation() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'sprint',
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
            frameRate: 9,
            repeat: -1
        });

        this.anims.create({
            key: 'attack',
            frames: [{ key: "player", frame: 3 }],
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: "player", frame: 0 }],
            frameRate: 1,
            repeat: -1
        });
    }

    setAnimation() {

        // 1. If already attacking, prevent walk/sprint from overriding it
        if (this.isAttacking) return;

        // 2. Attack input
        if (Phaser.Input.Keyboard.JustDown(this.attack) && !this.isAttacking) {
            this.isAttacking = true;
            this.player.play("attack", true);
            this.attacking();

            this.time.delayedCall(200, () => {
                this.player.play("idle", true);
                this.isAttacking = false;
            });
            return;
        }

        // 3. Facing + lastDir update
        if (this.right.isDown) {
            this.player.flipX = false;
            this.player.lastDir.set(1, 0);
        }
        else if (this.left.isDown) {
            this.player.flipX = true;
            this.player.lastDir.set(-1, 0);
        }

        if (this.up.isDown) {
            this.player.lastDir.set(0, -1);
        }
        else if (this.down.isDown) {
            this.player.lastDir.set(0, 1);
        }

        // 4. Movement animations
        if (this.shift.isDown) {
            this.player.play('sprint', true);
        }
        else if (
            this.right.isDown ||
            this.left.isDown ||
            this.up.isDown ||
            this.down.isDown
        ) {
            this.player.play('walk', true);
        }
        else {
            this.player.play('idle', true);
        }
    }



    updateAnimatedTiles(delta) {
        this.animTimer += delta;
        if (this.animTimer < this.animFrameDuration) return;
        this.animTimer = 0;

        this.map.layers.forEach(layerData => {
            const layer = layerData.tilemapLayer;
            if (!layer) return;

            layer.forEachTile(tile => {
                if (!tile.properties || tile.properties.animationFrames === undefined)
                    return;

                const length = tile.properties.animationFrames;
                const start = tile.index;

                if (tile.baseFrame === undefined)
                    tile.baseFrame = start;

                const base = tile.baseFrame;
                const offset = tile.index - base;
                const nextOffset = (offset + 1) % length;

                tile.index = base + nextOffset;
            });
        });
    }

    collect(player, tile) {
        if (!tile.properties) return false;
        // check if tile has a property 'Coins'equal to true
        if (tile.properties.Coins === true) {
            player.coins++;

            // this.sound.play('coin'); 
            // this.coinText.setText('coin: ' + this.coin);
            // this.registry.set(REG_coin, this.coin);

            this.collectablesLayer.removeTileAt(tile.x, tile.y);
            return false;
        }
    }

    attacking() {
        let dir = this.player.lastDir.clone().normalize();
        this.attackHitbox.setTexture('attackLine1');

        let hbx = 48;
        let hby = 64;

        const distance = 16; // 8 tiles away (assuming 16px tiles)

        // Position PNG in front of player
        this.attackHitbox.x = this.player.x + dir.x * distance;
        this.attackHitbox.y = this.player.y + dir.y * distance;

        // --- HITBOX SIZE BASED ON DIRECTION ---
        if (Math.abs(dir.x) > Math.abs(dir.y)) {
            // Facing LEFT or RIGHT
            // Use original size (32 W × 64 H)
            this.attackHitbox.setSize(hbx, hby);
        } else {
            // Facing UP or DOWN
            // Swap width and height (64 W × 32 H)
            this.attackHitbox.setSize(hby, hbx);
        }

        // OPTIONAL: rotate sprite visually, if needed  
        this.attackHitbox.angle = Phaser.Math.RadToDeg(dir.angle());

        // Activate hitbox
        this.attackHitbox.setVisible(true);
        this.attackHitbox.setActive(true);

        this.time.delayedCall(50, () => {
            this.attackHitbox.setTexture('attackLine2');
        });

        this.time.delayedCall(100, () => {
            this.attackHitbox.setTexture('attackLine3');
        });

        // Hide after 200ms
        this.time.delayedCall(200, () => {
            this.attackHitbox.setVisible(false);
            this.attackHitbox.setActive(false);
        });
    }
}