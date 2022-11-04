import Player from "./CodeObj/player.js";
import { Chunk, Tile } from "./entities.js";
import { sockConnect } from "./CodeObj/Execlient.js";
import IncodeUI from "../UI/incode-ui.js";
import Enemy from "./CodeObj/enemy.js";
import Magic from "./CodeObj/magic.js";
export const codeConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 600,
  parent: "game-container",
  backgroundColor: "black",
  resolution: window.devicePixelRatio,
  pixelArt: true,
  roundPixels: true,
  scene: {
    //scene 제어에
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
    arcade: {
      fps: 20,
      debug: false,
      fixedStep: false,
    },
  },
};



// 우리가 전달할 정보 --------------------------
let monsterpos = [
  [1, 2],
  [0, 2],
  [4, 5],
  [6, 2],
  [1, 2],
];
// ----------------------------------------
let monX;
let monY;
let randomLocation;
let cats;
let maxMon;
let monCount = 0;
var player = "";
global.codeScene = "";
var gameOver = false;
var scoreText;
global.gameTimer = 0;
global.score = 0;
global.magicSet = "";
var map;
var chunks = [];
export var camera;
let frameTime = 0;
let timer = 0;
let monTimer = 30;
// 몬스터 변수 선언
var monster;
global.codeMonsterSet = "";

function preload() {
  //map start
  this.load.image("sprWater", "images/map/sprWater.png");
  this.load.image("sprSand", "images/map/sprSand.png");
  this.load.image("sprGrass", "images/map/sprGrass.png");
  //map end
  let frameTime = 0;

  //player start
  // 플레이어 스프라이트
  this.load.spritesheet("tower1", "images/cattower/normal_tower_38x64.png", {
    frameWidth: 38,
    frameHeight: 64,
  });
  this.load.spritesheet("tower2", "images/cattower/earth_tower_38x64.png", {
    frameWidth: 38,
    frameHeight: 64,
  });
  this.load.spritesheet("tower3", "images/cattower/fire_tower_38x64.png", {
    frameWidth: 38,
    frameHeight: 64,
  });
  this.load.spritesheet("tower4", "images/cattower/thunder_tower_38x64.png", {
    frameWidth: 38,
    frameHeight: 64,
  });
  this.load.spritesheet("tower5", "images/cattower/water_tower_38x64.png", {
    frameWidth: 38,
    frameHeight: 64,
  });
  // player end

  //attack sprite start
  this.load.spritesheet(
    "magic1",
    "images/attack/weapon/16_sunburn_spritesheet.png",
    {
      frameWidth: 100,
      frameHeight: 100,
      endFrame: 61,
    }
  );
  //attack sprite end

  //object sprite start
  this.load.spritesheet("cat1", "images/cat/cat1.png", {
    frameWidth: 96,
    frameHeight: 100,
  });

  // 몬스터
  this.load.spritesheet(
    "alien",
    "http://labs.phaser.io/assets/tests/invaders/invader1.png",
    { frameWidth: 32, frameHeight: 32 }
  );
  //object sprite end
}

function create() {
  // resource load start
  IncodeUI();
  this.anims.create({
    key: "tower1_idle",
    frames: this.anims.generateFrameNumbers("tower1", { start: 0, end: 2 }),
    frameRate: 8,
    repeat: -1,
  });
  this.anims.create({
    key: "tower1_attack",
    frames: this.anims.generateFrameNumbers("tower1", { start: 3, end: 8 }),
    frameRate: 16,
    repeat: -1,
  });
  this.anims.create({
    key: "tower2_idle",
    frames: this.anims.generateFrameNumbers("tower2", { start: 0, end: 2 }),
    frameRate: 8,
    repeat: -1,
  });
  this.anims.create({
    key: "tower2_attack",
    frames: this.anims.generateFrameNumbers("tower2", { start: 3, end: 8 }),
    frameRate: 16,
    repeat: -1,
  });
  this.anims.create({
    key: "tower3_idle",
    frames: this.anims.generateFrameNumbers("tower3", { start: 0, end: 2 }),
    frameRate: 8,
    repeat: -1,
  });
  this.anims.create({
    key: "tower3_attack",
    frames: this.anims.generateFrameNumbers("tower3", { start: 3, end: 8 }),
    frameRate: 16,
    repeat: -1,
  });
  this.anims.create({
    key: "tower4_idle",
    frames: this.anims.generateFrameNumbers("tower4", { start: 0, end: 2 }),
    frameRate: 8,
    repeat: -1,
  });
  this.anims.create({
    key: "tower4_attack",
    frames: this.anims.generateFrameNumbers("tower4", { start: 3, end: 8 }),
    frameRate: 16,
    repeat: -1,
  });
  this.anims.create({
    key: "tower5_idle",
    frames: this.anims.generateFrameNumbers("tower5", { start: 0, end: 2 }),
    frameRate: 8,
    repeat: -1,
  });
  this.anims.create({
    key: "tower5_attack",
    frames: this.anims.generateFrameNumbers("tower5", { start: 3, end: 8 }),
    frameRate: 16,
    repeat: -1,
  });
  this.anims.create({
    key: "swarm",
    frames: this.anims.generateFrameNumbers("alien", { start: 0, end: 1 }),
    frameRate: 30,
    repeat: -1,
  });
  // resource load end

  //player start
  player = new Player(this, 10, 10, "tower1");
  player.play("tower1_idle");
  player.setScale(2);
  player.setDepth(3);
  //player end
  codeScene = this;
  //map start
  this.chunkSize = 8;
  this.tileSize = 300;
  this.cameraSpeed = 1;

  this.followPoint = new Phaser.Math.Vector2(
    this.cameras.main.worldView.x + this.cameras.main.worldView.width * 0.5,
    this.cameras.main.worldView.y + this.cameras.main.worldView.height * 0.5
  );

  global.$this = this.scene;

  camera = this.cameras.main;

  //map start
  var snappedChunkX =
    this.chunkSize *
    this.tileSize *
    Math.round(this.followPoint.x / (this.chunkSize * this.tileSize));
  var snappedChunkY =
    this.chunkSize *
    this.tileSize *
    Math.round(this.followPoint.y / (this.chunkSize * this.tileSize));

  snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
  snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

  for (var x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
    for (var y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
      var existingChunk = getChunk(x, y);

      if (existingChunk == null) {
        var newChunk = new Chunk(this, x, y);
        chunks.push(newChunk);
      }
    }
  }
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];

    if (
      Phaser.Math.Distance.Between(
        snappedChunkX,
        snappedChunkY,
        chunk.x,
        chunk.y
      ) < 3
    ) {
      if (chunk !== null) {
        chunk.load();
      }
    } else {
      if (chunk !== null) {
        chunk.unload();
      }
    }
  }

  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];

    if (
      Phaser.Math.Distance.Between(
        snappedChunkX,
        snappedChunkY,
        chunk.x,
        chunk.y
      ) < 3
    ) {
      if (chunk !== null) {
        chunk.load();
      }
    } else {
      if (chunk !== null) {
        chunk.unload();
      }
    }
  }

  this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
  //map enderlap(magics, codeMonsterSet, attack);

  var snappedChunkX =
    this.chunkSize *
    this.tileSize *
    Math.round(this.followPoint.x / (this.chunkSize * this.tileSize));
  var snappedChunkY =
    this.chunkSize *
    this.tileSize *
    Math.round(this.followPoint.y / (this.chunkSize * this.tileSize));

  snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
  snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

  for (var x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
    for (var y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
      var existingChunk = getChunk(x, y);

      if (existingChunk == null) {
        var newChunk = new Chunk(this, x, y);
        chunks.push(newChunk);
      }
    }
  }
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];

    if (
      Phaser.Math.Distance.Between(
        snappedChunkX,
        snappedChunkY,
        chunk.x,
        chunk.y
      ) < 3
    ) {
      if (chunk !== null) {
        chunk.load();
      }
    } else {
      if (chunk !== null) {
        chunk.unload();
      }
    }
  }

  this.followPoint.x = player.x;
  this.followPoint.y = player.y;
  //map end

  //monster start
  codeMonsterSet = this.physics.add.group();
  magicSet = this.physics.add.group();
  //monster end


  this.cameras.main.setZoom(0.7);
  this.cameras.main.startFollow(player, false);
  console.log(this.cameras);
  console.log(stageNum);

  switch (stageNum) {
    case 1:
      maxMon = 5;
      break;
    case 2:
      maxMon = 10;
      break;
    case 3:
      maxMon = 10;
      break;
    case 4:
      maxMon = 10;
      break;
    case 5:
      maxMon = 10;
      for(let i=0;i<5;i++){
        catSpawn();
        let enemy = new Enemy(this, 60, monX, monY, "alien", "swarm", 1);
        codeMonsterSet.add(enemy);
      }
      break;
    case 6:
      maxMon = 10;
      for(let i=0;i<5;i++){
        catSpawn();
        let enemy = new Enemy(this, 60, monX, monY, "alien", "swarm", 1);
        codeMonsterSet.add(enemy);
      }
      break;
  }


  this.physics.add.overlap(magicSet, codeMonsterSet, monsterHit);
  this.physics.add.overlap(player, codeMonsterSet, playerHit);
  this.scene.pause();
}

function update(time, delta) {
  frameTime += delta;

  if (frameTime > 16.5) {
    frameTime = 0;
    timer++;
    monTimer++;
    if (timer > 60) {
      timer = 0;
      if (IsStarted) {
        dataSend();
      }
    }

    if (monTimer > 60) {
      monTimer = 0;

      switch (stageNum) {
        case 1:
          if (monCount < maxMon) {
            let enemy = new Enemy(this, 60, 400, -400, "alien", "swarm", 1);
            if (enemy.type === 1) {
              enemy.health = 1;
            }
            codeMonsterSet.add(enemy);
            this.physics.moveToObject(
              enemy,
              player,
              enemy.velo
            );
            monCount++;
          }
          break;
        case 2:
          if (monCount < maxMon) {
            let enemy = (monCount % 2 === 0) ? new Enemy(this, 60, 400, -400, "alien", "swarm", 1) : new Enemy(this, 60, -400, -400, "alien", "swarm", 1);
            if (enemy.type === 1) {
              enemy.health = 1;
            }
            codeMonsterSet.add(enemy);
            this.physics.moveToObject(
              enemy,
              player,
              enemy.velo
            );
            monCount++;
          }
          break;
        case 3:
          if (monCount < maxMon) {
            enemySpawn();
            let enemy = new Enemy(this, 60, monX, monY, "alien", "swarm", 1);
            if (enemy.type === 1) {
              enemy.health = 1;
            }
            codeMonsterSet.add(enemy);
            this.physics.moveToObject(
              enemy,
              player,
              enemy.velo
            );
            monCount++;
          }
          break;
          case 4:
            if (monCount < maxMon) {
              enemySpawn();
              let typeNum = Math.floor(Math.random() * 4+2);
              let enemy = new Enemy(this, 60, monX, monY, "alien", "swarm", typeNum);
              console.log(enemy.type);
              if (enemy.type === 1) {
                enemy.health = 1;
              }
              codeMonsterSet.add(enemy);
              this.physics.moveToObject(
                enemy,
                player,
                enemy.velo
              );
              monCount++;
            }
            break;
          case 5:
            if (monCount < maxMon) {
              enemySpawn();
              let typeNum = Math.floor(Math.random() * 5+1);
              let enemy = new Enemy(this, 60, monX, monY, "alien", "swarm", typeNum);
              console.log(enemy.type);
              if (enemy.type === 1) {
                enemy.health = 1;
              }
              codeMonsterSet.add(enemy);
              this.physics.moveToObject(
                enemy,
                player,
                enemy.velo
              );
              monCount++;
            }
            break;
          case 6:
            if (monCount < maxMon) {
              enemySpawn();
              let typeNum = Math.floor(Math.random() * 5+1);
              let randomVelo = Math.floor(Math.random() * 60 + 40);
              let enemy = new Enemy(this, randomVelo, monX, monY, "alien", "swarm", typeNum);
              console.log(enemy.type);
              if (enemy.type === 1) {
                enemy.health = 1;
              }
              codeMonsterSet.add(enemy);
              this.physics.moveToObject(
                enemy,
                player,
                enemy.velo
              );
              monCount++;
            }
            break;
      }
    }

  }
}

//map start
function getChunk(x, y) {
  var chunk = null;
  for (var i = 0; i < chunks.length; i++) {
    if (chunks[i].x == x && chunks[i].y == y) {
      chunk = chunks[i];
    }
  }
  return chunk;
}

//map end

//sock start
function dataSend() {
  const tempMonster = [true, true, true, true, true];
  if (socket.bufferedAmount == 0) {
    if (IsStarted != false && IsRunning != true) {

      let objList = [[]];
      let obj = codeMonsterSet.children.entries;
      for (let i = 0; i < codeMonsterSet.children.entries.length; i++) {
        objList.push([obj[i].x, obj[i].y, obj[i].type]);
      }


      var Data = {
        action: "exeData",
        pinnumber: PinNumber,
        catchobj: objList,
      };
      IsRunning = true;
      socket.send(JSON.stringify(Data));
    }
  }
}
// sock end
export function attack(isAttack, angle, element) {
  if (isAttack) {
    let x = Math.cos(angle * (Math.PI / 180));
    let y = Math.sin(angle * (Math.PI / 180));

    let magic = new Magic(codeScene, 1);
    magicSet.add(magic);
    codeScene.physics.moveTo(
      magic,
      x,
      -y,
      300
    );
  }
}

function monsterHit(magic, monster) {
  if (monster.type === 0) {
    score -= 200;
  }

  if (!monster.invincible) {
    if (monster.type === magic.element) {
      monster.health -= 3;
    } else {
      monster.invincible = true;
      monster.health -= 1;
    }
    magic.destroy();

    if (monster.health <= 0) {
      score += 100;
      monster.destroy();
      console.log(score);
    }

  }
}

function playerHit(player, monster) {
  monster.destroy();
  score -= 50;
  console.log(score);
}


// sock end

function enemySpawn() {
  randomLocation = Math.floor(Math.random() * 4) + 1;
  if (randomLocation === 1) {
    monX = Phaser.Math.Between(player.x - 400, player.x + 400);
    monY = Phaser.Math.Between(player.y + 400, player.y + 400);
  } else if (randomLocation === 2) {
    monX = Phaser.Math.Between(player.x - 400, player.x + 400);
    monY = Phaser.Math.Between(player.y - 400, player.y - 400);
  } else if (randomLocation === 3) {
    monX = Phaser.Math.Between(player.x - 400, player.x - 400);
    monY = Phaser.Math.Between(player.y - 400, player.y + 400);
  } else if (randomLocation === 4) {
    monX = Phaser.Math.Between(player.x + 400, player.x + 400);
    monY = Phaser.Math.Between(player.y - 400, player.y + 400);
  }
}

function catSpawn() {
  randomLocation = Math.floor(Math.random() * 4) + 1;
  if (randomLocation === 1) {
    monX = Phaser.Math.Between(player.x - 200, player.x + 200);
    monY = Phaser.Math.Between(player.y + 200, player.y + 200);
  } else if (randomLocation === 2) {
    monX = Phaser.Math.Between(player.x - 200, player.x + 200);
    monY = Phaser.Math.Between(player.y - 200, player.y - 200);
  } else if (randomLocation === 3) {
    monX = Phaser.Math.Between(player.x - 200, player.x - 200);
    monY = Phaser.Math.Between(player.y - 200, player.y + 200);
  } else if (randomLocation === 4) {
    monX = Phaser.Math.Between(player.x + 200, player.x + 200);
    monY = Phaser.Math.Between(player.y - 200, player.y + 200);
  }
}

