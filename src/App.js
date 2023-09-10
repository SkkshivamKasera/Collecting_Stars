import React, { useEffect } from 'react';
import Phaser from 'phaser';
import './App.css'

function App() {

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      scale: {
        mode: Phaser.Scale.FIT, // Scale the game to fit the screen
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game on the screen
        parent: 'App', // HTML element where the game will be placed
      },
      orientation: 'landscape'
    };
    const game = new Phaser.Game(config);
    let player
    let platforms
    let cursors
    let stars
    var score = 0;
    var scoreText;
    var bombs
    var gameOver
    function preload() {
      this.load.image('sky', "https://res.cloudinary.com/dqbnv6dow/image/upload/v1694327706/sky_commfk.png");
      this.load.image('ground', "https://res.cloudinary.com/dqbnv6dow/image/upload/v1694327940/platform_q7y6gb.png")
      this.load.image('star', 'https://res.cloudinary.com/dqbnv6dow/image/upload/v1694327902/star_tgnxfz.png');
      this.load.image('bomb', 'https://res.cloudinary.com/dqbnv6dow/image/upload/v1694327929/bomb_xcj3dt.png');
      this.load.spritesheet('dude',
        "https://res.cloudinary.com/dqbnv6dow/image/upload/v1694327935/dude_by13ls.png",
        { frameWidth: 32, frameHeight: 48 }
      );
      this.load.image('button', "https://png.pngtree.com/png-clipart/20190410/ourmid/pngtree-red-glossy-button-png-image_908890.jpg")
    }

    function create() {
      let image = this.add.image(0, 0, 'sky');
      image.setOrigin(0, 0);
      image.x = 0
      image.y = 0
      scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

      platforms = this.physics.add.staticGroup()

      platforms.create(400, 568, 'ground').setScale(2).refreshBody();

      platforms.create(600, 400, 'ground');
      platforms.create(50, 250, 'ground');
      platforms.create(750, 220, 'ground');

      player = this.physics.add.sprite(100, 450, 'dude');

      player.setBounce(0.2);
      player.setCollideWorldBounds(true);
      this.physics.add.collider(player, platforms);
      cursors = this.input.keyboard.createCursorKeys();

      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
      });

      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      });

      stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
      });

      stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

      });

      this.physics.add.collider(player, platforms);
      this.physics.add.collider(stars, platforms);

      this.physics.add.overlap(player, stars, collectStar, null, this);
      bombs = this.physics.add.group();

      this.physics.add.collider(bombs, platforms);

      this.physics.add.collider(player, bombs, hitBomb, null, this);
    }

    function update() {
      if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
      }
      else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
      }
      else {
        player.setVelocityX(0);

        player.anims.play('turn');
      }

      if (cursors.space.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
      }
    }

    function collectStar(player, star) {
      star.disableBody(true, true);

      score += 10;
      scoreText.setText('Score: ' + score);

      if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {

          child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

      }
    }

    function hitBomb(player, bomb) {
      this.physics.pause();

      player.setTint(0xff0000);

      player.anims.play('turn');

      gameOver = true;
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div id="App">
    </div>
  );
}

export default App;
