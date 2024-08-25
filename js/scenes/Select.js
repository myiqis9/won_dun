//card selection scene
class Select extends Phaser.Scene {
    constructor() {
        super({
            key: 'select'
        });
    }

    //grab player info
    init(data) {
        this.player = data;
    }

    create() {
        this.getCardSelection();
    }

    //create selection from all cards
    getCardSelection() {
        //shuffle all cards
        Phaser.Utils.Array.Shuffle(this.player.allCards);

        //grab first 3 as the starters
        this.cardSelection = [this.player.allCards[0], this.player.allCards[1], this.player.allCards[2]];
        console.log(this.cardSelection);

        //card animation
        this.cardAppear(this.cardSelection);

        //interactivity with the starter cards
        for(let card of this.cardSelection) {

            //hovering shows card desc
            card.container.on('pointerover', () => {
                if(this.player.canInteract) {
                    console.log(card.name);
                    this.player.text.setText(card.description);
                }
            });

            //cancel hover
            card.container.on('pointerout', () => {
                if(this.player.canInteract) this.player.text.setText('');
            });

            //click on card
            card.container.on('pointerdown', () => {
                if(this.player.canInteract) this.addCard(card);
            });
        }
    }

    //animation that makes the selected cards show on screen
    cardAppear(cards) {
        //update the x position for the cards
        cards[0].container.x = this.game.config.width/2-150;
        cards[1].container.x = this.game.config.width/2;
        cards[2].container.x = this.game.config.width/2+150;

        //tween the cards to appear from out of bounds in order (chain)
        this.tweens.chain({
            tweens: [
                {
                    targets: cards[0].container,
                    y: 200,
                    duration: 200
                },
                {
                    targets: cards[1].container,
                    y: 200,
                    duration: 200
                },
                {
                    targets: cards[2].container,
                    y: 200,
                    duration: 200,
                    onComplete: () => {
                        //the player can now interact with cards
                        this.player.canInteract = true;
                    }
                }
            ]
        });
    }

    addCard(card) {
        console.log('adding card');
        this.canInteract = false;

        for(let c of this.cardSelection) {
            //remove event listeners of the cards from this scene
            //I can't use the player one here, it has to include the selection
            c.container.off('pointerover');
            c.container.off('pointerout');
            c.container.off('pointerdown');
        }

        //removes added card from the cardSelection list to enable tween below
        //and from allCards so that it doesn't get rolled again in the future.
        let i1 = this.cardSelection.indexOf(card);
        this.cardSelection.splice(i1, 1);
        let i2 = this.player.allCards.indexOf(card);
        this.player.allCards.splice(i2, 1);

        //add card to player deck
        this.player.deck.push(card);

        //if its saki, then set hasSaki to true
        //saki also makes all your party forever happy, so set all minimum joy to 1
        if(card.name === 'saki') {
            this.player.hasSaki = true;
            for(let c of this.player.deck) {
                if(c.joy == 0) c.joy = 1;
            }
        }

        //more tweening animations
        this.tweens.add({
            //other two cards go back oob
            targets: [this.cardSelection[0].container, this.cardSelection[1].container],
            y: -200,
            duration: 200,
            onComplete: () => { 
                this.player.sortDeck();
                this.changeScenes();
            }
        });
    }

    //change scene to battle
    changeScenes() {
        this.player.canInteract = false;
        this.player.text.setText('');

        setTimeout(() => {
            if(this.player.tutorial) this.scene.start('battle', this.player);
            else {
                this.player.selection--;
                this.scene.start('shop', this.player);
            }
        }, 500);
    }
}
