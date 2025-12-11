export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }
    create() {
        //Title
        this.add.text(1280 / 2, (720 / 2) - 70, 'Throne Rush', {
            fontSize: '50px',
            color: '#ffffffff'
        }).setOrigin(0.5);

        //Context
        this.add.text(1280 / 2, (720 / 2) -20, 'Infiltrate the castle and claim the throne', {
            fontSize: '30px',
            color: '#ffffffff'
        }).setOrigin(0.5);

        //Context
        this.add.text(1280 / 2, (720 / 2) + 20, 'Use WASD to move, LSHIFT to sprint, E to interact, and SPACE to attack.', {
            fontSize: '20px',
            color: '#ffffffff'
        }).setOrigin(0.5);

        //Start Button
        const startText = this.add.text(1280 / 2, (720 / 2) + 70, 'START GAME', {
            fontSize: '40px',
            color: '#0080ff',
            fontStyle: 'bold',
            backgroundColor: '#00000055',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        //Level select button
        const levelText = this.add.text(1280 / 2, (720 / 2) + 130, 'Select Level', {
            fontSize: '30px',
            color: '#0080ff',
            fontStyle: 'bold',
            backgroundColor: '#00000055',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        //Lvl select buttons (hidden at first)
        const level1Text = this.add.text((1280 / 2) - 100, (720 / 2) + 170, 'Town', {
            fontSize: '20px',
            color: '#0080ff',
            backgroundColor: '#00000055',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false);

        const level2Text = this.add.text((1280 / 2) + 80, (720 / 2) + 170, 'Castle', {
            fontSize: '20px',
            color: '#0080ff',
            backgroundColor: '#00000055',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false);

        // --- Scene switching ---
        startText.on('pointerdown', () => {
            this.scene.start('Level1'); // goes straight to lvl1
        });

        // --- Reveal level options ---
        levelText.on('pointerdown', () => {
            level1Text.setVisible(true);
            level2Text.setVisible(true);
        });

        // --- Level button actions ---
        level1Text.on('pointerdown', () => this.scene.start('Level1'));
        level2Text.on('pointerdown', () => this.scene.start('Level2'));
    }
}