import { BaseLevel } from "./BaseLevel.js";

export class librarySub extends BaseLevel {
    constructor() {
        super("librarySub", "library"); // scene key + map name
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

        //Setting player position in library
        this.player.setPosition(80, 140);

        this.librarian = this.addNPC(
            "NPC_3",
            250,
            50,
            "Here is the third key."
        );
        this.gotKey = true;

        this.librarian.setImmovable(true);
    }
}
