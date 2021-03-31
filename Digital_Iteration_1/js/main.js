import "./phaser.js";

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
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
var platforms, ground;
var cursors;
var score = 0;
var scoreText;
var winText, startText;
var playerposition;
var gameOver = false;
var bounce, music, winVoice, startVoice;

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
        //this.load.audio('startVoice', [
         //   'assets/startVoice.wav'
        //]);
       this.load.image('background', 'assets/background2.png');
       this.load.image('platforms', 'assets/platform1.png');
       this.load.image('ground', 'assets/ground.png');
       this.load.spritesheet('character', 'assets/spritesheet.png', { frameWidth: 86, frameHeight: 117 });
    }
    
    function create() {
        
        music = this.sound.add('music');
        bounce = this.sound.add('bounce');
        winVoice = this.sound.add('winVoice');
        //startVoice = this.sound.add('startVoice');

        bounce.setVolume(0.2);
        music.setVolume(0.3);
        music.play();
        //startVoice.play();

        
        this.physics.world.setBounds(0, 0, 800, 8000);
        background = this.add.tileSprite(400, 400, 2000, 50000, 'background');
        background.fixedToCamera = true;

        //this.cameras.main.setBounds(0, 0, 800, 10000);

        platforms = this.physics.add.staticGroup();
        ground = this.physics.add.staticGroup();
        

        platforms.create(400, 800, 'ground').setScale(5).refreshBody();
        
        createPlatforms();

        scoreText = this.add.text(400, 400, 'Score: 0', { fontSize: '45px', fill: '#FFFFFF', fontFamily: 'Akaya Telivigala' });
        scoreText.setVisible(false);

        startText = this.add.text(70, 175, 'SUPER JUMPER!', { fontSize: '100px', fill: '#00C9FF', fontFamily: 'Akaya Telivigala' });

        setTimeout(() => { startText.setVisible(false)}, 3000);
        setTimeout(() => { scoreText.setVisible(true)}, 3000);

        player = this.physics.add.sprite(400, 600, 'character');
        playerposition = player.body.position.y;
  

        player.setBounce(0.2);
        //player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(player, true, 0.8, 0.8);
        this.physics.add.collider(player, platforms, hitPlatforms, null, this);

        
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

        winText = this.add.text(70, 200, 'YOU WIN! ', { fontSize: '150px', fill: '#00C9FF', fontFamily: 'Akaya Telivigala' });
        winText.setVisible(false);

        
       
    }
    
    function update() {

        /*
        platforms.children.iterate(child){
            const platform = child;

            const scrollY = this.cameras.main.scrollY;
            if (platform.y >= scrollY + 700){
                platform.y = scrollY - Phaser.Math.Between(50,100);
                platform.body.updateFromGameObject();
            }
        }
        */

        scoreText.x = player.body.position.x - 300; 
        scoreText.y = player.body.position.y - 320;

        if (gameOver){
            return;
        }    

        if (player.body.position.y <= (playerposition - 200)){
            score += 1;
            scoreText.setText('Score: ' + score);
            playerposition -= 200;
        }

        

        if (cursors.left.isDown)
    {

    
            player.setVelocityX(-320);
            player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
            player.setVelocityX(320);
            player.anims.play('right', true);
        
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (player.body.touching.down)
    {
            player.setVelocityY(-480); 
            bounce.play();
        
    }
        
    }

    function createPlatforms(){

        var i;
        var y = 800;

        for (i = 0; i < 100; i++){
            var randx = Math.random() * (800 - 100) + 100;
            var randx2 = Math.random() * (800 - 100) + 100;

            y -= 200;

            platforms.create(randx, y, 'platforms');

        }

       
    }

    function hitPlatforms(){
        if (score == 100){
            winVoice.play();
            winText.x = player.body.position.x - 275; 
            winText.y = player.body.position.y - 175;
            winText.setVisible(true);
            gameOver = true;
            this.physics.pause();
        }
    }

