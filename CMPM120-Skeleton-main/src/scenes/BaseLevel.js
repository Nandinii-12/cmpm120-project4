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
