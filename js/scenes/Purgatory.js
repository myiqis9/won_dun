//funny little in between scene that contains all scenarios in which cards can die outside of combat
class Purgatory extends Phaser.Scene {
    constructor() {
        super({
            key: 'purgatory'
        });

        this.deathnote = [];
    }

    //grab player info
    init(data) {
        this.player = data;
    }

    create() {
        //straight to the point
        this.lifeOrDeath();
    }

    //for each card in deck, roll to see if it's going to die this turn
    lifeOrDeath() {
        for(let c of this.player.deck) {
            //if its alive, do nothing
            if(c.willLive()) continue;
            //otherwise add it to the death list
            this.deathnote.push(c);
        }

        //start death animation
        //if all survive, simply move on without anything happening here
        if(this.deathnote.length > 0) this.deathTrial();
        else this.moveToShop();
    }

    deathTrial() {
        this.player.displayCards(this.deathnote);

        //text worded differently depending on how many cards are on death row
        let str;
        if(this.deathnote.length == 1) str = `${this.deathnote[0].name.toUpperCase()} HAS`;
        if(this.deathnote.length == 2) str = `${this.deathnote[0].name.toUpperCase()} AND ${this.deathnote[1].name.toUpperCase()} HAVE`;
        if(this.deathnote.length == 3) str = `${this.deathnote[0].name.toUpperCase()}, ${this.deathnote[1].name.toUpperCase()} AND ${this.deathnote[2].name.toUpperCase()} HAVE`;

        this.player.text.setText(`OH NO!!! \n${str} BEEN OVERWORKED IN BATTLE. DESPITE YOUR EFFORTS, THEY PERISHED NOT LONG AFTER.`);

        setTimeout(() => {
            this.anim();
        }, 500);
    }

    //dying animation
    anim() {
        //since I dont want it to pointlessly iterate through the array for each tween, 
        //but it specifically needs only the container, Im just throwing these in another temp array idk
        let anArray = [];
        for(let d of this.deathnote) anArray.push(d.container);

        this.tweens.chain({
            targets: anArray,
            tweens: [
                {
                    delay: 400,
                    x: '-=5',
                    ease: 'Quintic.easeInOut',
                    duration: 30
                },
                {
                    x: '+=15',
                    yoyo: true,
                    loop: 1,
                    ease: 'Quintic.easeInOut',
                    duration: 70
                },
                {
                    x: '+=5',
                    ease: 'Quintic.easeInOut',
                    duration: 30
                },
                {
                    delay: 50,
                    y: '+=50',
                    alpha: 0,
                    duration: 300,
                    onComplete: () => { this.removeFromDeck(); }
                }
            ]
        });
    }

    removeFromDeck() {
        this.player.text.setText(`MAKE SURE TO TAKE GOOD CARE OF YOUR PARTY NEXT TIME. FIGHTING WILL TAKE A TOLL ON THEM.`);

        //remove each card from death list from player deck
        for(let died of this.deathnote) {
            for(let c of this.player.deck) {
                if(died.name == c.name) {
                    console.log(`removed ${c.name}`);
                    c.container.destroy();
                    this.player.deck.splice(this.player.deck.indexOf(c), 1);
                }
            }
        }

        this.deathnote = []; //empty death array

        //if player has no more cards left, end here. otherwise go back to shop
        setTimeout(() => {
            if(this.player.deck.length > 0) this.moveToShop();
            else this.player.text.setText(`YOU HAVE NO MORE CARDS TO PLAY! YOU HAVE LOST.`);
        }, 1500);
    }

    moveToShop() {
        this.player.sortDeck();

        setTimeout(() => {
            this.scene.start('shop', this.player);
        }, 500);
    }
}