//shop upgrade scene
class Upgrade extends Phaser.Scene {
    constructor() {
        super({
            key: 'upgrade'
        });

        this.up = '';
    }

    //grab player info
    init(data) {
        this.player = data;
    }

    create() {
        this.player.displayCards(this.player.deck);
        this.player.defaultInteractions();
        this.flipCoin();

        setTimeout(() => {
            this.UIappear();
        }, 200);
    }

    //are we upgrading health or atk?
    flipCoin() {
        //metaphorically of course. were doing this the inscryption way. the funger way if you will
        let coin = Phaser.Math.Between(0, 1);
        if(coin == 0) this.up = 'HP';
        if(coin == 1) this.up = 'ATK';
    }

    UIappear() {
        this.player.backToShop(this);
        this.player.text.setText('SELECT WHICH PARTY MEMBER TO UPGRADE.');

        //text displayed on the screen
        this.cText = this.add.text(this.game.config.width/2, this.game.config.height/2+10, `COINS: ${this.player.coins}`, this.player.param1).setAlpha(0);
        this.upText = this.add.text(this.game.config.width/2, this.game.config.height/2-170, `UPGRADING ${this.up}...`, this.player.param1).setAlpha(0);
        this.cText.setOrigin(0.5);
        this.upText.setOrigin(0.5);

        //UI fades in
        this.tweens.add({
            targets: [this.cText, this.upText],
            alpha: 1,
            duration: 150,
            onComplete: () => { this.player.canInteract = true; }
        });

        //card interactivity
        for(let card of this.player.deck) {
            card.container.on('pointerdown', () => {
                if(this.player.coins > 0) this.canUpgrade(card);
                else this.player.text.setText(`SORRY, YOU'RE OUT OF COINS!`);
            });
        }
    }

    //checks extra aspects that might make a card unable to upgrade, such as being maxed or low on joy
    canUpgrade(card) {
        if(card.joy == 0) this.player.text.setText(`THIS CARD IS TOO UNHAPPY. IT REFUSES THE UPGRADE.`);
        else if(this.up == 'ATK' && card.atk == 9 || this.up == 'HP' && card.hp == 9)
            this.player.text.setText(`THIS CARD IS ALREADY AT MAX ${this.up}!`);
        else this.upgrading(card);
    }

    //card gets upgraded here
    upgrading(card) {
        //it costs a coin no matter if it succeeds or fails
        this.player.coins--;
        this.player.canInteract = false;

        if(this.success()) {
            if(this.up == 'ATK') card.atk++;
            if(this.up == 'HP') { card.hp++; card.maxhp++; }
            card.updateValues();

            //little happy animation
            this.tweens.add({
                targets: card.container,
                y: '-=40',
                duration: 80,
                yoyo: true,
                loop: 1,
                onComplete: () => { this.player.canInteract = true; }
            });

            this.player.text.setText(`${card.name.toUpperCase()} IS ALL POWERED UP!`);
        }
        else {
            //loses happiness if failed
            if(card.joy > 0) card.lowerJoy(this.player.hasSaki);

            //little unhappy animation
            this.tweens.chain({
                tweens: [
                    {
                        targets: card.container,
                        x: '+=5',
                        ease: 'Quintic.easeInOut',
                        duration: 30
                    },
                    {
                        targets: card.container,
                        x: '-=15',
                        ease: 'Quintic.easeInOut',
                        duration: 50,
                        yoyo: true,
                        repeat: 1
                    },
                    {
                        targets: card.container,
                        x: '-=5',
                        ease: 'Quintic.easeInOut',
                        duration: 30
                    },
                ]
            });

            this.player.text.setText(`OH NO! THE UPGRADE FAILED.`);
        }
        //update coins display
        this.cText.setText(`COINS: ${this.player.coins}`);
        this.player.canInteract = true;
    }

    //upgrades have only a 40% chance of succeeding. if they fail, the card also loses joy!
    //they're therefore cheap but also fair. and you must absolutely NEVER upgrade kasa
    success() {
        let pass = Phaser.Math.Between(1, 10);
        console.log(`upgrade success: ${pass}`);
        if(pass > 4) return false;
        else return true;
    }

    //remove scene specific UI
    UIremove() {
        this.tweens.add({
            targets: [this.cText, this.upText],
            alpha: 0,
            duration: 100
        });
        this.cText.destroy();
        this.upText.destroy();
    }
}