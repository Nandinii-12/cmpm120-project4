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
        this.dialogueActive = false;
        this.keysCollected = this.registry.get("keysCollected") ?? 0;

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
        this.setPlayerMovement(500);
        this.setInteractionArea();

        // console.log(parseInt(this.player.x) + ', '+ parseInt(this.player.y));
        //console.log("Health: " + this.player.health + "\nCoins: " + this.player.coins + "\nHearts: " + this.player.health);
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
        this.knights = this.add.group();

        // this.physics.world.overlap(this.player, this.knights, (p, e) => {
        //     p.health--;
        // });
        this.physics.world.overlap(this.attackHitbox, this.knights, (p, e) => {
            e.health--;
        });

        // this.physics.add.collider(this.player, this.knights, (p, t) => this.damageKnight(p, t, this.time.now), null, this);
        // this.physics.add.collider(this.player, this.knights, (p, t) => this.damagePlayer(p, t, this.time.now), null, this);
        this.physics.add.collider(this.player, this.knights, (player, knight) => { this.damagePlayer(player, knight, this.time.now); this.damageKnight(player, knight, this.time.now); }, null, this);

    }

    addNPC(name, x, y, message = "...") {
        let npc = this.physics.add.sprite(x, y, `${name}`);
        // message
        npc.message = message;

        this.npcs.add(npc);
        this.physics.add.collider(this.player, npc, () => {
            console.log(name);
        });
        npc.setImmovable(true);
        return npc;
    }

    addKnight(name, x, y) {
        let knight = this.physics.add.sprite(x, y, `${name}`);
        knight.health = 5;
        knight.lastDamageTime = 0;
        knight.damageCoolDown = 500;
        knight.canMove = true;
        this.physics.add.collider(knight, this.obstaclesLayer);

        // message
        // knight.message = message;

        this.knights.add(knight);


        knight.setImmovable(true);
        knight.xorigin = x;
        knight.yorigin = y;
        return knight;
    }

    setKnightAttackArea(speed = 40, area = 112) {

        for (let knight of this.knights.getChildren()) {
            if (knight.canMove === true) {
                // Distance from player to knight's ORIGIN
                const dx = this.player.x - knight.xorigin;
                const dy = this.player.y - knight.yorigin;
                const distanceToOrigin = Math.hypot(dx, dy);

                if (distanceToOrigin < area) {
                    // ---- CHASE PLAYER ----
                    const cx = this.player.x - knight.x;
                    const cy = this.player.y - knight.y;
                    const cdist = Math.hypot(cx, cy);

                    const nx = cx / cdist;
                    const ny = cy / cdist;

                    knight.body.setVelocity(nx * speed, ny * speed);
                }
                else {
                    // ---- RETURN TO ORIGIN ----
                    const rx = knight.xorigin - knight.x;
                    const ry = knight.yorigin - knight.y;
                    const rdist = Math.hypot(rx, ry);

                    if (rdist > 2) {
                        const nx = rx / rdist;
                        const ny = ry / rdist;
                        knight.body.setVelocity(nx * speed, ny * speed);
                    } else {
                        knight.body.setVelocity(0, 0);
                    }
                }
            }

        }
    }


    setInteractionArea() {
        for (let npc of this.npcs.getChildren()) {
            const dx = this.player.x - npc.x;
            const dy = this.player.y - npc.y;
            if (Math.sqrt(dx * dx + dy * dy) < 32) {
                if (Phaser.Input.Keyboard.JustDown(this.interact)) {
                    //Watergirl interaction condition
                    if (npc === this.girl && !this.talkedToGirl) {
                        this.talkedToGirl = true;
                    }

                    //Guard interaction condition
                    if (npc === this.guard && this.keysCollected == 3) {
                        this.guard.message = "You have collected all three keys.\nYou may enter.";
                        this.enter = true;
                    }

                    //Librarian interaction condition 1
                    if (npc === this.librarian && this.keysCollected == 2) {
                        this.librarian.message = "I see you have two keys collected.\nCome inside the library, I have something for you.";
                        this.inLibrary = true;
                    }

                    this.dialogueActive = true;

                    let label = this.add.text(0, 0, npc.message, {
                        fontFamily: 'Arial',
                        fontSize: '12px',
                        color: '#ffffff',
                        backgroundColor: '#000000',
                        padding: { x: 10, y: 6 },
                        align: 'center',
                    });

                    // Center on screen
                    label.setPosition(
                        (this.cameras.main.width / 2 - label.width / 2),
                        (this.cameras.main.height / 2 - label.height / 2) + 60
                    );

                    // Fix it to camera
                    label.setScrollFactor(0);

                    // Remove after 4 seconds
                    this.time.delayedCall(4000, () => {
                        label.destroy();
                        this.dialogueActive = false;
                        //Adds watergirl key and gets rid of watergirl NPC
                        if (this.bucketDelivered) {
                            this.keysCollected++;
                            this.registry.set("keysCollected", this.keysCollected);
                            this.keyText.setText("Keys collected: " + this.keysCollected);
                            this.girl.destroy();
                        }

                        //Checks if enter is true
                        if (this.enter) {
                            this.scene.start('Level2');
                        }

                        //Checks if inLibrary is true
                        if (this.inLibrary) {
                            this.scene.start('librarySub');
                        }

                        //Checks if gotKey is true
                        if (this.gotKey) {
                            this.keysCollected++;
                            this.registry.set("keysCollected", this.keysCollected);
                            this.keyText.setText("Keys collected: " + this.keysCollected);

                            this.registry.set("spawnAtLibraryExit", true);
                            this.scene.start('Level1');
                        }
                    });
                }
            }
        }
    }


    setUpPlayer() {
        this.player = this.physics.add.sprite(300, 1040, 'player');
        this.player.canMove = true;
        this.player.lastDir = new Phaser.Math.Vector2(1, 0); // default facing right
        this.player.setSize(10, 10);
        this.attackHitbox = this.physics.add.image(0, 0, 'attackLine1');
        this.attackHitbox.setDisplaySize(16, 24);
        this.attackHitbox.setVisible(false);
        this.attackHitbox.setActive(false);
        this.attackHitbox.setImmovable(true);
        this.lastDamageTime = 0;
        this.damageCoolDown = 500;
        this.isAttacking = false;


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

    damagePlayer(player, knight, time) {

        if (time < player.lastDamageTime + player.damageCoolDown) {
            return;
        }

        if (!knight.canMove) {
            return;
        }
        player.lastDamageTime = time;

        // Knockback strength
        const bounce = 200;

        // Bounce AWAY from the knight
        const dx = player.x - knight.x;
        const dy = player.y - knight.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;

            player.body.setVelocity(nx * bounce, ny * bounce);
        }

        // Deal 1 damage
        player.health = Math.max(0, player.health - 1);

        // Flash effect
        player.setTint(0xff5555);
        this.time.delayedCall(150, () => player.clearTint());
    }


    damageKnight(player, knight, time) {

        if (!knight.canMove) {
            return;
        }

        knight.canMove = false; // stun immediately
        knight.lastDamageTime = time;

        // Knockback strength
        const bounce = 40;

        // Bounce away from player
        const dx = knight.x - player.x;
        const dy = knight.y - player.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;
            knight.body.setVelocity(nx * bounce, ny * bounce);
        }

        // Deal 1 damage
        knight.health = Math.max(0, knight.health - 1);

        // Flash hit effect
        knight.setTint(0xff5555);
        this.time.delayedCall(150, () => knight.clearTint());

        this.time.delayedCall(500, () => {
            knight.body.setVelocity(0, 0);
        });

        this.time.delayedCall(600, () => {
            knight.canMove = true;
        });
    }




    setPlayerMovement(PLAYER_SPEED) {
        if (this.dialogueActive) {
            this.player.setVelocity(0, 0);
            return;
        }
        var speed = PLAYER_SPEED;

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

        if (this.player.canMove === true) {
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

        if (tile.properties.bucket === true) {
            if (!this.talkedToGirl) {
                return false;
            }

            this.bucketCollected = true;
            this.collectablesLayer.removeTileAt(tile.x, tile.y);

            // Move the girl to the house
            if (!this.bucketDelivered) {
                this.girl.setPosition(120, 570);
                this.girl.message = "Thank you! Here is a key I found for your troubles.\nIt looks valuable.";
                this.bucketDelivered = true;
            }
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

    collectMushroom(player, mush) {
        if (!this.startedMushroomQuest) return; 

        mush.destroy();
        this.mushroomsCollected++;

        // Optional XP-style popup
        let popup = this.add.text(player.x, player.y - 20, "+1 mushroom", {
            fontSize: "12px",
            color: "#00ff00",
            stroke: "#000",
            strokeThickness: 4
        });
        popup.setDepth(999);

        this.time.delayedCall(800, () => popup.destroy());

        if (this.mushroomsCollected >= this.mushroomsNeeded) {
            this.helpedMushroomNPC = true;
        }
    }
}