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
    
    preload ()
    {
        this.load.audio('meow', [
            'assets/meow.wav'
        ]);
        this.load.image( 'bg', 'assets/blue.png');
    }

    create ()
    {

    var meow = this.sound.add('meow');
    //this.input.setDefaultCursor('url(assets/input/cursors/blue.cur), pointer');

    var sprite = this.add.sprite(640, 360, 'bg').setInteractive();

    sprite.on('pointerdown', function (event) {
        this.setTint(0x6C07F6);

    });

    sprite.on('pointerup', function (event) {
        meow.play();
        this.clearTint();

    });

   


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