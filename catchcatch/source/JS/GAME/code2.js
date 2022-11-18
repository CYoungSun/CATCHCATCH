import { Chunk, Tile } from "./entities.js";
import IncodeUI, { makeranking, codegameclear } from "../UI/incode-ui.js";
import { showscore } from "../UI/incode-ui.js";
import { setSound } from "../SOUND/sound";
import Enemy from "./Code2Obj/enemy.js";
import Player from "./Code2Obj/player.js";
export let codeConfig2 = {
  type: Phaser.AUTO,
  width: 600,
  height: 600,
  parent: "game-container",
  backgroundColor: "black",
  resolution: window.devicePixelRatio,
  pixelArt: true,
  roundPixels: true,
  audio: {
    disableWebAudio: true,
  },
  scene: {
    //scene 제어에
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
    arcade: {
      fps: 60,
      debug: false,
      debugShowVelocity: true,
      fixedStep: false,
    },
  },
};

export function config() {
  codeConfig2 = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    parent: "game-container",
    backgroundColor: "black",
    resolution: window.devicePixelRatio,
    pixelArt: true,
    roundPixels: true,
    audio: {
      disableWebAudio: true,
    },
    scene: {
      //scene 제어에
      preload: preload,
      create: create,
      update: update,
    },
    physics: {
      default: "arcade",
      arcade: {
        fps: 60,
        debug: debugmode,
        debugShowVelocity: false,
        fixedStep: false,
      },
    },
  };
}

var chunks = [];
global.codeScene2 = "";
let codeStart;
export var camera;
let frameTime = 0;
global.map = [[[]]];
global.sendmap = [[]];
global.objmap = [[]];
let code2MonsterSet;
function preload() {
  //map start
  this.load.image("sprWater", "images/map/sprWater.png");
  this.load.image("sprSand", "images/map/sprSand.png");
  this.load.image("sprGrass", "images/map/sprGrass.png");
  this.load.image("square", "images/code2/square.png");
  // this.load.image("ssafy", "images/map/ssafy.png");
  //map end
  let frameTime = 0;

  //player start
  // 플레이어 스프라이트
  // player end

  //attack sprite start
  this.load.spritesheet("magic1", "images/attack/weapon/normalMagic.png", {
    frameWidth: 64,
    frameHeight: 64,
    endFrame: 5,
  });
  this.load.spritesheet("magic2", "images/attack/weapon/thunderMagic.png", {
    frameWidth: 64,
    frameHeight: 64,
    endFrame: 5,
  });
  this.load.spritesheet("magic3", "images/attack/weapon/fireMagic.png", {
    frameWidth: 64,
    frameHeight: 64,
    endFrame: 5,
  });
  this.load.spritesheet("magic4", "images/attack/weapon/waterMagic.png", {
    frameWidth: 64,
    frameHeight: 64,
    endFrame: 5,
  });
  this.load.spritesheet("magic5", "images/attack/weapon/earthMagic.png", {
    frameWidth: 64,
    frameHeight: 64,
    endFrame: 5,
  });
  //attack sprixte end

  //object sprite start
  this.load.spritesheet("tower1", "images/cattower/lucky_ssafy.png", {
    frameWidth: 96,
    frameHeight: 100,
  });
  this.load.spritesheet("cat1", "images/cat/cat8.png", {
    frameWidth: 96,
    frameHeight: 100,
  });
  this.load.spritesheet("teleport", "images/cat/teleport.png", {
    frameWidth: 101,
    frameHeight: 101,
  });
  // 몬스터
  this.load.spritesheet("monster_die", "images/monster/monster_die2.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  this.load.spritesheet("slime", "images/monster/mecha_slime_48x48.png", {
    frameWidth: 48,
    frameHeight: 48,
  });
  //object sprite end
}

function create() {
  codeScene2 = this;
  map = [[[]]];
  sendmap = [[]];
  objmap = [[]];
  // resource load start
  IncodeUI();
  chunks = [];
  score = 0;
  codeStart = true;
  this.anims.create({
    key: "tower1_idle",
    frames: this.anims.generateFrameNumbers("tower1", { start: 0, end: 1 }),
    frameRate: 8,
    repeat: -1,
  });
  this.anims.create({
    key: "slime_idle",
    frames: this.anims.generateFrameNumbers("slime", { start: 0, end: 3 }),
    frameRate: 7,
    repeat: -1,
  });
  this.anims.create({
    key: "slime_move",
    frames: this.anims.generateFrameNumbers("slime", { start: 4, end: 7 }),
    frameRate: 7,
    repeat: -1,
  });
  this.anims.create({
    key: "teleport",
    frames: this.anims.generateFrameNumbers("teleport", { start: 0, end: 17 }),
    frameRate: 30,
    repeat: 1,
  });
  code2MonsterSet = [];

  this.cameras.main.setZoom(0.85);
  // resource load end
  // var ssafy = this.add.image(0, 0, "ssafy");
  // ssafy.setDepth(2);
  // ssafy.setAlpha(0.5);
  //player start

  //player end
  codeScene2 = this;
  //map start
  this.chunkSize = 8;
  this.tileSize = 300;
  this.cameraSpeed = 1;

  this.followPoint = new Phaser.Math.Vector2(
    this.cameras.main.worldView.x + this.cameras.main.worldView.width * 0.5,
    this.cameras.main.worldView.y + this.cameras.main.worldView.height * 0.5
  );
  let term = 100;
  for (let i = 0; i <= 6; i++) {
    map.push([]);
    sendmap.push([]);
    objmap.push([]);
    for (let j = 0; j <= 6; j++) {
      sendmap[i].push(0);
      objmap[i].push(0);
      map[i].push([]);
      let tileX = this.add.image(term * j, term * i, "square");
      tileX.setDepth(3);
      map[i][j].push(term * j);
      map[i][j].push(term * i);
    }
  }
  sendmap.pop();
  objmap.pop();
  let posX = Math.floor(Math.random() * 7);
  let posY = Math.floor(Math.random() * 7);
  player = new Player(
    this,
    3,
    posX,
    posY,
    map[posY][posX][0],
    map[posY][posX][1],
    "cat1"
  );
  sendmap[posY][posX] = 1;
  objmap[posY][posX] = player;
  player.setDepth(4);
  player.body.debugBodyColor = 0x7f921b;

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

  //map end

  for (let i = 0; i < 7; i++) {
    while (true) {
      posX = Math.floor(Math.random() * 7);
      posY = Math.floor(Math.random() * 7);
      if (sendmap[posY][posX] === 0) {
        break;
      }
    }
    let enemy = new Enemy(
      this,
      posX,
      posY,
      map[posY][posX][0],
      map[posY][posX][1],
      1
    );
    sendmap[posY][posX] = 3;
    objmap[posY][posX] = enemy;
    code2MonsterSet.push(enemy);
  }

  for (let i = 0; i < code2MonsterSet.length; i++){
    let randomNum = Math.floor(Math.random()*4+1)
    code2MonsterSet[i].move(randomNum);
  }

  for (let i = 0; i < 5; i++) {
    while (true) {
      posX = Math.floor(Math.random() * 7);
      posY = Math.floor(Math.random() * 7);
      if (sendmap[posY][posX] === 0) {
        break;
      }
    }
    let enemy = new Enemy(
      this,
      posX,
      posY,
      map[posY][posX][0],
      map[posY][posX][1],
      0
    );
    sendmap[posY][posX] = 2;
    objmap[posY][posX] = enemy;
  }
}

function update(time, delta) {
  frameTime += delta;

  if (frameTime > 16.5) {
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
  if (socket.bufferedAmount == 0) {
    if (IsStarted != false && IsRunning != true) {
      if (codeEnemySet.children.entries.length > 0) {
        let objList = [[]];
        let obj = codeMonsterSet.children.entries;

        for (let i = 0; i < codeMonsterSet.children.entries.length; i++) {
          objList.push([
            obj[i].x,
            obj[i].y,
            obj[i].type,
            obj[i].body.halfWidth,
          ]);
        }
        for (let i = 0; i < objList.length; i++) {
          if (objList[i] == 0) {
            objList.splice(i, 1);
            i--;
          }
        }

        shuffle(objList);

        var Data = {
          action: "exeData",
          pinnumber: PinNumber,
          catchobj: objList,
        };
        codeStart = false;
        IsRunning = true;
        socket.send(JSON.stringify(Data));
      } else if (!codeStart) {
        setSound.playSE(26);
        Data = {
          action: "endGame",
          pinnumber: PinNumber,
        };
        socket.send(JSON.stringify(Data));
        IsStarted = false;
        if (stageNum === 6) {
          makeranking();
        } else {
          codegameclear();
        }
      }
    }
  }
}

// sock end
export function attack(isAttack, angle, element) {
  if (isAttack) {
    let x = Math.cos(angle * (Math.PI / 180));
    let y = Math.sin(angle * (Math.PI / 180));
    if (element < 1 || element > 5) {
      element = 1;
    }
    let magic = new Magic(codeScene, element);
    setSound.playSE(25);
    magic.anims.play("magic" + element);
    magicSet.add(magic);
    codeScene.physics.moveTo(magic, x, y, 500);
  }
}
// sock end
