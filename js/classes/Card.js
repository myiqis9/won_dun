class Card {
    constructor(data, scene) {
        //card information
        this.scene = scene;
        this.name = data.name;
        this.hp = data.hp;
        this.maxhp = data.hp;
        this.atk = data.atk;
        this.ability = data.ability;
        
        //stuff for display
        this.container = null;
        this.hpTxt = null;
        this.atkTxt = null;
        this.description = `HP: ${this.hp} ATK: ${this.atk} \n${this.ability}`;

        //wellness stats
        this.joy = 5;
        this.hunger = 5;
        this.energy = 5;
    }

    //create the container for the card
    createContainer() {
        //parameters for text on card
        const param = {
            fontFamily: 'pstart',
            fontSize: 32,
            color: '#548087'
        }

        //separate values for hp and atk text, since we're going to access these later on
        this.hpTxt = this.scene.add.text(-75, 55, this.hp, param);
        this.atkTxt = this.scene.add.text(45, 55, this.atk, param);

        //create container that has everything in the card
        this.container = this.scene.add.container(this.scene.game.config.width/2-150, -200, [this.scene.add.image(0, 0, 'bg'), this.scene.add.image(0, 0, this.name),
        this.hpTxt, this.atkTxt]);

        this.container.setSize(165, 177); //interaction box
        this.container.setInteractive(); //makes them able to interact
    }

    stats() {
        return `JOY: ${this.joy} HUNGER: ${this.hunger} ENERGY: ${this.energy} \n${this.ability}`;
    }

    //updates HP/ATK values on the card display
    updateValues() {
        this.hpTxt.setText(this.hp);
        this.atkTxt.setText(this.atk);
    }

    //damage taken in battle
    //needs player param for damage amount and hasSaki
    takeDamage(player) {
        //loses health depending on which round it is, as enemies deal incrementally more damage
        let dmg;
        switch(player.round) {
            case 0: case 1: dmg = 1;
            break;
            case 2: case 3: case 4: case 5: dmg = 2;
            break;
        }

        this.hp -= dmg;
        if(this.hp < 0) this.hp = 0;
        this.updateValues();

        //has a 80% chance to lose happiness every time it's hit
        let lose = Phaser.Math.Between(1, 10);
        console.log(`joy randomizer: ${lose}`);
        if(lose > 2) this.lowerJoy(player.hasSaki);
    }

    //lower card's joy. this will always take param player.hasSaki when it's called
    //because saki makes all cards in party never reach minimum joy
    lowerJoy(saki) {
        if(saki) {
            console.log('has saki!');
            if(this.joy > 1) this.joy--;
        }
        else {
            if(this.joy > 0) this.joy--;
        }
    }

    //checks happiness 
    isHappy() {
        if(this.joy == 0 && this.name !== 'mafu') {
            //has a 70% chance to refuse to fight
            let lose = Phaser.Math.Between(1, 10);
            console.log(`will it attack? ${lose}`);
            if(lose > 3) return false;
            else return true;
        }
        else return true;
    }

    //check exhaustion & hunger
    //if a card is at 0 hunger or 0 exhaustion, it was a 50% chance of dying at the end of each battle.
    //if both stats are at 0, it becomes a 90% chance!
    willLive() {
        let die = 0;
        if(this.hunger == 0 && this.energy == 0) die = 9;
        else if(this.hunger == 0 || this.energy == 0) die = 5;

        let live = Phaser.Math.Between(1, 10);
        console.log(`${this.name} live: ${live} (>) die: ${die}`);

        if(this.name == 'kana') return true; //kana's ability is resilience, she always survives
        else if(live > die) return true;
        else return false;
    }
}