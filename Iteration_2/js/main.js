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
var platforms, superplatforms, ground;
var cursors;
var score = 0;
var scoreText;
var winText, startText, halfText;
var playerposition, playerposition2;
var gameOver = false;
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
       this.load.image('platforms', 'assets/platform1.png');
       this.load.image('superplatforms', 'assets/superplatform.png');
       this.load.image('ground', 'assets/ground.png');
       this.load.spritesheet('character', 'assets/spritesheet.png', { frameWidth: 86, frameHeight: 117 });
    }
    
    function create() {
        
        music = this.sound.add('music');{
            loop: true
        };
        bounce = this.sound.add('bounce');
        winVoice = this.sound.add('winVoice');
        startVoice = this.sound.add('startVoice');
        superBounce = this.sound.add('superBounce');
        falling = this.sound.add('falling');
        tryAgain = this.sound.add('tryAgain');

        bounce.setVolume(0.2);
        music.setVolume(0.2);
        music.play();
        startVoice.play();

        
        this.physics.world.setBounds(0, 0, 800, 8000);
        background = this.add.tileSprite(400, -13000, 2000, 30000, 'background');
        background.fixedToCamera = true;

        //this.cameras.main.setBounds(0, 0, 800, 10000);


        

        platforms = this.physics.add.group({
            immovable: true,
            allowGravity: false
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
        

        ground.create(400, 800, 'ground').setScale(5).refreshBody();
        
        createPlatforms();

        scoreText = this.add.text(400, 400, 'Score: 0', { fontSize: '45px', fill: '#FFFFFF', fontFamily: 'Akaya Telivigala' });
        scoreText.setVisible(false);
        
        winText = this.add.text(70, 200, 'YOU WIN! ', { fontSize: '150px', fill: '#00C9FF', fontFamily: 'Train One' });
        winText.setVisible(false);

        startText = this.add.text(50, 175, 'SUPER JUMPER!', { fontSize: '80px', fill: '#00C9FF', fontFamily: 'Train One' });
        halfText = this.add.text(50, -9375, 'HALFWAY THERE!', { fontSize: '80px', fill: '#00C9FF', fontFamily: 'Train One' });

        setTimeout(() => { startText.setVisible(false)}, 3000);
        setTimeout(() => { scoreText.setVisible(true)}, 3000);

        player = this.physics.add.sprite(400, 600, 'character');
        playerposition = player.body.position.y;
        playerposition2 = player.body.position.y;
  

        player.setBounce(0.2);
        //player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(player, true, 0.8, 0.8);
        this.physics.add.collider(player, platforms, hitPlatforms, null, this);
        this.physics.add.collider(player, superplatforms, hitSuperPlatforms, null, this);
        this.physics.add.collider(player, ground);

        
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

        if (player.body.position.y > (playerposition2 + 400)){
            playerposition = 600;
            playerposition2 = 600;
            falling.play();
            restart();
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
            if (highjump){
                player.setVelocityY(-1075); 
                superBounce.play();
            }
            else{
                player.setVelocityY(-480); 
                bounce.play();
            }
            
        
    }
        
    }

    function createPlatforms(){

        var i;
        var y = 800;

        for (i = 0; i < 100; i++){
            var prevRand;
            var randx = Math.random() * (800 - 100) + 100;
            
            var randNum = Math.random() * (15 - 1) + 1;
            y -= 200;


            if (randNum > 2){
                if (wasSuper && (prevRand > randx + 150 || prevRand < randx - 150)){
                    platforms.create(randx, y, 'platforms');
                    wasSuper = false;
                }
                else if (!wasSuper){
                    platforms.create(randx, y, 'platforms');
                    
                }
                else{
                    if (randx < 400){
                        randx += 150;
                    }
                    else{
                        randx -= 150;
                    }

                    platforms.create(randx, y, 'platforms'); 
                    wasSuper = false;  
                }
            }
            else{
                superplatforms.create(randx, y, 'superplatforms');
                prevRand = randx;
                wasSuper = true;
            }
            

        } 


        //platforms.children.iterate(function (child) {

        //    child.body.velocity.x = -200;
        
       // }); 

       
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

    
    function hitSuperPlatforms(){

        playerposition2 = player.body.position.y + 200;
        highjump = true;

        if (score == 100){
            winVoice.play();
            winText.x = player.body.position.x - 332; 
            winText.y = player.body.position.y - 175;
            winText.setVisible(true);
            gameOver = true;
            this.physics.pause();
        }
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

