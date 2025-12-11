export class Win extends Phaser.Scene {
    constructor() {
        super('Win');
    }

    create()
    {
        //Win text
        this.add.text(1280 / 2, (720 / 2) - 70, 'Congrats!', {
            fontSize: '50px',
            color: '#ffffffff'
        }).setOrigin(0.5);

        //Context
        this.add.text(1280 / 2, (720 / 2) + 20, 'You are now the ruler of Tiny Town!', {
            fontSize: '20px',
            color: '#ffffffff'
        }).setOrigin(0.5);

        //Replay Button
        const replayText = this.add.text(1280 / 2, (720 / 2) + 70, 'Play Again?', {
            fontSize: '40px',
            color: '#0080ff',
            fontStyle: 'bold',
            backgroundColor: '#00000055',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        replayText.on('pointerdown', () => {
            this.scene.start('Start'); // goes straight to start
        });
    }
}