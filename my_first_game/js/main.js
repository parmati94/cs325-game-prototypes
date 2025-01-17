import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

class MyScene extends Phaser.Scene {
    
    constructor() {
        super();
        
        this.bouncy = null;
    }
    
    preload() {

        this.load.audio('meow', [
            'assets/meow.wav'
        ]);
        // Load an image and call it 'logo'.
        this.load.image( 'logo', 'assets/myfaceSMALLER.png' );
        this.load.image('background', 'assets/space_background.jpg')
    }
    
    create() {

        
         //this.add.image(640, 360, 'background');
        // Create a sprite at the center of the screen using the 'logo' image.
        this.bouncy = this.physics.add.sprite( this.cameras.main.centerX, this.cameras.main.centerX, 'logo' );
        
        // Make it bounce off of the world bounds.
        this.bouncy.body.collideWorldBounds = true;
        
        // Make the camera shake when clicking/tapping on it.
        this.bouncy.setInteractive();
        this.bouncy.on( 'pointerdown', function( pointer ) {
            this.scene.cameras.main.shake(500);
            });
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        let style = { font: "25px Verdana", fill: "#7E1FFF", align: "center" };
        let text = this.add.text( this.cameras.main.centerX, 15, "Hello, Paul.", style );
        text.setOrigin( 0.5, 0.0 );
    }
    
    update() {
      
        this.bouncy.rotation = this.physics.accelerateToObject( this.bouncy, this.input.activePointer, 500, 500, 500 );
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 1280,
    height: 720,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
