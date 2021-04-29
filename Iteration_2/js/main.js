import "./phaser.js";

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1200,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var background, light;
var player;
var platforms, superplatforms, ground;
var cursors;
var score = 0;
var scoreText, scoreText2;
var winText, startText, warningText;
var playerposition, playerposition2;
var gameOver = false;
var ending = false;
var oxygen, meteor;
var bounce, music, winVoice, startVoice, whoosh, falling, tryAgain, hit;
var pickup, breathe, cheering, warning, rumble;
var highjump = false;
var wasSuper = false;
var timer = Phaser.Time.TimerEvent;

var game = new Phaser.Game(config);
    
    function preload() {
        this.load.audio('music', [
            'assets/music1.mp3'
        ]);
        this.load.audio('bounce', [
            'assets/bounce.wav'
        ]);
        this.load.audio('winVoice', [
            'assets/winvoice.wav'
        ]);
        this.load.audio('startVoice', [
            'assets/startvoice.wav'
        ]);
        this.load.audio('whoosh', [
            'assets/whoosh.mp3'
        ]);
        this.load.audio('falling', [
            'assets/falling.wav'
        ]);
        this.load.audio('tryAgain', [
            'assets/tryagain.wav'
        ]);
        this.load.audio('hit', [
            'assets/hit.wav'
        ]);
        this.load.audio('pickup', [
            'assets/pickup.wav'
        ]);
        this.load.audio('breathe', [
            'assets/breathe.wav'
        ]);
        this.load.audio('cheering', [
            'assets/cheering.wav'
        ]);
        this.load.audio('warning', [
            'assets/warning.wav'
        ]);
        this.load.audio('rumble', [
            'assets/rumble.wav'
        ]);
       this.load.image('background', 'assets/background2.png');
       this.load.image('platforms', 'assets/platform.png');
       this.load.image('superplatforms', 'assets/superplatform.png');
       this.load.image('ground', 'assets/ground.png');
       this.load.image('oxygen', 'assets/oxygen.png');
       this.load.image('meteor', 'assets/meteor.png');
       this.load.image('light', 'assets/light.png');
       this.load.spritesheet('character', 'assets/spritesheet.png', { frameWidth: 86, frameHeight: 117 });
    }
    
    function create() {

        timer = this.time.addEvent({
            callback: timerEvent,
            callbackScope: this,
            delay: 500, // 1000 = 1 second
            loop: true
        });
        
        music = this.sound.add('music');{
            loop: true
        };
        bounce = this.sound.add('bounce');
        winVoice = this.sound.add('winVoice');
        //startVoice = this.sound.add('startVoice');
        whoosh = this.sound.add('whoosh');
        falling = this.sound.add('falling');
        tryAgain = this.sound.add('tryAgain');
        hit = this.sound.add('hit');
        pickup = this.sound.add('pickup');
        breathe = this.sound.add('breathe');
        cheering = this.sound.add('cheering');
        warning = this.sound.add('warning');
        rumble = this.sound.add('rumble');


        bounce.setVolume(0.2);
        music.setVolume(0.3);
        music.play({ loop: 1 });
        cheering.setVolume(0.4);
        hit.setVolume(0.5);

        
        this.physics.world.setBounds(0, -1000, 8000, 2500);
        
        background = this.add.image(4000, 200, 'background')
        background.fixedToCamera = true;

        light = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });
        
        
        

        this.cameras.main.setZoom(1.0); //default: 1.3

        //this.cameras.main.setBounds(0, 0, 800, 10000);


        

        platforms = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        oxygen = this.physics.add.group({
            //immovable: true,
            //allowGravity: false
            
        });

        superplatforms = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        //platforms.setCollideWorldBounds(true);
        
        ground = this.physics.add.staticGroup({
            immovable: true,
            allowGravity: false
        });

        meteor = this.physics.add.group();
        

        ground.create(4000, 1000, 'ground').setScale(1).refreshBody();

        createPlatforms();
        createOxygen();
        
        

        scoreText = this.add.text(400, 400, '0/25 oxygens', { fontSize: '55px', fill: '#FFFFFF', fontFamily: 'Akaya Telivigala' });
        scoreText.setVisible(false);
        
        winText = this.add.text(70, 200, 'YOU WIN! ', { fontSize: '150px', fill: '#00C9FF', fontFamily: 'Train One' });
        winText.setVisible(false);

        startText = this.add.text(-350, 400, 'The Final Escape', { fontSize: '70px', fill: '#00C9FF', fontFamily: 'Train One' });
        warningText = this.add.text(50, -9375, 'GET TO THE FINISH!', { fontSize: '80px', fill: '#00C9FF', fontFamily: 'Train One' });
        warningText.setVisible(false);

        setTimeout(() => { startText.setVisible(false)}, 7000);
        setTimeout(() => { scoreText.setVisible(true)}, 3000);

        player = this.physics.add.sprite(200, 600, 'character');
  
        
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        //player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(player, true, 0.8, 0.8);
        this.physics.add.collider(player, platforms, hitPlatforms, null, this);;
        this.physics.add.overlap(player, oxygen, collectOxygen, null, this);
        this.physics.add.collider(player, ground);
        this.physics.add.collider(oxygen, platforms);
        this.physics.add.collider(oxygen, ground);
        this.physics.add.collider(player, meteor, hitMeteor, null, this);
        this.physics.add.collider(player, light, hitLight, null, this);

        
        cursors = this.input.keyboard.createCursorKeys();
        

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('character', { start: 5, end: 8 }),
            frameRate: 5,
            repeat: -1
        });
    
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'character', frame: 0 } ],
            frameRate: 10
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('character', { start: 1, end: 4 }),
            frameRate: 5,
            repeat: -1
        });

        
       
    }
    
    function update() {

        if (ending){
            this.cameras.main.shake(10, 0.009);
        }

        

        /**
        scoreText.setText('Position x: ' + player.body.position.x); 
        scoreText2.setText('Position y: ' + player.body.position.y); 
        scoreText.x = player.body.position.x - 2000; 
        scoreText.y = player.body.position.y - 1000;
        scoreText2.x = player.body.position.x - 2000; 
        scoreText2.y = player.body.position.y - 800;
        **/

        scoreText.x = player.body.position.x - 550; 
        scoreText.y = player.body.position.y - 350;

        warningText.x = player.body.position.x - 350;
        warningText.y = player.body.position.y - 150;


        if (gameOver){
            return;
        }    

    if (cursors.left.isDown)
    {
            player.setVelocityX(-500);
            player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
            player.setVelocityX(500);
            player.anims.play('right', true);
        
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
            if (highjump){
                player.setVelocityY(-1075); 
                superBounce.play();
            }
            else{
                player.setVelocityY(-650); 
                bounce.play();
            }
            
        
    }
    if (cursors.down.isDown){
        player.setVelocityY(600);     
    }
}
        
    

    function hitPlatforms(){

        playerposition2 = player.body.position.y;
        highjump = false;

        if (score >= 100){
            winVoice.play();
            winText.x = player.body.position.x - 332; 
            winText.y = player.body.position.y - 175;
            winText.setVisible(true);
            gameOver = true;
            this.physics.pause();
        }
    }

    function createPlatforms(){
        platforms.create(800, 500, 'platforms' ).setScale(3);
        platforms.create(1300, 100, 'platforms' ).setScale(3.5);
        platforms.create(1300, -200, 'platforms' ).setScale(2);

        platforms.create(2400, 500, 'platforms' ).setScale(3);
        platforms.create(2900, 100, 'platforms' ).setScale(3.5);
        platforms.create(2400, -200, 'platforms' ).setScale(2);

        platforms.create(5500, 500, 'platforms' ).setScale(3);
        platforms.create(4700, 100, 'platforms' ).setScale(3.5);
        platforms.create(4300, -200, 'platforms' ).setScale(2);



    }

    function createOxygen(){
        oxygen.create(600, 675, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(1235, 675, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(2000, 675, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(3000, 675, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(4000, 675, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(6000, 675, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();

        oxygen.create(423, 290, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(700, 290, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(2200, 290, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(2650, 290, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(5230, 290, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(5500, 290, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();

        oxygen.create(1235, -100, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(1400, -100, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(2710, -100, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(2900, -100, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(5020, -100, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(4450, -100, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();

        
        oxygen.create(1050, -380, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(1180, -380, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(1350, -380, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(2330, -380, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(2380, -380, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(4050, -380, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(4550, -380, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
    }


    function collectOxygen(player, oxygen){
        pickup.play();
        breathe.play();
        oxygen.disableBody(true, true);
        score++;
        scoreText.setText(`${score}/25 oxygens`);

        if (score > 24){
            light.create(7500, 700, 'light').setScale(3).refreshBody();
            warning.play();
            rumble.play({ loop: 1 });
            warningText.setVisible(true);
            ending = true;
            
            setTimeout(() => { warningText.setVisible(false)}, 2500);

        }

    }

    function timerEvent(){
        console.log('timerEvent');

        var randx = Math.random() * (7000 - 100) + 100;
        var randsound = Math.random() * (20 - 1) + 1;
       
        var meteors = meteor.create(randx, -4000, 'meteor');
        meteors.setGravity(0, -400);

        if (randsound > 18){
            whoosh.play();
        }
        
    }

    function hitMeteor(){
        score = 0;
        scoreText.setText(`${score}/25 oxygens`);
        hit.play();
        tryAgain.play();
        rumble.stop();
        ending = false;
        player.body.position.y = 600;
        player.body.position.x = 200;
        oxygen.children.iterate(function (child) {
            child.disableBody(true, true);
        });
        meteor.children.iterate(function (child) {
            child.disableBody(true, true);
        });
        light.children.iterate(function (child) {
            child.disableBody(true, true);
        });
        createOxygen();
        startText.setVisible(true);
        setTimeout(() => { startText.setVisible(false)}, 7000);
        //gameOver = true;
    }

    function hitLight(){
        ending = false;
        music.stop();
        rumble.stop();
        winVoice.play();
        winText.x = player.body.position.x - 332; 
        winText.y = player.body.position.y - 175;
        winText.setVisible(true);
        setTimeout(() => { cheering.play()}, 1500);
        gameOver = true;
        this.physics.pause();
    }

