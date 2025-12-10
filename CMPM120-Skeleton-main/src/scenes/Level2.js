import { BaseLevel } from "./BaseLevel.js";

export class Level2 extends BaseLevel {
    constructor() {
        super("Level2", "lvl2");
    }

    create() {
        super.create();
        this.setUpKnights();

    }

    update() {
        super.update();
        this.setKnightAttackArea();



        // console.log(parseInt(this.player.x) + ', '+ parseInt(this.player.y));
        console.log("Health: " + this.player.health + "\nCoins: " + this.player.coins + "\nHearts: " + this.player.health);
        // console.log(this.player.body.velocity.x, this.player.body.velocity.y)
    }

    setUpKnights() {
        this.knight1 = this.addKnight("Knight_1", 174, 276);
    }
}

//Untested