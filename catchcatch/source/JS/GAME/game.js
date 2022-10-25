import Fairy from './GameObj/Fairy';
import Magic from './GameObj/Magic';
import Player from './GameObj/Player';
import Enemy from './GameObj/Enemy';
export const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  scene: {
    //scene 제어에
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      fixedStep: false,
    },
  },
};

//player start
// 고양이 json
var cats;
// 플레이어 객체
var player;
// 캐릭터 선택 시 변경될 변수
var cats_number = 0;
// 요정
var now_fairy = 0;
var fairys = [, , , , ,];
var fairy;

// 공격 및 공격 딜레이 관련
var control = false;
var normalAttackTimer = 0;
var normalAttackAS = 20;
var magic;
var magics = [];
export var cursors;
var gameOver = false;
var scoreText;
// 마우스 포인터 관련
var input;
var mouse;
//player end

//map start
var map;
export var mapSize = 16000;
var camera;
var backgroundLayer;
var portalLayer;
var wallLayer;
var stage1Layer;
var stage2Layer;
var stage3Layer;
var stage4Layer;
let controls;
//map end

//enemy start

// 몬스터 변수 선언
var aliens;
var alien;
var target;
var player;
var cursors;
var mon1_delay = 0;
var mon1_x;
var mon1_y;
global.alien_count = 0;
var random_rocation;
var invincible = false;
var timer;

// 몬스터 이미지

//enemy end

function preload() {
  //map start
  this.load.image("tiles", "images/map/tiles.png");
  this.load.image("tiles2", "images/map/tiles2.png");
  this.load.tilemapTiledJSON("map", "images/map/resources.tmj");
  this.load.image("j1", "images/mine/j1.png");
  this.load.image("j2", "images/mine/j2.png");
  this.load.image("j3", "images/mine/j3.png");
  //map end

  //player start
  // 플레이어 스프라이트
  this.load.spritesheet("cat1", "images/cat/cat1.png", {
    frameWidth: 96,
    frameHeight: 100,
  });

  // 공격 스프라이트
  this.load.spritesheet(
    "magic1",
    "images/attack/weapon/16_sunburn_spritesheet.png",
    {
      frameWidth: 100,
      frameHeight: 100,
      endFrame: 61,
    }
  );
  this.load.spritesheet(
    "magic2",
    "images/attack/weapon/12_nebula_spritesheet.png",
    {
      frameWidth: 100,
      frameHeight: 100,
      endFrame: 61,
    }
  );
  this.load.spritesheet(
    "magic3",
    "images/attack/weapon/18_midnight_spritesheet.png",
    {
      frameWidth: 100,
      frameHeight: 100,
      endFrame: 61,
    }
  );
  this.load.spritesheet(
    "magic4",
    "images/attack/weapon/2_magic8_spritesheet.png",
    {
      frameWidth: 100,
      frameHeight: 100,
      endFrame: 61,
    }
  );
  this.load.spritesheet(
    "magic5",
    "images/attack/weapon/20_magicbubbles_spritesheet.png",
    { frameWidth: 100, frameHeight: 100, endFrame: 61 }
  );
  // 요정 스프라이트
  this.load.spritesheet("fairy1", "images/fairy/fairy1.png", {
    frameWidth: 150,
    frameHeight: 142,
  });
  this.load.spritesheet("fairy2", "images/fairy/fairy2.png", {
    frameWidth: 230,
    frameHeight: 210,
  });
  this.load.spritesheet("fairy3", "images/fairy/fairy3.png", {
    frameWidth: 134,
    frameHeight: 158,
  });
  this.load.spritesheet("fairy4", "images/fairy/fairy4.png", {
    frameWidth: 136,
    frameHeight: 170,
  });
  this.load.spritesheet("fairy5", "images/fairy/fairy5.png", {
    frameWidth: 160,
    frameHeight: 190,
  });
  //player end

  //enemy start
  this.load.spritesheet(
    "alien",
    "http://labs.phaser.io/assets/tests/invaders/invader1.png",
    { frameWidth: 32, frameHeight: 32 }
  );
  //enemy end
}

function create() {

  //map start
  this.cameras.main.setBounds(0, 0, mapSize, mapSize);
  this.physics.world.setBounds(0, 0, mapSize, mapSize);
  map = this.make.tilemap({ key: "map" }); //map을 키로 가지는 JSON 파일 가져와 적용하기
  const tileset = map.addTilesetImage("Tiles", "tiles"); //그릴떄 사용할 타일 이미지 적용하기
  const tileset2 = map.addTilesetImage("tiles2", "tiles2"); //그릴떄 사용할 타일 이미지 적용하기
  backgroundLayer = map.createDynamicLayer("background", tileset); //레이어 화면에 뿌려주기
  portalLayer = map.createDynamicLayer("portal", tileset2); //레이어 화면에 뿌려주기
  wallLayer = map.createDynamicLayer("wall", tileset2);
  stage1Layer = map.createDynamicLayer("stage1", tileset2);
  stage2Layer = map.createDynamicLayer("stage2", tileset);
  stage3Layer = map.createDynamicLayer("stage3", tileset2);
  stage4Layer = map.createDynamicLayer("stage4", tileset2);

  stage3Layer.setCollisionByProperty({ collides: true });
  // const debugGraphics = this.add.graphics().setAlpha(0.7);
  // stage3Layer.renderDebug(debugGraphics, {
  //   tileColor: null,
  // })

  cursors = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
    slot1: Phaser.Input.Keyboard.KeyCodes.ONE,
    slot2: Phaser.Input.Keyboard.KeyCodes.TWO,
    slot3: Phaser.Input.Keyboard.KeyCodes.THREE,
    slot4: Phaser.Input.Keyboard.KeyCodes.FOUR,
    slot5: Phaser.Input.Keyboard.KeyCodes.FIVE,
  });
  // camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true);

  //map end

  //player start
  cats = require('./jsons/cats.json');
  fairys = require('./jsons/fairys.json');
  console.log(cats);
  player = cats[cats_number];
  player = new Player(this, 1, 100, 100);
  console.log(player);
  console.log(player)
  camera = this.cameras.main;
  input = this.input;
  mouse = input.mousePointer;
  this.input.on(
    "pointermove",
    function (pointer) {
      let cursor = pointer;
      let angle = Phaser.Math.Angle.Between(
        player.x,
        player.y,
        cursor.x + this.cameras.main.scrollX,
        cursor.y + this.cameras.main.scrollY
      );
    },
    this
  );

  // 플레이어, 요정 로딩
  fairys[0] = new Fairy(this,100, 10, 1, 360, 60, 10, 100, 1, player);
  fairys[1] = new Fairy(this,100, 10, 1, 300, 70, 10, 20, 2, player);
  fairys[2] = new Fairy(this,100, 10, 1, 240, 80, 10, 300, 3, player);
  fairys[3] = new Fairy(this,100, 10, 1, 180, 90, 10, 400, 4, player);
  fairys[4] = new Fairy(this,100, 10, 1, 120, 100, 10, 500, 5, player);
  player.changeFairy(fairys[0]);
  normalAttackAS = fairys[0].as;
  // animation
  this.anims.create({
    key: "fairy1_idle",
    frames: this.anims.generateFrameNumbers("fairy1", { start: 12, end: 21 }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "fairy1_attack",
    frames: this.anims.generateFrameNumbers("fairy1", { start: 6, end: 10 }),
    frameRate: 12,
    repeat: 0,
  });

  this.anims.create({
    key: "fairy2_idle",
    frames: this.anims.generateFrameNumbers("fairy2", { start: 10, end: 19 }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "fairy2_attack",
    frames: this.anims.generateFrameNumbers("fairy2", { start: 0, end: 8 }),
    frameRate: 14,
    repeat: 0,
  });

  this.anims.create({
    key: "fairy3_idle",
    frames: this.anims.generateFrameNumbers("fairy3", { start: 11, end: 19 }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "fairy3_attack",
    frames: this.anims.generateFrameNumbers("fairy3", { start: 0, end: 9 }),
    frameRate: 14,
    repeat: 0,
  });

  this.anims.create({
    key: "fairy4_idle",
    frames: this.anims.generateFrameNumbers("fairy4", { start: 7, end: 14 }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "fairy4_attack",
    frames: this.anims.generateFrameNumbers("fairy4", { start: 0, end: 5 }),
    frameRate: 10,
    repeat: 0,
  });

  this.anims.create({
    key: "fairy5_idle",
    frames: this.anims.generateFrameNumbers("fairy5", { start: 15, end: 24 }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "fairy5_attack",
    frames: this.anims.generateFrameNumbers("fairy5", { start: 0, end: 13 }),
    frameRate: 17,
    repeat: 0,
  });

  this.anims.create({
    key: "turn",
    frames: this.anims.generateFrameNumbers("cat1", { start: 0, end: 0 }),
    frameRate: 10,
  });
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("cat1", { start: 1, end: 7 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("cat1", { start: 1, end: 7 }),
    frameRate: 10,
    repeat: -1,
  });


  // 공격 애니메이션
  this.anims.create({
    key: "magic1",
    frames: this.anims.generateFrameNumbers("magic1", {
      start: 0,
      end: 30,
      first: 0,
    }),
    frameRate: 200,
    repeat: -1,
  });
  this.anims.create({
    key: "magic2",
    frames: this.anims.generateFrameNumbers("magic2", {
      start: 0,
      end: 30,
      first: 0,
    }),
    frameRate: 200,
    repeat: -1,
  });
  this.anims.create({
    key: "magic3",
    frames: this.anims.generateFrameNumbers("magic3", {
      start: 0,
      end: 30,
      first: 0,
    }),
    frameRate: 200,
    repeat: -1,
  });
  this.anims.create({
    key: "magic4",
    frames: this.anims.generateFrameNumbers("magic4", {
      start: 0,
      end: 30,
      first: 0,
    }),
    frameRate: 200,
    repeat: -1,
  });
  this.anims.create({
    key: "magic5",
    frames: this.anims.generateFrameNumbers("magic5", {
      start: 0,
      end: 30,
      first: 0,
    }),
    frameRate: 200,
    repeat: -1,
  });

  fairys[now_fairy].play("fairy" + (now_fairy + 1) + "_idle", true);

  //player end

  //map start
  var j1;

  for (var i = 0; i < 5; i++) {
    var x = Phaser.Math.Between(400, 600);
    var y = Phaser.Math.Between(400, 600);

    j1 = this.physics.add.sprite(x, y, "j1");
    j1.body.immovable = true;

    this.physics.add.collider(player, j1);
  }

  console.log(j1);

  // this.physics.add.overlap(player, portalLayer);

  player.setPosition(8000, 8000); //width, height
  this.physics.add.collider(player, stage3Layer);
  camera.startFollow(player, false);
  //map end

  //enemy start

  aliens = this.physics.add.group();

  // 만약 유저와 몬스터가 닿았다면 (hitplayer 함수 실행)
  this.physics.add.overlap(player, aliens, player.hitPlayer);

    this.anims.create({
        key: 'swarm',
        frames: this.anims.generateFrameNumbers('alien', { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
        })

    // 공격 맞은 후 일시 무적에 사용
    timer = this.time.addEvent({delay:2000, callback:()=>{player.invincible=false}, loop: true});    

  //enemy end
}

function update(time, delta) {
  //player start
  changeSlot();

  if (normalAttackTimer == normalAttackAS) {
    normalAttackTimer = 0;
    control = false;
  } else {
    normalAttackTimer++;
  }
  // fairy.anims.playAfterRepeat('fairy1_idle');
  //mouse clicked
  if (mouse.leftButtonDown() && !control) {
    magicFire(this);
  }
  player.move();
  //player end

  //map start

  // var tile = map.getTileAt(map.worldToTileX(player.x), map.worldToTileY(player.y));

  // if (tile) {
  //   console.log('' + JSON.stringify(tile.properties))
  // }

  //map end

  //enemy start

  if (alien_count !=0){
    for(let i=0;i<aliens.children.entries.length;i++){
        // console.log(this.physics.moveToObject(monsters[i], player, 100))
        // if ()
        this.physics.moveToObject(aliens.children.entries[i], player, aliens.children.entries[i].velo);
        
    }
        
    }
    
    mon1_delay ++;


// 랜덤 위치에 몬스터 생성 (추후 player.x 및 y 좌표 기준 생성으로 변경)
if (mon1_delay > 60){
    random_rocation = Math.floor(Math.random()*4)+1
    if (random_rocation == 1){
    mon1_x = Phaser.Math.Between(player.x-2000, player.x+2000);
    mon1_y = Phaser.Math.Between(player.y+2000, player.y+2010);}

    if (random_rocation == 2){
        mon1_x = Phaser.Math.Between(player.x-2000, player.x+2000);
        mon1_y = Phaser.Math.Between(player.y-2000, player.y-2010);}

    if (random_rocation == 3){
        mon1_x = Phaser.Math.Between(player.x-2000, player.x-2000);
        mon1_y = Phaser.Math.Between(player.y-2000, player.y+2000);}

    if (random_rocation == 4){
        mon1_x = Phaser.Math.Between(player.x+2000, player.x+2000);
        mon1_y = Phaser.Math.Between(player.y-2000, player.y+2000);}
    

        
    alien = new Enemy(this, 10, 100, mon1_x, mon1_y, 'alien', 'swarm');
    alien_count += 1;
    mon1_delay = 0;
    aliens.add(alien);
    this.physics.add.collider(aliens, alien);
    alien.anime(alien);
    }
  for(let i = magics.length-1; i>=0;i--){
    magics[i].timer++;
    if(magics[i].timer == magics[i].lifetime){
      magics[i].destroy();
      magics.splice(i,1);
    }
  }

  //enemy end
  
}

//player start

// 플레이어 공격
var magicFire = function (game) {
  // 게임에서 외부 UI 연관 테스트

  //for fire again
  magic = new Magic(game, fairys[now_fairy].range, fairys[now_fairy]);
  magics.push(magic);
  // console.log(magic);
  // console.log(magic.body);
  game.physics.add.overlap(magic, aliens, attack, null, this);
  // magic.body.setCircle(45);

  /*충돌관련 하드코딩 된 부분 나중에 수정 */
  magic.body.width = 50;
  magic.body.height = 50;
  magic.body.offset.x = 25;
  magic.body.offset.y = 25;
  normalAttackTimer = 0;
  fairys[now_fairy].anims.play("fairy" + (now_fairy + 1) + "_attack", true);

  let angle = Phaser.Math.Angle.Between(
    fairys[now_fairy].x,
    fairys[now_fairy].y,
    input.x + camera.scrollX,
    input.y + camera.scrollY
  );

  // 각도 계산 공식
  angle = ((angle + Math.PI / 2) * 180) / Math.PI + 90;
  magic.rotation += (angle - 180) / 60 - 1.5;
  magic.anims.play("magic" + (now_fairy + 1), true);
  
  //move to mouse position
  game.physics.moveTo(
    magic,
    input.x + camera.scrollX,
    input.y + camera.scrollY,
    fairys[now_fairy].velo
  );
  control = true;
};

function changeSlot(){
  if (
    cursors.slot1.isDown &&
    now_fairy !== 0 &&
    /idle/.test(fairys[now_fairy].anims.currentAnim.key)
  ) {
    fairys[now_fairy].x = -100;
    fairys[now_fairy].y = -100;
    now_fairy = 0;
    player.changeFairy(fairys[now_fairy]);
    normalAttackAS = fairys[now_fairy].as;
    fairys[now_fairy].anims.play("fairy" + (now_fairy + 1) + "_idle", true);
  }

  if (
    cursors.slot2.isDown &&
    now_fairy !== 1 &&
    /idle/.test(fairys[now_fairy].anims.currentAnim.key)
  ) {
    fairys[now_fairy].x = -100;
    fairys[now_fairy].y = -100;
    now_fairy = 1;
    player.changeFairy(fairys[now_fairy]);
    normalAttackAS = fairys[now_fairy].as;
    fairys[now_fairy].anims.play("fairy" + (now_fairy + 1) + "_idle", true);
  }

  if (
    cursors.slot3.isDown &&
    now_fairy !== 2 &&
    /idle/.test(fairys[now_fairy].anims.currentAnim.key)
  ) {
    fairys[now_fairy].x = -100;
    fairys[now_fairy].y = -100;
    now_fairy = 2;
    player.changeFairy(fairys[now_fairy]);
    normalAttackAS = fairys[now_fairy].as;
    fairys[now_fairy].anims.play("fairy" + (now_fairy + 1) + "_idle", true);
  }

  if (
    cursors.slot4.isDown &&
    now_fairy !== 3 &&
    /idle/.test(fairys[now_fairy].anims.currentAnim.key)
  ) {
    fairys[now_fairy].x = -100;
    fairys[now_fairy].y = -100;
    now_fairy = 3;
    player.changeFairy(fairys[now_fairy]);
    normalAttackAS = fairys[now_fairy].as;
    fairys[now_fairy].anims.play("fairy" + (now_fairy + 1) + "_idle", true);
  }

  if (
    cursors.slot5.isDown &&
    now_fairy !== 4 &&
    /idle/.test(fairys[now_fairy].anims.currentAnim.key)
  ) {
    fairys[now_fairy].x = -100;
    fairys[now_fairy].y = -100;
    now_fairy = 4;
    player.changeFairy(fairys[now_fairy]);
    normalAttackAS = fairys[now_fairy].as;
    fairys[now_fairy].anims.play("fairy" + (now_fairy + 1) + "_idle", true);
  }

  if (!fairys[now_fairy].anims.isPlaying) {
    fairys[now_fairy].anims.play("fairy" + (now_fairy + 1) + "_idle", true);
  }
}

function attack(magic, alien) {
  // magic.destroy();
    alien.health -= 1
    alien.invincible = true;
    if (alien.health == 0){
      alien.destroy();
      alien_count -= 1;
    }

}



//enemy end
