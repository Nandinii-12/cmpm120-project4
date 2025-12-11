import { Level1 } from "./scenes/Level1.js";
import { Level2 } from "./scenes/Level2.js";
import { librarySub } from "./scenes/library.js";
import { Level1Dupe } from "./scenes/Level1Dupe.js";
import { Start } from "./scenes/Start.js";
import { Win } from "./scenes/Win.js";
import { GameOver } from "./scenes/GameOver.js";

const config = {
    type: Phaser.AUTO,
    title: 'CMPM 120 Project 4',
    description: ' ',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                x: 0,
                y: 0
            },
            debug: true
        }
    },
    scene: [Start, Level1, librarySub, Level1Dupe, Level2, Win, GameOver],
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            