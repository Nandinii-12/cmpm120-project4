import { BaseLevel } from "./BaseLevel.js";

export class Level1 extends BaseLevel {
    constructor() {
        super("Level1", "lvl1");
    }

    create() {
        super.create();

        // Mayor
        this.mayor = this.addNPC(
            "NPC_4",
            300,
            1010,

            "The town needs your help!\n\n" +
            "You must enter the castle and claim the throne.\n" +
            "But the gates are blocked — you need to find THREE KEYS."
        );

        this.mayor.setImmovable(true);
    

    // Water girl 
        this.girl = this.addNPC(
            "NPC_1",
            800,
            870,

            "Please help me carry this bucket to my house.\nI live in the small brown house WEST of here."
        );

        this.girl.setImmovable(true);
    }
}
