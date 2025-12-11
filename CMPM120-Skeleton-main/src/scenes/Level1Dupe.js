import { BaseLevel } from "./BaseLevel.js";

export class Level1Dupe extends BaseLevel {
    constructor() {
        super("Level1Dupe", "lvl1Dupe"); // scene key + map name
    }

    create() {
        super.create();

        if (this.registry.get("spawnAtLibraryExit"))
        {
            this.player.setPosition(this.libraryExit.x, this.libraryExit.y);
            this.registry.set("spawnAtLibraryExit", false); // reset flag
        }

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

        //Librarian 
        this.librarian = this.addNPC(
            "NPC_3",
            1050,
            360,
            "..."
        );

        this.librarian.setImmovable(true);
        this.libraryExit = { x: 1030, y: 330 };

        //Guard 
        this.guard = this.addNPC(
            "Knight_1",
            1042,
            1215,
            "Halt. You cannot pass."
        );

        this.guard.setImmovable(true)

        //Rich girl 
        this.richGirl = this.addNPC(
            "NPC_2",
            320,
            240,
            "Please help me find my gold coins!\nI lost 25 of them!"
        );

        this.richGirl.setImmovable(true);
    }
}
