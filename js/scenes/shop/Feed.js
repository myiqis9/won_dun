//shop feed scene
class Feed extends Phaser.Scene {
    constructor() {
        super({
            key: 'feed'
        });

        this.food = 1;
    }

    //grab player info
    init(data) {
        this.player = data;
    }

    create() {
        this.player.displayCards(this.player.deck);
        this.player.defaultInteractions();
        this.checkAbilities();

        setTimeout(() => {
            this.UIappear();
        }, 200);
    }

    //mizu and kasa both double food rewards. they stack, I guess?
    checkAbilities() {
        for(let c of this.player.deck) {
            if(c.name === 'kasa') this.food = this.food*2;
            if(c.name === 'mizu') this.food = this.food*2;
        }
        console.log(`food amount: ${this.food}`);
    }

    UIappear() {
        this.player.backToShop(this);
        this.player.text.setText('SELECT A PARTY MEMBER TO FEED!');

        this.cText = this.add.text(this.game.config.width/2, this.game.config.height/2+10, `COINS: ${this.player.coins}`, this.player.param1).setAlpha(0);
        this.cText.setOrigin(0.5);

        this.tweens.add({
            targets: this.cText,
            alpha: 1,
            duration: 100
        });

        for(let card of this.player.deck) {
            card.container.on('pointerdown', () => {
                if(this.player.coins > 0) this.feeding(card);
                else this.player.text.setText(`SORRY, YOU'RE OUT OF COINS!`);
            });
        }
    }

    feeding(card) {
        this.player.canInteract = false;
        if(card.hunger == 5) {
            this.player.text.setText(`${card.name.toUpperCase()} IS ALREADY FULL!`);
            this.player.canInteract = true;
        }
        else {
            this.player.text.setText(`${card.name.toUpperCase()} HAS BEEN FED! HOW LOVELY!`);

            //raise card hunger and joy
            card.hunger += this.food;
            if(card.hunger > 5) card.hunger = 5;
            if(card.joy < 5) card.joy++;

            //...and pay the price!
            this.player.coins--;
            this.cText.setText(`COINS: ${this.player.coins}`);

            //little happy animation
            this.tweens.add({
                targets: card.container,
                y: 150,
                duration: 80,
                yoyo: true,
                hold: 20,
                loop: 1,
                onComplete: () => { this.player.canInteract = true; }
            });
        }
    }

    //remove scene specific UI
    UIremove() {
        this.tweens.add({
            targets: this.cText,
            alpha: 0,
            duration: 100
        });
        this.cText.destroy();
    }
}