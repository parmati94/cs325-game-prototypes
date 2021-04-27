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

var background;
var player;
var platforms, superplatforms, ground;
var cursors;
var score = 0;
var scoreText, scoreText2;
var winText, startText, halfText;
var playerposition, playerposition2;
var gameOver = false;
var oxygen;
var bounce, music, winVoice, startVoice, superBounce, falling, tryAgain;
var highjump = false;
var wasSuper = false;

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
        this.load.audio('superBounce', [
            'assets/superbounce.wav'
        ]);
        this.load.audio('falling', [
            'assets/falling.wav'
        ]);
        this.load.audio('tryAgain', [
            'assets/tryagain.wav'
        ]);
       this.load.image('background', 'assets/background2.png');
       this.load.image('platforms', 'assets/platform.png');
       this.load.image('superplatforms', 'assets/superplatform.png');
       this.load.image('ground', 'assets/ground.png');
       this.load.image('oxygen', 'assets/oxygen.png');
       this.load.spritesheet('character', 'assets/spritesheet.png', { frameWidth: 86, frameHeight: 117 });
    }
    
    function create() {
        
        music = this.sound.add('music');{
            loop: true
        };
        bounce = this.sound.add('bounce');
        winVoice = this.sound.add('winVoice');
        //startVoice = this.sound.add('startVoice');
        superBounce = this.sound.add('superBounce');
        falling = this.sound.add('falling');
        tryAgain = this.sound.add('tryAgain');

        bounce.setVolume(0.2);
        music.setVolume(0.2);
        music.play();
        //startVoice.play();

        
        this.physics.world.setBounds(0, -1000, 8000, 2500);
        
        background = this.add.image(4000, 200, 'background')
        background.fixedToCamera = true;

        this.cameras.main.setZoom(0.3); //default: 1.3

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
        

        ground.create(4000, 1000, 'ground').setScale(1).refreshBody();

        createPlatforms();
        createOxygen();
        
        

        scoreText = this.add.text(400, 400, 'Score: 0', { fontSize: '80px', fill: '#FFFFFF', fontFamily: 'Akaya Telivigala' });
        scoreText2 = this.add.text(400, 400, 'Score: 0', { fontSize: '80px', fill: '#FFFFFF', fontFamily: 'Akaya Telivigala' });
        
        //winText = this.add.text(70, 200, 'YOU WIN! ', { fontSize: '150px', fill: '#00C9FF', fontFamily: 'Train One' });
        //winText.setVisible(false);

        startText = this.add.text(50, 175, 'SUPER JUMPER!', { fontSize: '80px', fill: '#00C9FF', fontFamily: 'Train One' });
        halfText = this.add.text(50, -9375, 'HALFWAY THERE!', { fontSize: '80px', fill: '#00C9FF', fontFamily: 'Train One' });

        setTimeout(() => { startText.setVisible(false)}, 3000);
        setTimeout(() => { scoreText.setVisible(true)}, 3000);

        player = this.physics.add.sprite(400, 600, 'character');
  

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        //player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(player, true, 0.8, 0.8);
        this.physics.add.collider(player, platforms, hitPlatforms, null, this);;
        this.physics.add.collider(player, ground);
        this.physics.add.collider(oxygen, platforms);
        this.physics.add.collider(oxygen, ground);

        
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

        scoreText.setText('Position x: ' + player.body.position.x); 
        scoreText2.setText('Position y: ' + player.body.position.y); 
        scoreText.x = player.body.position.x - 2000; 
        scoreText.y = player.body.position.y - 1000;
        scoreText2.x = player.body.position.x - 2000; 
        scoreText2.y = player.body.position.y - 800;


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
        oxygen.create(423, 290, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(700, 290, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(1235, -100, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(1400, -100, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(1050, -380, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(1180, -380, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
        oxygen.create(1350, -380, 'oxygen').setScale(0.7).setBounce(0.6).refreshBody();
    }

    

    function restart(){
        
        score = 0;
        scoreText.setText('Score: ' + score);
        player.body.position.y = 600;
        player.body.position.x = 400;
        startText.setVisible(true);
        setTimeout(() => { startText.setVisible(false)}, 3000);
        tryAgain.play();
    }

