import "./phaser.js";

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
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

var player;
var pineapples, poweruppineapple;
var bombs;
var sky, sky2, sky3, sky4, sky5;
var platforms;
var cursors;
var score = 0;
var level = 1;
var gameOver = false;
var powerup = false;
var finalLevel = false;
var scoreText, levelText, powerupText, winText;
var background, pickup, jump, laugh, scream, yippee, powerupsound, removeplankton, cheering;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.audio('music', [
        'assets/pirate.mp3'
    ]);
    this.load.audio('pickup', [
        'assets/pickup.wav'
    ]);
    this.load.audio('jump', [
        'assets/jump.wav'
    ]);
    this.load.audio('laugh', [
        'assets/laugh.wav'
    ]);
    this.load.audio('scream', [
        'assets/scream.wav'
    ]);
    this.load.audio('yippee', [
        'assets/yippee.wav'
    ]);
    this.load.audio('powerupsound', [
        'assets/powerupsound.wav'
    ]);
    this.load.audio('removeplankton', [
        'assets/removeplankton.wav'
    ]);
    this.load.audio('cheering', [
        'assets/cheering.wav'
    ]);

    this.load.image('sky', 'assets1/bikini_bottom_crop.png');
    this.load.image('sky2', 'assets1/bikini_bottom_crop2.jpg');
    this.load.image('sky3', 'assets1/bikini_bottom_crop3.jpg');
    this.load.image('sky4', 'assets1/bikini_bottom_crop4.jpg');
    this.load.image('sky5', 'assets1/bikini_bottom_crop5.jpg');
    this.load.image('ground', 'assets1/platform.png');
    this.load.image('pineapple', 'assets/pineapplecut.png');
    this.load.image('poweruppineapple', 'assets/poweruppineapple.png');
    this.load.image('bomb', 'assets/planktoncut.png');
    this.load.spritesheet('sponge', 'assets/spritesheet5.png', { frameWidth: 37, frameHeight: 42 });

}

function create ()
{
    
    sky = this.add.image(400, 300, 'sky');
    sky2 = this.add.image(400, 300, 'sky2');
    sky3 = this.add.image(400, 300, 'sky3');
    sky4 = this.add.image(400, 300, 'sky4');
    sky5 = this.add.image(400, 300, 'sky5');
    sky2.setVisible(false);
    sky3.setVisible(false);
    sky4.setVisible(false);
    sky5.setVisible(false);
    
    

    background = this.sound.add('music');
    pickup = this.sound.add('pickup');
    jump = this.sound.add('jump');
    laugh = this.sound.add('laugh');
    scream = this.sound.add('scream');
    yippee = this.sound.add('yippee');
    powerupsound = this.sound.add('powerupsound');
    removeplankton = this.sound.add('removeplankton');
    cheering = this.sound.add('cheering');

    background.setVolume(0.4);
    pickup.setVolume(0.5);
    jump.setVolume(0.5);
    yippee.setVolume(0.5);
    scream.setVolume(0.5);
    background.play();

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    platforms.create(-75, 100, 'ground');

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'sponge');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('sponge', { start: 8, end: 10 }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'sponge', frame: 7 } ],
        frameRate: 10
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('sponge', { start: 0, end: 2 }),
        frameRate: 5,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    pineapples = this.physics.add.group({
        key: 'pineapple',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    pineapples.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();
    poweruppineapple = this.physics.add.group();

    //  The score
    scoreText = this.add.text(330, 550, 'Score: 0', { fontSize: '32px', fill: '#000', fontFamily: 'Akaya Telivigala' });
    levelText = this.add.text(660, 0, 'Level: '+level, { fontSize: '40px', fill: '#000', fontFamily: 'Akaya Telivigala' });
    powerupText = this.add.text(150, 10, 'POWER UP ACTIVATED ', { fontSize: '32px', fill: '#f53207', fontFamily: 'Akaya Telivigala' });
    winText = this.add.text(70, 200, 'YOU WIN! ', { fontSize: '150px', fill: '#f53207', fontFamily: 'Akaya Telivigala' });
    winText.setVisible(false);
    powerupText.setVisible(false);

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(pineapples, platforms);
    this.physics.add.collider(poweruppineapple, platforms);
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, pineapples, collectPineapple, null, this);
    this.physics.add.overlap(player, poweruppineapple, collectPowerup, null, this);

    
    //this.physics.add.overlap(player, pineapples, gameWin, null, this);
    

    this.physics.add.collider(player, bombs, hitBomb, null, this);

   
}

function update ()
{
    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        if (!powerup){
            player.setVelocityX(-160);
            player.anims.play('left', true);
        }
        else{
            player.setVelocityX(-320);
            player.anims.play('left', true);
        }
    }
    else if (cursors.right.isDown)
    {
        if (!powerup){
            player.setVelocityX(160);
            player.anims.play('right', true);
        }
        else{
            player.setVelocityX(320);
            player.anims.play('right', true);
        }
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        if (!powerup){
            jump.play();
            player.setVelocityY(-300);
        }
        else{
            jump.play();
            player.setVelocityY(-450); 
        }
    }

    if (cursors.down.isDown){
        if (!powerup){
            player.setVelocityY(300);
        }
        else{
            player.setVelocityY(450); 
        }
    }
}

function collectPineapple (player, pineapple)
{
    pineapple.disableBody(true, true);

    //  Add and update the score
    pickup.play();
    score += 10;
    scoreText.setText('Score: ' + score);

    var random = Math.floor((Math.random()*12) + 1);

    if (pineapples.countActive(true) === random){
        yippee.play(); 
    }

    if (score >= 200){
        scoreText.setVisible(false);
        scoreText = this.add.text(300, 545, 'Score: ' +score, { fontSize: '40px', color: '#05b0a8', fontFamily: 'Akaya Telivigala' })
    }

    if (score >= 500){
        scoreText.setVisible(false);
        scoreText = this.add.text(300, 545, 'Score: ' +score, { fontSize: '40px', color: '#c10bda', fontFamily: 'Akaya Telivigala' })
    }

    if (score >= 1000){
        scoreText.setVisible(false);
        scoreText = this.add.text(300, 545, 'Score: ' +score, { fontSize: '40px', color: '#ea0b23', fontFamily: 'Akaya Telivigala' })
    }


    if (pineapples.countActive(true) === 0 && !finalLevel)
    {
        laugh.play();
        newLevel();
        //  A new batch of stars to collect
        pineapples.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        if (level % 2 === 0){

        var powerup = poweruppineapple.create(x, 16, 'poweruppineapple');
        powerup.setBounce(1);
        powerup.setCollideWorldBounds(true);
        powerup.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }

        

    }

    
}

function collectPowerup(player, poweruppineapple){
    
    
    powerupsound.play();
    poweruppineapple.disableBody(true, true);
    powerup = true;
    powerupText.setVisible(true);

    if (level === 10){
        powerupText.setVisible(false);
        gameWin();
    }
    
    setTimeout(() => { powerup = false}, 6000);
    setTimeout(() => { powerupText.setVisible(false);}, 6000);

}

function hitBomb (player, bomb)
{

    if (!powerup){
        scream.play();

        background.stop();

        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        gameOver = true;
    }
    else{
        removeplankton.play();
        bomb.disableBody(true, true);
    }
    
}

function newLevel(){
    if (level < 10){
        level++;
    }
    if (level === 10){
        finalLevel = true;
    }
     
    levelText.setText('Level: ' +level);

    if (level === 3)
        sky2.setVisible(true);
    if (level === 5)
        sky3.setVisible(true);
    if (level === 7)
        sky4.setVisible(true);
    if (level === 9)
        sky5.setVisible(true);
    /*if (level === 2){
        gameWin();
    }
    */
        
    
    
}

function gameWin(){
    winText.setVisible(true);
    bombs.destroy();
    yippee.play();
    cheering.play();
    
    background.stop();

    player.setTint(0x1bf60d);
 
    player.anims.play('turn');

    gameOver = true;
}

