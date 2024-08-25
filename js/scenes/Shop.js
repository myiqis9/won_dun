//shop scene
class Shop extends Phaser.Scene {
    constructor() {
        super({
            key: 'shop'
        });

        this.btnTxt = [
            ["FEED", "MIN 1 COIN", "FEED YOUR PARTY. FOOD WILL COST 1 COIN PER HUNGER LEVEL FOR EACH PARTY MEMBER."],
            ["REST", "~6 MINUTES", "LEAVE YOUR PARTY TO REST IN ORDER TO RESTORE THEIR ENERGY."],
            ["UPGRADE", "MIN 1 COIN", "UPGRADE YOUR PARTY'S HEALTH OR ATTACK STATS. IT WILL ONLY BE ONE OF THE TWO OFFERED."],
            ["ROLL NEW", "5 COINS", "ROLL A NEW MEMBER TO ADD TO YOUR PARTY!"]
        ];

        this.lack = 'YOU LACK THE REQUIRED AMOUNT OF COINS!';

        this.buttons = [];
    }

    //grab player info
    init(data) {
        this.player = data;
    }

    create() {
        //if you've gotten to the shop, then the tutorial sequence is over
        if(this.player.tutorial) this.player.tutorial = false;
        this.player.canInteract = false;
        this.player.defaultInteractions();
        this.createButtons();
        this.checkMoves();
    }

    createButtons() {
        //create each button
        for(let btn of this.btnTxt) {
            let btnbg = this.add.image(0, 0, 'button');
            let btntxt1 = this.add.text(0, -10, btn[0], this.player.param1).setOrigin(0.5);
            let btntxt2 = this.add.text(0, 15, btn[1], this.player.param2).setOrigin(0.5);

            let newBtn = this.add.container(0, 0, [btnbg, btntxt1, btntxt2]).setAlpha(0);
            newBtn.setScale(0.9);

            //make button interactive
            newBtn.setSize(174, 74); //interaction box
            newBtn.setInteractive(); //makes them able to interact

            //hovering shows more info and tints container
            newBtn.on('pointerover', () => {
                if(this.player.canInteract) {
                    btnbg.setTint(0x87adb3);
                    btntxt1.setTint(0x87adb3);
                    btntxt2.setTint(0x87adb3);
                    this.player.text.setText(btn[2]);
                }
            });

            //cancel hover
            newBtn.on('pointerout', () => {
                if(this.player.canInteract) {
                    btnbg.clearTint();
                    btntxt1.clearTint();
                    btntxt2.clearTint();
                    this.player.text.setText('');
                }
            });

            this.buttons.push(newBtn);
        }

        //coins amount
        let cText = this.add.text(this.game.config.width/2, this.game.config.height/2+10, `COINS: ${this.player.coins}`, this.player.param1).setAlpha(0);
        cText.setOrigin(0.5);
        this.buttons.push(cText);

        //reposition them properly
        this.buttons[0].setPosition(this.game.config.width/2-100, this.game.config.height/2-150);
        this.buttons[1].setPosition(this.game.config.width/2-100, this.game.config.height/2-60);
        this.buttons[2].setPosition(this.game.config.width/2+100, this.game.config.height/2-150);
        this.buttons[3].setPosition(this.game.config.width/2+100, this.game.config.height/2-60);
        
        //usability to buttons
        //feed
        this.buttons[0].on('pointerdown', () => {
            if(this.player.canInteract) {
                if(this.player.coins > 0) this.feed();
                else this.player.text.setText(this.lack);
            }
        });

        //rest
        this.buttons[1].on('pointerdown', () => {
            if(this.player.canInteract) {
                this.rest();
            }
        });

        //upgrade
        this.buttons[2].on('pointerdown', () => {
            if(this.player.canInteract) {
                if(this.player.coins > 0) this.upgrade();
                else this.player.text.setText(this.lack);
            }
        });

        //roll
        this.buttons[3].on('pointerdown', () => {
            if(this.player.canInteract) {
                if(this.player.coins >= 5 && this.player.deck.length < 3) this.roll();
                else if(this.player.deck.length == 3) this.player.text.setText(`SORRY, YOUR PARTY IS FULL!`);
                else this.player.text.setText(this.lack);
            }
        });
    }

    checkMoves() {
        if(this.player.selection > 0) {
            this.player.text.setText(`WELCOME TO THE SHOP! \nHOVER OVER ANYTHING FOR MORE INFORMATION.`);
            this.displayShop();
        }
        else {
            this.goToBattle();
        }
    }

    displayShop() {
        //buttons appear
        for(let button of this.buttons) {
            this.tweens.add({
                targets: button,
                alpha: 1,
                duration: 150,
                onComplete: () => { this.player.canInteract = true; }
            });
        }

        console.log(this.buttons);
    }

    feed() {
        console.log('feed');
        this.destroyAll();

        //change to shop scene
        setTimeout(() => {
            this.scene.start('feed', this.player);
        }, 500);
    }

    rest() {
        console.log('rest');
        this.destroyAll();

        //change to shop scene
        setTimeout(() => {
            this.scene.start('rest', this.player);
        }, 500);
    }

    upgrade() {
        console.log('upgrade');
        this.destroyAll();

        //change to shop scene
        setTimeout(() => {
            this.scene.start('upgrade', this.player);
        }, 500);
    }

    roll() {
        console.log('roll');
        this.destroyAll();
        this.player.coins -= 5;

        //change to shop scene
        setTimeout(() => {
            this.scene.start('select', this.player);
        }, 500);
    }

    destroyAll() {
        //delete all buttons to avoid clutter
        for(let button of this.buttons) {
            this.tweens.add({
                targets: button,
                alpha: 0,
                duration: 150,
                onComplete: () => { button.destroy(); }
            });
        }

        //remove all card interactions
        this.player.removeInteractions();

        this.buttons = [];
        this.player.text.setText('');
    }

    goToBattle() {
        this.destroyAll();

        setTimeout(() => {
            this.player.round++; //move player to next enemy round
            this.player.selection = 2; //reset player selection for next shop
            this.scene.start('battle', this.player);
        }, 500);
    }
}