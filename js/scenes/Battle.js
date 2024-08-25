//battle scene
class Battle extends Phaser.Scene {
    constructor() {
        super({
            key: 'battle'
        });

        this.enemy = null;

        //how many moves player has each round
        this.moves = 2;
    }

    //grab player info
    init(data) {
        this.player = data;
    }

    create() {
        console.log('this is the battle scene!');

        //set the first character in the player deck as the active character by default
        this.active = this.player.deck[0]; 

        //grab active monster
        this.enemy = this.player.allEnemies[this.player.round];
        this.enemy.createContainer(this);

        //starter text when battle loads
        if(this.player.tutorial) this.player.text.setText(`NOW, ONTO BATTLE!`);
        else this.player.text.setText(`YOUR PARTY RUNS INTO AN ENEMY ${this.enemy.name.toUpperCase()}!`);

        setTimeout(() => {
            this.startBattle();
        }, 1000);
    }

    startBattle() {
        console.log(`active card: ${this.active.name}`);

        this.tweens.chain({
            tweens: [
                {
                    //move active card to active slot
                    targets: this.active.container,
                    x: this.game.config.width/2-156,
                    y: 160,
                    duration: 200
                },
                {
                    //move enemy into view
                    targets: this.enemy.container,
                    x: this.game.config.width/2+100,
                    duration: 1000,
                    onComplete: () => { this.battleMenu() }
                }
            ]
        });
    }

    battleMenu() {
        console.log('battle starts');
        this.player.canInteract = true;
        this.updateText(); 
        this.setCardInteraction();
    }

    setCardInteraction() {
        for(let card of this.player.deck) {
            //reset existing interaction
            card.container.off('pointerdown');

            if(card == this.active) {
                //click on active card to attack
                card.container.on('pointerdown', () => {
                    if(this.player.canInteract) this.checkAtk();
                });
            }
            else {
                //click on other cards in deck, to swap
                card.container.on('pointerdown', () => {
                    if(this.player.canInteract) this.swap(card);
                });
            }
        }
    }

    //checks card's joy first, as it has a chance to refuse to attack
    checkAtk() {
        if(this.active.isHappy()) this.attack();
        else this.refuse();
    }

    //active attacks enemy
    attack() {
        console.log('player attacking!');

        //player can't interact during animations
        this.player.canInteract = false;

        //remove move count, and set attack text
        this.moves--;
        this.player.text.setText(`YOU DEAL ${this.active.atk} DAMAGE!`);

        //animations: card reaches forward and attacks, on complete this does damage
        //monster shakes a bit. then active card goes back into position
        this.tweens.chain({
            tweens: [
                {
                    targets: this.active.container,
                    x: '+=30',
                    duration: 70,
                    onComplete: () => { 
                        this.enemy.takeDamage(this.active.atk);
                    }
                },
                {
                    targets: this.enemy.container,
                    x: '-=5',
                    ease: 'Quintic.easeInOut',
                    duration: 30
                },
                {
                    targets: this.enemy.container,
                    x: '+=20',
                    ease: 'Quintic.easeInOut',
                    duration: 70, 
                    yoyo: true,
                    repeat: 1
                },
                {
                    targets: this.enemy.container,
                    x: '+=5',
                    ease: 'Quintic.easeInOut',
                    duration: 30
                },
                {
                    targets: this.active.container,
                    x: '-=30',
                    duration: 100,
                    onComplete: () => {
                        //if enemy died then go to win scenario, else enemy attacks back
                        if(this.enemy.died) this.enemyDefeated();
                        else setTimeout(() => { this.checkMoves(); }, 200);
                    }
                }
            ]
        });
    }

    //card refuses to fight
    refuse() {
        //player can't interact during animations
        this.player.canInteract = false;

        //remove move count, and set text
        this.moves--;
        this.player.text.setText(`${this.active.name.toUpperCase()} IS TOO SCARED. IT REFUSES TO FIGHT!`);

        //little scared animation
        this.tweens.chain({
            tweens: [
                {
                    targets: this.active.container,
                    x: '-=30',
                    ease: 'Quintic.easeInOut',
                    duration: 90
                },
                {
                    targets: this.active.container,
                    x: '+=30',
                    ease: 'Quintic.easeInOut',
                    delay: 800,
                    duration: 70,
                    onComplete: () => { this.checkMoves(); }
                }
            ]
        });
    }

    attacked() {
        console.log('enemy attacking!');
        this.player.text.setText(`THE ENEMY STRIKES BACK!`);

        //animations: same thing as above but the enemy's the one attacking now
        this.tweens.chain({
            tweens: [
                {
                    targets: this.enemy.container,
                    x: '-=25',
                    duration: 70,
                    onComplete: () => { this.active.takeDamage(this.player) }
                },
                {
                    targets: this.active.container,
                    x: '-=5',
                    ease: 'Quintic.easeInOut',
                    duration: 30
                },
                {
                    targets: this.active.container,
                    x: '+=15',
                    ease: 'Quintic.easeInOut',
                    duration: 70, 
                    yoyo: true,
                    repeat: 1
                },
                {
                    targets: this.active.container,
                    x: '+=5',
                    ease: 'Quintic.easeInOut',
                    duration: 30
                },
                {
                    targets: this.enemy.container,
                    x: '+=25',
                    duration: 100,
                    onComplete: () => {
                        //if active card died then call function, else reset new turn
                        if(this.active.hp <= 0) this.activeDied();
                        else {
                            this.moves = 2;
                            this.reset();
                        }
                    }
                }
            ]
        });
    }

    //check if player has moves left in their turn, otherwise it's the enemy's turn to attack
    checkMoves() {
        if(this.moves > 0) this.reset();
        else this.attacked(); 
    }

    //reset interaction & text
    reset() {
        //player can interact again now
        this.updateText();
        this.player.canInteract = true;
    }

    //swap active card
    swap(card) {
        this.player.text.setText(`ENOUGH, ${this.active.name.toUpperCase()}! COME FORTH, ${card.name.toUpperCase()}!`);
        this.player.canInteract = false;

        let temp = card;

        //change active to swapped card's position and swapped card to active
        this.player.deck[this.player.deck.indexOf(card)] = this.active;
        this.player.deck[0] = temp;
        this.active = temp;

        //sort deck again
        this.player.sortDeck();

        //move active card to active slot
        setTimeout(() => {
            this.tweens.add({
                //move active card to active slot
                targets: this.active.container,
                x: this.game.config.width/2-156,
                y: 160,
                duration: 200,
                onComplete: () => {
                    //reset card interactions && use up move
                    this.setCardInteraction();
                    this.moves--;
                    this.checkMoves();
                }
            });
        }, 500);
    }

    //enemy death animation
    enemyDefeated() {
        this.player.text.setText(`YOU HAVE DEFEATED THE ENEMY! \nYOU'VE GAINED ${this.bounty()} COINS.`);
        this.tweens.add({
            targets: this.enemy.container,
            y: 210,
            alpha: 0,
            ease: 'Quintic.easeOut',
            duration: 800,
            onComplete: () => {
                this.cardsLoseStamina();
            }
        });
    }

    //gain coins at the end of each battle
    bounty() {
        let reward = 0;

        //gain set amount of coins each round. overkill dmg transfers into bonus coins
        switch(this.player.round) {
            case 0: reward = 0;
            break;
            case 1: reward = 3;
            break;
            case 2: reward = 5;
            break;
            case 3: reward = 6;
            break;
            case 4: reward = 7;
            break;
        }
        console.log(`reward ${reward} + overkill ${this.enemy.overkill}`);
        reward += this.enemy.overkill;
        this.player.coins += reward;
        return reward;
    }

    activeDied() {
        //died in battle
        this.player.text.setText(`OH NO! ${this.active.name.toUpperCase()} DIED IN COMBAT!`);
        this.tweens.add({
            targets: this.active.container,
            y: 210,
            alpha: 0,
            ease: 'Quintic.easeOut',
            duration: 800,
            onComplete: () => {
                this.setNewActive();
            }
        });
    }

    setNewActive() {
        if(this.active.name === 'saki') this.player.hasSaki = false;
        this.active.container.destroy();
        this.player.deck.splice(0, 1);
        this.player.sortDeck();

        //since the sortDeck takes a bit of time, I need to let it finish first before playing this.
        setTimeout(() => {
            if(this.player.deck.length > 0) {
                //sets next first card in deck as new active
                this.active = this.player.deck[0]; 
                console.log(`setting ${this.active.name} as new active card`);
    
                this.tweens.add({
                    //move active card to active slot
                    targets: this.active.container,
                    x: this.game.config.width/2-156,
                    y: 160,
                    duration: 200,
                    onComplete: () => {
                        this.setCardInteraction();
                        this.moves = 2;
                        this.reset();
                    }
                });
            }
            else this.lost(); 
        }, 500);
    }

    //at the end of the battle, all cards lose hunger/energy stats accordingly
    //then it checks the possibility of them dying from said loss of stats
    cardsLoseStamina() {
        for(let card of this.player.deck) {
            card.hunger -= 2;
            card.energy -= 2;

            if(card.name === 'emu') card.hunger--; //emu gets hungry faster
            if(card.name === 'mafu') card.energy--; //mafu gets exhausted faster

            if(card.hunger < 0) card.hunger = 0;
            if(card.energy < 0) card.energy = 0;
        }
        this.battleComplete();
    }

    battleComplete() {
        //destroy current enemy to not take up space, sort player's deck and heal all cards
        this.enemy.container.destroy();
        this.player.sortDeck();
        this.player.healAll();
        this.moves = 2; //reset move count for next battle

        //remove all card interactions
        this.player.removeInteractions();
        this.player.canInteract = false;

        //check if won the game, otherwise continue to purgatory
        setTimeout(() => {
            if(this.player.round == 5) this.gameWon();
            else this.scene.start('purgatory', this.player);
        }, 300);
    }

    lost() {
        setTimeout(() => {
            this.player.text.setText(`YOU HAVE NO MORE CARDS TO PLAY! YOU HAVE LOST.`);
        }, 1000);
    }

    updateText() {
        this.menutxt = `JOY: ${this.active.joy} HUNGER: ${this.active.hunger} ENERGY: ${this.active.energy} \nYOU HAVE ${this.moves} MOVES LEFT.\n\nCLICK ON ACTIVE CARD TO ATTACK OR CLICK ON ANOTHER CARD TO SWAP.`;

        this.player.text.setText(this.menutxt);
    }

    gameWon() {
        this.player.text.setText(`YOU DID IT! YOU DEFEATED ALL THE FOES WHO STOOD IN YOUR WAY AND YOU WON!!!`);
        this.player.displayCards(this.player.deck);

        for(let card of this.player.deck) {
            //little happy animation
            this.tweens.add({
                delay: 300,
                targets: card.container,
                y: '-=40',
                duration: 80,
                yoyo: true,
                loop: 5
            });
        }
    }
}