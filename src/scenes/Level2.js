import { BaseLevel } from "./BaseLevel.js";

export class Level2 extends BaseLevel {
    constructor() {
        super("Level2", "lvl2");
    }

    create() {
        super.create();
        this.setUpKnights();

        this.healthText = this.add.text(0, 0, "HP: " + this.player.health, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 2, y: 2 },
            align: 'center',
        });

        // Center on screen
        this.healthText.setPosition(
            (this.cameras.main.width / 2 - this.healthText.width / 2)+250,
            (this.cameras.main.height / 2 - this.healthText.height / 2)-100
        );

        // Fix it to camera
        this.healthText.setScrollFactor(0);

        this.playerKills = this.add.text(0, 0, "Kills: " + this.player.kills, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 2, y: 2 },
            align: 'center',
        });

        // Center on screen
        this.playerKills.setPosition(
            (this.cameras.main.width / 2 - this.playerKills.width / 2)+250,
            (this.cameras.main.height / 2 - this.playerKills.height / 2)-120
        );

        // Fix it to camera
        this.playerKills.setScrollFactor(0);
    }

    update() {
        super.update();
        this.setKnightAttackArea();

        this.checkEndGame();

        // console.log(parseInt(this.player.x) + ', '+ parseInt(this.player.y));
        // console.log("Health: " + this.player.health + "\nCoins: " + this.player.coins + "\nHearts: " + this.player.health);
        // console.log(this.player.body.velocity.x, this.player.body.velocity.y)

    }

    checkEndGame(){
        if(this.player.kills === 10){
            this.scene.start('Win');
        }

        if(this.player.health === 0){
            this.scene.start('GameOver');
        }
    }
    setUpKnights() {
        this.knight1 = this.addKnight((Math.random() < 0.5) ? "Knight_1" : "Knight_2", 174, 276);
        this.knight2 = this.addKnight((Math.random() < 0.5) ? "Knight_1" : "Knight_2", 174, 286);
        this.knight3 = this.addKnight((Math.random() < 0.5) ? "Knight_1" : "Knight_2", 420, 200);
        this.knight4 = this.addKnight((Math.random() < 0.5) ? "Knight_1" : "Knight_2", 135, 530);
        this.knight5 = this.addKnight((Math.random() < 0.5) ? "Knight_1" : "Knight_2", 440, 440);
        this.knight6 = this.addKnight((Math.random() < 0.5) ? "Knight_1" : "Knight_2", 920, 50);
        this.knight7 = this.addKnight((Math.random() < 0.5) ? "Knight_1" : "Knight_2", 1150, 400);
        this.knight8 = this.addKnight((Math.random() < 0.5) ? "Knight_1" : "Knight_2", 750, 485);
        this.knight9 = this.addKnight((Math.random() < 0.5) ? "Knight_1" : "Knight_2", 1030, 930);
        this.knight10 = this.addKnight((Math.random() < 0.5) ? "Knight_1" : "Knight_2", 954, 760);
        this.knight11 = this.addKnight((Math.random() < 0.5) ? "Knight_1" : "Knight_2", 500, 1030);
        this.knight12 = this.addKnight((Math.random() < 0.5) ? "Knight_1" : "Knight_2", 500, 1014);        
    }

}
