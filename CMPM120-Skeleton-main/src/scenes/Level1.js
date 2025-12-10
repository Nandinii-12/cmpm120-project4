import { BaseLevel } from "./BaseLevel.js";

export class Level1 extends BaseLevel {
    constructor() {
        super("Level1", "lvl1");
    }

    create() {
        super.create();

        // Mayor just above spawn
        this.mayor = this.addNPC(
            "NPC_4",
            this.player.x,
            this.player.y - 32,

            "I need your help!\n\n" +
            "You must enter the castle and claim the throne.\n" +
            "But the gates are sealed — you need to find THREE KEYS."
        );

        this.mayor.setImmovable(true);
    }
}
