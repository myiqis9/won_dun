//class that contains all player information that will remain consistent and passed along through scenes
class Player {
    constructor(scene) {
        //scene param
        this.scene = scene;

        //player's card inventory, the deck
        this.deck = [];

        //player's starting amount of coins
        this.coins = 10;

        //can player interact with game?
        this.canInteract = false;

        //are we currently in the tutorial/first scene?
        this.tutorial = true;
        
        //how many battles has the player gone through? / level count
        this.round = 0;

        //how many choices does the player have in the shop? / reset every battle
        this.selection = 2;

        //deck of all cards in the game
        this.allCards = [];

        //list of all enemies
        this.allEnemies = [];

        //does the player have saki in their party?
        //relevant because of saki's ability towards all cards
        this.hasSaki = false;
        
        //textbox
        this.textbox = null;

        //textbox text
        this.text;

        //parameters for button text
        this.param1 = {
            fontFamily: 'pstart',
            fontSize: 15,
            color: '#548087'
        };

        this.param2 = {
            fontFamily: 'pstart',
            fontSize: 11,
            color: '#548087'
        };

        //back button that will be consistent throughout many scenes
        this.backBtn;
    }
    
    createTextbox() {
        let txtImg = this.scene.add.image(0, 0, 'textbox');

        this.text = this.scene.add.text(-180, -65, `PICK A STARTER CARD.`, {
            fontFamily: 'pstart',
            fontSize: 13,
            color: '#548087',
            align: 'left',
            lineSpacing: 10,
            wordWrap: { width: 374 }
        });

        this.textbox = this.scene.add.container(this.scene.game.config.width/2+80, 400, [txtImg, this.text]);
        this.textbox.setScale(0.9);
    }

    //sort the player's deck display
    sortDeck() {
        let xDist = 80;
        let depth = 1;

        for(let card of this.deck) {
            card.container.depth = depth;
            this.scene.tweens.add({
                targets: card.container,
                    x: xDist,
                    y: 400,
                    duration: 200
            });
            xDist += 60;
            depth++;
        }
    }

    //for feed, upgrade and rest scenes, cards get displayed evenly differently in the middle
    //depending on how many cards are in your deck
    //for exhaustion/hunger death, this only displays the cards about to die
    displayCards(deck) {
        let xPoint = 0;
        
        //determine where first card would display (x) depending on amount of cards
        if(deck.length == 1) xPoint = this.scene.game.config.width/2;
        if(deck.length == 2) xPoint = this.scene.game.config.width/2-75;
        if(deck.length == 3) xPoint = this.scene.game.config.width/2-150;

        //place cards in center
        for(let card of deck) {
            this.scene.tweens.add({
                targets: card.container,
                    x: xPoint,
                    y: 175,
                    duration: 200
            });
            xPoint += 150;
        }
    }

    healAll() {
        for(let card of this.deck) {
            card.hp = card.maxhp;
            card.updateValues();
        }
    }

    //default interaction across all shop screens (except card select)
    //in which hovering over a card shows its stats
    defaultInteractions() {
        for(let card of this.deck) {
            card.container.on('pointerover', () => { 
                this.text.setText(card.stats());
            });

             card.container.on('pointerout', () => { 
                this.text.setText('');
            });
        }
    }

    //reset card interactions at the end of each scene, 
    //so they don't intervene with another interaction
    removeInteractions() {
        for(let card of this.deck) {
            console.log(`${card.name} off`);
            card.container.off('pointerdown');
            card.container.off('pointerover');
            card.container.off('pointerout');
        }
    }

    backToShop(sc) {
        let btnbg = sc.add.image(0, 0, 'button');
        let btntxt1 = sc.add.text(0, -10, 'RETURN', this.param1).setOrigin(0.5);
        let btntxt2 = sc.add.text(0, 15, 'BACK TO SHOP?', this.param2).setOrigin(0.5);

        this.backBtn = sc.add.container(125, 400, [btnbg, btntxt1, btntxt2]).setAlpha(0);
        this.backBtn.setScale(0.9);

        //make button interactive
        this.backBtn.setSize(174, 74); //interaction box
        this.backBtn.setInteractive(); //makes them able to interact

        //hovering tints container
        this.backBtn.on('pointerover', () => {
            if(this.canInteract) {
                btnbg.setTint(0x87adb3);
                btntxt1.setTint(0x87adb3);
                btntxt2.setTint(0x87adb3);
            }
        });

        //cancel hover
        this.backBtn.on('pointerout', () => {
            if(this.canInteract) {
                btnbg.clearTint();
                btntxt1.clearTint();
                btntxt2.clearTint();
            }
        });

        //clicking returns to shop
        this.backBtn.on('pointerdown', () => {
            if(this.canInteract) {
                this.backPressed(sc);
            }
        });

        //make button appear
        sc.tweens.add({
            targets: this.backBtn,
            alpha: 1,
            duration: 150
        });
    }

    backPressed(sc) {
        this.canInteract = false;
        this.removeInteractions();
        this.text.setText('');
        sc.UIremove();

        sc.tweens.add({
            targets: this.backBtn,
            alpha: 0,
            duration: 100
        });
        this.backBtn.destroy();

        //put deck back at the bottom, remove 1 select
        this.sortDeck();
        this.selection--;

        //back to shop scene
        setTimeout(() => {
            sc.scene.start('shop', sc.player);
        }, 400);
    }

    //individual skills and special events for each card 
    //will be contained down below!!!!!

    //after the battle, if she is at 0 hunger, she will instead kill and 'eat' another party member
    //(if there are other party members). this raises her hunger back to 5 :)
    emu() {
        
    }

    //has a 30% chance to also cause damage a random party member every time it attacks
    rui() {
        
    }

    //at any point where it reaches 0 happiness, it will just die
    kasa() {
        
    }
}