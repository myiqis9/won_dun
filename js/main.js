/**
Phaser 3 Jam
Viviana Ema Radu

This is a preparation for my final project.
here's the extra tutorials that mostly helped me and inspired me in my work:
https://www.emanueleferonato.com/2020/08/20/html5-deck-of-cards-management-updated-to-phaser-3/
https://www.youtube.com/watch?v=tIaXbRzjyqk 
https://labs.phaser.io/edit.html?src=src\game%20objects\container\container%20and%20child%20input.js 
https://labs.phaser.io/edit.html?src=src\tweens\chains\multi%20target%20chain.js 
*/

"use strict";

let config = {
    type: Phaser.AUTO,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 520,
    backgroundColor: '#d3dcdd',
    physics: {
        default: 'arcade'
    },
    scene: [Boot, Play, Select, Battle, Purgatory, Shop, Rest, Feed, Upgrade]
};

let game = new Phaser.Game(config);