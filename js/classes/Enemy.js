class Enemy {
    constructor(data) {
        this.name = data.name;
        this.hp = data.hp;
        this.txtX = data.x;
        this.txtY = data.y;

        this.container = null;
        this.hpTxt = null;
        this.died = false;
        this.overkill = 0;
    }

    createContainer(scene) {
        //parameters for text on card
        const param = {
            fontFamily: 'pstart',
            fontSize: 37,
            color: '#548087',
            stroke: '#d3dcdd',
            strokeThickness: 5
        }

        //separate values for hp and atk text, since we're going to access these later on
        this.hpTxt = scene.add.text(this.txtX, this.txtY, this.hp, param);

        //create container that has everything in the card
        this.container = scene.add.container(scene.game.config.width+200, 160, [scene.add.image(0, 0, this.name), this.hpTxt]);
        this.container.setScale(0.9);
    }

    //updates HP value on the card display
    updateValues() {
        this.hpTxt.setText(this.hp);
    }

    takeDamage(dmg) {
        this.hp -= dmg;
        if(this.hp <= 0) {
            //first checks for overkill damage to convert it to extra coins
            if(this.hp < 0) {
                this.overkill = (this.hp * -1); //sets overkill dmg to positive value
            }
            this.hp = 0;
            this.died = true;
        }
        this.updateValues();
    }
}