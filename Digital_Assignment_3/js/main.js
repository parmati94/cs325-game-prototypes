import "./phaser.js";

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1280,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 150 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player1, player2;
var platforms;
var cursors;
var gameOver = false;
var p1turn = true;
var p2turn = true;
var hp1 = 100;
var hp2 = 100;
var hptext1, hptext2;
var background;
var monsterintro, spongeintro;
var spongehit1, monsterhit1;
var hit;
var heal, defend;
var spongedefend = false;
var monsterdefend = false;
var spongedamage, monsterdamage;
var spongescream, monsterscream;
var monsterheal, spongeheal;



var game = new Phaser.Game(config);

function preload ()
{
    this.load.audio('music', ['assets/pirate.mp3']);   
    this.load.audio('spongehit1', ['assets/spongehit1.mp3']);
    this.load.audio('monsterhit1', ['assets/monsterhit1.mp3']);
    this.load.audio('spongeintro', ['assets/spongeintro.mp3']);
    this.load.audio('monsterintro', ['assets/monsterintro.mp3']);
    this.load.audio('hit', ['assets/hit.mp3']);
    this.load.audio('heal', ['assets/heal.wav']);
    this.load.audio('defend', ['assets/defend.wav']);
    this.load.audio('spongescream', ['assets/spongescream.mp3']);
    this.load.audio('monsterscream', ['assets/monsterintro.mp3']);

    this.load.image('ground', 'assets/invplatform.png');
    this.load.image('bg', 'assets/stage.png');
    this.load.image('spongebutton', 'assets/sponge_attack_button.png');
    this.load.image('monsterbutton', 'assets/monster_attack_button.png');
    this.load.image('spongedefendbutton', 'assets/sponge_defend_button.png');
    this.load.image('monsterdefendbutton', 'assets/monster_defend_button.png');
    this.load.image('spongehealbutton', 'assets/sponge_heal_button.png');
    this.load.image('monsterhealbutton', 'assets/monster_heal_button.png');
    this.load.image('test', 'assets/test.png');
    this.load.spritesheet('sponge', 'assets/spongebob.png', { frameWidth: 450, frameHeight: 580 });
    this.load.spritesheet('monster', 'assets/monster.png', { frameWidth: 450, frameHeight: 583 });


}

function create ()
{
    
    this.add.image(640, 400, 'bg');
    this.spongebutton = this.add.image(190, 750, 'spongebutton');
    this.monsterbutton = this.add.image(980, 750, 'monsterbutton');
    this.spongedefendbutton = this.add.image(400, 700, 'spongedefendbutton');
    this.monsterdefendbutton = this.add.image(795, 700, 'monsterdefendbutton');
    this.spongehealbutton = this.add.image(65, 700, 'spongehealbutton');
    this.monsterhealbutton = this.add.image(1185, 700, 'monsterhealbutton');

    this.spongebutton.setInteractive();
    this.monsterbutton.setInteractive();
    this.spongedefendbutton.setInteractive();
    this.monsterdefendbutton.setInteractive();
    this.spongehealbutton.setInteractive();
    this.monsterhealbutton.setInteractive();

    background = this.sound.add('music');
    monsterintro = this.sound.add('monsterintro');
    spongeintro = this.sound.add('spongeintro');
    hit = this.sound.add('hit');
    spongehit1 = this.sound.add('spongehit1');
    monsterhit1 = this.sound.add('monsterhit1');
    heal = this.sound.add('heal');
    defend = this.sound.add('defend');
    spongescream = this.sound.add('spongescream');
    monsterscream = this.sound.add('monsterscream');

    background.setVolume(0.3);

    background.play();
    spongeintro.play();
    monsterintro.play();

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(640, 825, 'ground').setScale(2).refreshBody();


    // The player and its settings
    player1 = this.physics.add.sprite(335, 0, 'sponge');
    player2 = this.physics.add.sprite(1000, 0, 'monster');

    //  Player physics properties. Give the little guy a slight bounce.
    player1.setBounce(0.5);
    //player1.setCollideWorldBounds(true);
    player2.setBounce(0.5);
    //player2.setCollideWorldBounds(true);


    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    

    //  The score
    hptext1 = this.add.text(200, 50, 'HP: ' + hp1, { fontSize: '32px', fill: '#fffd00', fontFamily: 'Akaya Kanadaka'  });
    hptext2 = this.add.text(900, 50, 'HP: ' + hp2, { fontSize: '32px', fill: '#db0000', fontFamily: 'Akaya Kanadaka' });
    spongedamage = this.add.text( 375, 85, '',{ fontSize: '45px', fill: '#db0000', 
    fontFamily: 'Akaya Kanadaka'
    });
    monsterdamage = this.add.text( 775, 100, '',{ fontSize: '45px', fill: '#db0000',
    fontFamily: 'Akaya Kanadaka'
    });
    spongeheal = this.add.text( 375, 85, '',{ fontSize: '45px', fill: '#48f611', 
    fontFamily: 'Akaya Kanadaka'
    });
    monsterheal = this.add.text( 775, 100, '',{ fontSize: '45px', fill: '#48f611',
    fontFamily: 'Akaya Kanadaka'
    });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player1, platforms);
    this.physics.add.collider(player2, platforms);
    
    
    
    

    
        this.spongebutton.on( 'pointerdown', function( pointer ) {
            if (p1turn){
                this.scene.cameras.main.shake(100);
                spongeClick();    
            }
            });
    
    
        this.monsterbutton.on( 'pointerdown', function( pointer ) {
            if (p2turn){
                this.scene.cameras.main.shake(100);
                monsterClick();
            }
            });

        this.spongedefendbutton.on( 'pointerdown', function( pointer ) {
            if (p1turn){
                    this.scene.cameras.main.shake(100);
                    spongeDefendClick();
            }
            });
        
        
        this.monsterdefendbutton.on( 'pointerdown', function( pointer ) {
            if (p2turn){
                    this.scene.cameras.main.shake(100);
                    monsterDefendClick();
            }
            });

        this.spongehealbutton.on( 'pointerdown', function( pointer ) {
            if (p1turn){
                this.scene.cameras.main.shake(100);
                spongeHealClick();
            }
            });
            
            
        this.monsterhealbutton.on( 'pointerdown', function( pointer ) {
            if (p2turn){
                this.scene.cameras.main.shake(100);
                monsterHealClick();
            }
            });

    
    
}

function update ()
{
    

    
}




function spongeClick(){
    spongehit1.play();
    hit.play();

    var rand = Math.floor((Math.random() * 20) + 1);
    var halved = rand/2;
    spongedamage.setText('');
    monsterheal.setText('');
    var zero = false;
    var prehp = hp2;

    if (hp2 - rand <= 0){
        zero = true;
        hp2 = 0;
        rand = prehp - hp2;
        monsterdamage.setText('-' + (rand));
        hptext2.setText('HP: ' + hp2);
        monsterDeath();
        gameOver = true;
        
    }

    if (!monsterdefend && !zero){
        hp2 -= rand;
        monsterdamage.setText('-' + rand);
    }
    else if (monsterdefend && !zero){
        hp2 -= (halved);
        monsterdamage.setText('-' + halved);
    }

    hptext2.setText('HP: ' + hp2);


    if(monsterdefend)
        monsterdefend = false;
    

    p1turn = false;
    p2turn = true;

    
}

function monsterClick(){
    monsterhit1.play();
    hit.play();


    var rand = Math.floor((Math.random() * 20) + 1);
    var halved = rand/2;
    monsterdamage.setText('');
    spongeheal.setText('');
    var zero = false;
    var prehp = hp1;

    if (hp1 - rand <= 0){
        zero = true;
        hp1 = 0;
        rand = prehp - hp1;
        spongedamage.setText('-' + rand);
        hptext1.setText('HP: ' + hp1);
        spongeDeath();
        gameOver = true;
    }

    if (!spongedefend && !zero){
        hp1 -= rand;
        spongedamage.setText('-' + rand);
    }
    else if (spongedefend && !zero){
        hp1 -= (halved);
        spongedamage.setText('-' + halved);
    }

    hptext1.setText('HP: ' + hp1);

    

    if(spongedefend)
        spongedefend = false;
    

    p2turn = false;
    p1turn = true;
    
}

function spongeDefendClick(){
    defend.play();

    spongedefend = true;
    monsterdamage.setText('');
    monsterheal.setText('');
    spongedamage.setText('DEFENSE MODE');

    if (monsterdefend)
        monsterdefend = false;
    

    p1turn = false;
    p2turn = true;
}

function monsterDefendClick(){
    defend.play();

    monsterdefend = true; 
    spongedamage.setText('');
    spongeheal.setText('');
    monsterdamage.setText('DEFENSE MODE');

    if(spongedefend)
        spongedefend = false;
    
    
    p2turn = false;
    p1turn = true;
}

function spongeHealClick(){
    heal.play();

    var rand = Math.floor((Math.random() * 12) + 1);
    monsterdamage.setText('');
    spongedamage.setText('');
    monsterheal.setText('');
    var prehp = hp1;

    if (hp1 + rand <= 100)
        hp1 += rand;   
    else{
        hp1 = 100;
        rand = hp2 - prehp;
    }

    hptext1.setText('HP: ' + hp1);

    spongeheal.setText('+' + rand, { fill: '#3fe20b'});
    
    if (monsterdefend)
        monsterdefend = false;
    
    
    p1turn = false;
    p2turn = true;
}

function monsterHealClick(){
    heal.play();

    var rand = Math.floor((Math.random() * 12) + 1);
    monsterdamage.setText('');
    spongedamage.setText('');
    spongeheal.setText('');
    var prehp = hp2;

    if (hp2 + rand <= 100)
        hp2 += rand;   
    else{
        hp2 = 100;
        rand = hp2 - prehp;
    }

    hptext2.setText('HP: ' + hp2);

    monsterheal.setText('+' + rand);

    if (spongedefend)
        spongedefend = false;
    
    
    p2turn = false;
    p1turn = true;
}


function spongeDeath () {
    player1.setTint(0xff0000);
    spongescream.play();
    background.stop();
    player1.y += 30;
    this.physics.pause;   
  }

function monsterDeath() {
    player2.setTint(0xff0000);
    monsterscream.play();
    background.stop();
    player2.y += 30;
    this.physics.pause;  
}




