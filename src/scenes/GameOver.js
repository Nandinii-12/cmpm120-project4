export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create()
    {
        //Win text
        this.add.text(1280 / 2, (720 / 2) - 70, 'Oh no...!', {
            fontSize: '50px',
            color: '#ffffffff'
        }).setOrigin(0.5);

        //Context
        this.add.text(1280 / 2, (720 / 2) + 20, 'Tiny Town has fallen due to your loss...', {
            fontSize: '20px',
            color: '#ffffffff'
        }).setOrigin(0.5);

        //Replay Button
        const replayText = this.add.text(1280 / 2, (720 / 2) + 70, 'Try Again?', {
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