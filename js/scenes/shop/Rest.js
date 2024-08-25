//shop rest scene
class Rest extends Phaser.Scene {
    constructor() {
        super({
            key: 'rest'
        });

        this.base = 6;
        this.minutes = 6;
        this.seconds = 0;
        this.m;
        this.s;
    }

    //grab player info
    init(data) {
        this.player = data;
    }

    create() {
        this.base = 6; //resets because abilities sometimes mess it up
        this.player.displayCards(this.player.deck);
        this.player.defaultInteractions();
        this.checkAbilities();

        setTimeout(() => {
            this.UIappear();
        }, 200);
    }

    //checks card abilities first, as mizu doubles rest time needed and kasa halves it
    //they cancel each other out if both are present in the party :)
    checkAbilities() {
        for(let c of this.player.deck) {
            if(c.name === 'mizu') this.base = this.base*2;
            else if(c.name === 'kasa') this.base = this.base/2;
        }
        this.minutes = this.base;
        console.log(`base: ${this.base}`);
    }

    UIappear() {
        this.player.backToShop(this);
        this.player.text.setText('SHH! \nYOUR CARDS ARE RESTING. COME CHECK ON THEM LATER!');

        //text displayed on the screen
        this.timer = this.add.text(this.game.config.width/2, this.game.config.height/2+10, `00:00`, this.player.param1).setAlpha(0);
        this.zzz = this.add.text(this.game.config.width/2, this.game.config.height/2-170, 'ZZZ...', this.player.param1).setAlpha(0);
        this.timer.setOrigin(0.5);
        this.zzz.setOrigin(0.5);
        this.updateTimer();

        //UI fades in
        this.tweens.add({
            targets: [this.timer, this.zzz],
            alpha: 1,
            duration: 150,
            onComplete: () => {
                this.interv = setInterval(() => {
                    this.countdown();
                }, 1000);
            }
        });
    }

    countdown() {
        //simple timer
        if(this.seconds == 0) {
            //if timer reaches 0, check current energy then raise it
            if(this.minutes == 0) {
                this.minutes = this.base;
                this.seconds = 0;
                this.checkOver();
            }
            else {
                this.minutes--;
                this.seconds = 59;
            }
        }
        else this.seconds--;

        //display timer
        this.updateTimer();
    }

    updateTimer() {
        //add zeroes if necessary to keep the timer display look consistent
        if(this.minutes < 10) this.m = '0' + this.minutes;
        else this.m = this.minutes;
        if(this.seconds < 10) this.s = '0' + this.seconds;
        else this.s = this.seconds;

        this.timer.setText(`${this.m}:${this.s}`);
    }

    checkOver() {
        let over = true;

        //if there's still a card that isnt fully rested, 
        //the party wont have any penalty for oversleeping
        for(let c of this.player.deck) {
            if(c.energy < 5) {
                over = false;
                break;
            }
        }

        //otherwise the longer you leave the cards at full energy the more they lose joy
        if(over) {
            for(let c of this.player.deck) {
                c.joy--;
                if(c.joy < 0) c.joy = 0;
            }
            console.log('cards left over!!!');
            this.player.text.setText('YOUR PARTY IS ALREADY FULL OF ENERGY AND IS GETTING BORED WAITING FOR YOU.');
        }
        else this.raiseRest();
    }

    raiseRest() {
        for(let c of this.player.deck) {
            if(c.energy < 5) c.energy++;
            if(c.joy < 5) c.joy++;
        }
        this.player.text.setText('YOUR PARTY FEELS A LITTLE MORE RESTED.');
    }

    //remove scene specific UI
    UIremove() {
        clearInterval(this.interv);

        this.tweens.add({
            targets: [this.timer, this.zzz],
            alpha: 0,
            duration: 100
        });
        this.timer.destroy();
        this.zzz.destroy();
    }
}