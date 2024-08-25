class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: 'boot'
        });
    }

    preload() {
        //all images
        //character sprites are not mine. they're taken from the mobile game Project Sekai: Colorful Stage!
        //copyright Colorful Palette https://www.colorfulstage.com/ I'm just using them for fun as filler
        //the text boxes were made by me!
        this.load.image('textbox', 'assets/images/textbox.png');
        this.load.image('bg', 'assets/images/bg.png');
        this.load.image('button', 'assets/images/button.png');
        this.load.image('saki', 'assets/images/saki.png');
        this.load.image('emu', 'assets/images/emu.png');
        this.load.image('kasa', 'assets/images/kasa.png');
        this.load.image('nene', 'assets/images/nene.png');
        this.load.image('rui', 'assets/images/rui.png');
        this.load.image('kana', 'assets/images/kana.png');
        this.load.image('mafu', 'assets/images/mafu.png');
        this.load.image('mizu', 'assets/images/mizu.png');

        //load all enemies
        //enemy sprites are taken from the game Maplestory
        //copyright Wizet https://maplestory.nexon.net/
        this.load.image('bear', 'assets/images/enemies/bear.png');
        this.load.image('clock', 'assets/images/enemies/clock.png');
        this.load.image('crusher', 'assets/images/enemies/crusher.png');
        this.load.image('dodo', 'assets/images/enemies/dodo.png');
        this.load.image('horse', 'assets/images/enemies/horse.png');
        this.load.image('mage', 'assets/images/enemies/mage.png');

        this.load.on('complete', this.start);
    }

    create() {
        this.loadtxt = this.add.text(this.game.config.width/2-100, this.game.config.height/2, 'Loading...', {
            fontFamily: 'pstart',
            fontSize: 22,
            color: '#548087'
        });
        this.loadtxt.visible = true;
    }

    start() {
        setTimeout(() => {
            this.scene.start('play');
        }, 500);
    }

    update() {

    }
}