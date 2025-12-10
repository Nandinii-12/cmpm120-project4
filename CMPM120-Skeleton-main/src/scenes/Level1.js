import { BaseLevel } from "./BaseLevel.js";

export class Level1 extends BaseLevel {
    constructor() {
        super("Level1", "lvl1");
    }

    create() {
        super.create();

        this.keyText = this.add.text(0, 0, "Keys collected: " + this.keysCollected, {
            fontFamily: 'Arial',
            fontSize: '9px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 2, y: 2 },
            align: 'center',
        });

        // Center on screen
        this.keyText.setPosition(
            (this.cameras.main.width / 2 - this.keyText.width / 2)+150,
            (this.cameras.main.height / 2 - this.keyText.height / 2)-55
        );

        // Fix it to camera
        this.keyText.setScrollFactor(0);

        this.bucketCollected = false;
        this.bucketDelivered = false;
        this.talkedToGirl = false;
        this.enter = false;
        this.inLibrary = false;
        this.gotKey = false;

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
            "Please help me carry this bucket to my house." + 
            "\nI live in the small brown house WEST of here.\nI will meet you there."
        );

        this.girl.setImmovable(true);
        this.girlHouse = { x: 120, y: 570 };

        //Guard 
        this.guard = this.addNPC(
            "Knight_1",
            1042,
            1215,
            "Halt. You cannot pass."
        );

        this.guard.setImmovable(true);

        //Librarian 
        this.librarian = this.addNPC(
            "NPC_3",
            1050,
            360,
            "..."
        );

        this.librarian.setImmovable(true);
    }
}
