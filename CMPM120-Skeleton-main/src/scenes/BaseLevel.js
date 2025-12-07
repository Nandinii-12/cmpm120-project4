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


    }

    create() {
        this.animTimer = 0; // For animated tiles
        this.animFrameDuration = 240; // How fast tiles animates
        this.last_time = 0;
        // this.player.health = 0; 

        this.makeTilemap();
    }

    update(time, delta) {
        let dt = (time - this.last_time) / 1000;
        this.last_time = time;
        this.updateAnimatedTiles(delta);

    }


    // Haven't test if collisions on obstacle layer and collectables layers works
    makeTilemap() {
        this.map = this.add.tilemap(this.mapName);

        const tsInside = this.map.addTilesetImage('insideSheet1', 'insideSheet1');
        const tsOutside = this.map.addTilesetImage('outsideSheet1', 'outsideSheet1');
        const tsAn = this.map.addTilesetImage('animations', 'animations');

        this.map.createLayer("background", [tsInside, tsOutside, tsAn], 0, 0);
        this.map.createLayer("decorationA", [tsInside, tsOutside, tsAn], 0, 0);
        this.map.createLayer("decorationB", [tsInside, tsOutside, tsAn], 0, 0);
        this.map.createLayer("decorationC", [tsInside, tsOutside, tsAn], 0, 0);


        // Collision tiles
        this.obstaclesLayer = this.map.createLayer("obstacles", [tsInside, tsOutside, tsAn], 0, 0);
        this.obstaclesLayer.setCollisionByExclusion([-1]);

        // Damage tiles
        this.damageLayer = this.map.createLayer("damageLayer", [tsInside, tsOutside, tsAn], 0, 0);
        this.damageLayer.setCollisionByExclusion([-1], true);

        // Collectables
        this.collectablesLayer = this.map.createLayer("collectables", [tsInside, tsOutside, tsAn], 0, 0);
        this.collectablesLayer.setCollisionByExclusion([-1], true);
    }


    // Not finished: Need player sprite preloaded
    setupPlayer() {
        // this.player = this.physics.add.sprite(50, 0, 'player'); 
        this.player.key = false;
        this.player.coins = 0;
        this.player.health = 0;

        // Regular collisions
        this.physics.add.collider(this.player, this.obstaclesLayer);

        // Damage collisions
        this.physics.add.collider(this.player, this.damageLayer, (p, t) => this.damagePlayer(p, t, this.time.now), null, this);

        // Collectables overlap with player calls collect function
        this.physics.add.overlap(this.player, this.collectablesLayer, (p, t) => this.collect(p, t), null, this);
    }

<<<<<<< HEAD:CMPM120-Skeleton-main/src/scenes/BaseLevel.js
=======
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
        // this.jumpKey = this.input.keyboard.addKey("SPACE");
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

        // .


        // Take 1 damage (but not below 0)
        player.health = Math.max(0, player.health - 1);



        // flash effect
        player.setTint(0xff5555);
        this.time.delayedCall(150, () => player.clearTint());

        // this.sound.play('hit');

        // if (player.health <= 0) { this.scene.start("GameOver"); }
    }

    setPlayerMovement(PLAYER_SPEED, allowToWalk = true) {
        var can = allowToWalk;
        if (can === true) {
            if (this.up.isDown) {
                this.player.setVelocityY(-PLAYER_SPEED);
            }
            else if (this.down.isDown) {
                this.player.setVelocityY(PLAYER_SPEED);
            }
            else {
                this.player.setVelocityY(0);
            }

            if (this.left.isDown) {
                this.player.setVelocityX(-PLAYER_SPEED);
            }
            else if (this.right.isDown) {
                this.player.setVelocityX(PLAYER_SPEED);
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
            frameRate: 3,
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
        if (this.right.isDown) {
            this.player.flipX = false;
        } else if (this.left.isDown) {
            this.player.flipX = true;
        }

        if (this.right.isDown || this.left.isDown || this.up.isDown || this.down.isDown) {
            this.player.play('walk', true);
        } else {
            this.player.play('idle', true);
        }
    }


>>>>>>> eddcafa (Added player asset, setCamera(), playerMovement(), playerAnimation, setKeyboard()):src/scenes/BaseLevel.js

    // Works
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

    // Untested
    collect(player, tile) {
        if (!tile.properties) return false;

        // check if tile has a property 'Coins'equal to true
        if (tile.properties.Coins === true) {
            player.coins++;
            this.sound.play('coin');
            this.coin += 1
            this.coinText.setText('coin: ' + this.coin);
            this.registry.set(REG_coin, this.coin);
            this.collectablesLayer.removeTileAt(tile.x, tile.y);
            return false;
        }

    }

}
