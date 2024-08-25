//sets up the UI for the game, and is always open. every other scene will be launched alongside this one
class Play extends Phaser.Scene {
    constructor() {
        super({
            key: 'play'
        });

        //all cards information
        this.cardData = [
        {
            name: 'saki',
            hp: 2,
            atk: 4, 
            ability: `YOUR OTHER CARDS WILL ALWAYS RETAIN HAPPINESS AS LONG AS THIS CARD IS ALIVE.`
        },
        {
            name: 'emu',
            hp: 5,
            atk: 6, 
            ability: `HIGH STATS, BUT GETS HUNGRY QUICKLY. IT WILL CANNIBALIZE OTHER PARTY MEMBERS IF IT HAS TO.`
        },
        {
            name: 'kasa',
            hp: 5,
            atk: 4, 
            ability: `WILL DOUBLE FOOD / REST REWARDS, BUT IF IT IS LOW ON HAPPINESS EVEN ONCE, IT WILL KILL ITSELF.`
        },
        {
            name: 'nene',
            hp: 4,
            atk: 4, 
            ability: `NOTHING SPECIAL ABOUT THIS ONE. JUST KEEP IT HAPPY AND WELL-FED.`
        },
        {
            name: 'rui',
            hp: 3,
            atk: 8, 
            ability: `DEALS MASSIVE DAMAGE, BUT HAS A CHANCE TO ALSO HURT ALLIES.`
        },
        {
            name: 'kana',
            hp: 2,
            atk: 5, 
            ability: `EXTREMELY RESILIENT, WILL SURVIVE LOW HUNGER / EXHAUSTION, BUT VERY LOW DEFAULT HEALTH.`
        },
        {
            name: 'mafu',
            hp: 5,
            atk: 4,
            ability: `CAN KEEP FIGHTING AT LOW HAPPINESS, BUT DRAINS FAST IN EXHAUSTION.`
        },
        {
            name: 'mizu',
            hp: 4,
            atk: 5,
            ability: `DOUBLES TIME TO REST FROM EXHAUSTION, BUT DOUBLES FOOD REWARDS.`
        }
        ];

        this.enemyData = [
            {
                name: 'bear',
                hp: 14,
                x: 40,
                y: 40
            },
            {
                name: 'dodo',
                hp: 34,
                x: 45,
                y: 64
            },
            {
                name: 'horse',
                hp: 38,
                x: 55,
                y: 72
            },
            {
                name: 'clock',
                hp: 45,
                x: 65,
                y: 95
            },
            {
                name: 'crusher',
                hp: 55,
                x: 45,
                y: 75
            },
            {
                name: 'mage',
                hp: 70,
                x: 45,
                y: 40
            }
        ]
    }

    create() {
        //create player
        this.player = new Player(this);

        //create description box
        this.player.createTextbox();

        //create all existing cards in the game
        for(let data of this.cardData) {
            const card = new Card(data, this);
            card.createContainer();
            this.player.allCards.push(card);
        }

        //create all existing enemies in the game
        for(let data of this.enemyData) {
            const enemy = new Enemy(data);
            this.player.allEnemies.push(enemy);
        }
        
        //lower all cards scale
        for(let card of this.player.allCards) card.container.setScale(0.7);

        //testing
        console.log(this.player.allCards);
        console.log(this.player.allEnemies);

        this.startGame();
    }

    startGame() {
        this.scene.launch('select', this.player);
    }
} 