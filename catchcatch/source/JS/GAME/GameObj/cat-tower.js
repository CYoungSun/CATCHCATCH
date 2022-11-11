import { monsterSet, bossSet } from "../game";
import TowerMagic from "./tower-magic";
import TowerSkill from "./tower-skill";
import tower from "../../UI/tower-upgrade.js";
import Player from "./player";
import { UpdateCatCoin } from "../../UI/ingame-ui.js";

export default class CatTower extends Phaser.Physics.Arcade.Sprite {
  weaponSprite;
  skillSprite;
  towerAttackTimer = 0; //총알 시간
  towerSkillAttackTimer = 0; //스킬 시간
  towerAS = [180, 0, 0, 0, 360, 90]; //총알 연사속도
  towerSkillAS = [
    [600, 600, 600],
    [600, 420, 300],
    [900, 720, 600],
    [1800, 1200, 600],
    [900, 720, 600],
    [600, 600, 600],
  ]; //스킬 연사속도
  towerDmg = [50, 0, 0, 0, 100, 50]; //총알 대미지
  towerSkillDmg = []; //스킬 대미지
  towerSkillcount = [
    [1, 1, 1],
    [1, 2, 4],
    [1, 3, 6],
    [1, 2, 4],
    [1, 2, 4],
    [1, 1, 1],
  ]; //스킬 소환 개수
  towerSkilldelay = [
    [1, 1, 1],
    [1, 1, 1],
    [900, 720, 600],
    [1800, 1200, 600],
    [900, 720, 600],
    [1, 1, 1],
  ];
  circleSize = 0.8;
  timedEvent;

  constructor(
    scene,
    stone,
    level,
    x,
    y,
    towerSprite,
    weaponSprite,
    weaponDeadSprite,
    skillSprite,
    skillShowSprite,
    skillDeadSprite
  ) {
    super(scene, x, y, towerSprite);

    this.scene = scene;
    this.weaponSprite = weaponSprite;
    this.weaponDeadSprite = weaponDeadSprite;
    this.skillSprite = skillSprite;
    this.skillShowSprite = skillShowSprite;
    this.skillDeadSprite = skillDeadSprite;
    this.stone = stone;
    this.level = level;
    this.invisible = "false";

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.add.overlap(this, monsterSet, this.overlaphit);
    scene.physics.add.overlap(this, bossSet, this.overlaphit);

    this.anims.play(towerSprite, true);

    scene.events.on("update", () => {
      this.update();
    });
  }

  update() {
    if (player.body.velocity.x > 0) {
      this.flipX = true;
    } else {
      this.flipX = false;
    }
    this.towerAttackTimer++;
    this.towerSkillAttackTimer++;
    if (this.towerAttackTimer >= this.towerAS[this.stone]) {
      this.towerAttackTimer = 0;

      //노멀

      if (this.stone === 0 && this.level > 0 && this.invisible === "true") {
        for (let i = 0; i < this.level; i++) {
          let magic = new TowerMagic(this.scene, this);
          petAttacks.add(magic);
          magic.anims.play(this.weaponSprite);
          let angle = Math.floor(Math.random() * 360);
          let x = Math.cos(angle * (Math.PI / 180));
          let y = Math.sin(angle * (Math.PI / 180));
          this.scene.physics.moveTo(magic, this.x + x, this.y + y, 300);
        }
      }
      //전기
      if (this.stone === 1 && this.level > 0 && this.invisible === "true") {
        for (let i = 0; i < this.level; i++) {}
      }
      //불
      if (this.stone === 2 && this.level > 0 && this.invisible === "true") {
        for (let i = 0; i < this.level; i++) {}
      }
      //물
      if (this.stone === 3 && this.level > 0 && this.invisible === "true") {
        for (let i = 0; i < this.level; i++) {}
      }
      //땅
      if (this.stone === 4 && this.level > 0 && this.invisible === "true") {
        for (let i = 0; i < this.level; i++) {
          let magic = new TowerMagic(this.scene, this);
          magic.setScale(3);
          petAttacks.add(magic);
          magic.anims.play(this.weaponSprite);
          let angle = Math.floor(Math.random() * 360);
          let x = Math.cos(angle * (Math.PI / 180));
          let y = Math.sin(angle * (Math.PI / 180));
          this.scene.physics.moveTo(magic, this.x + x, this.y + y, 300);
        }
      }
      //갓
      if (this.stone === 5 && this.level > 0 && this.invisible === "true") {
        for (let i = 0; i < this.level * 3; i++) {
          let magic = new TowerMagic(this.scene, this);
          petAttacks.add(magic);
          magic.anims.play(this.weaponSprite);
          let angle = Math.floor(Math.random() * 360);
          let x = Math.cos(angle * (Math.PI / 180));
          let y = Math.sin(angle * (Math.PI / 180));
          this.scene.physics.moveTo(magic, this.x + x, this.y + y, 300);
        }
      }
    }
    if (
      this.towerSkillAttackTimer >= this.towerSkillAS[this.stone][this.level]
    ) {
      this.towerSkillAttackTimer = 0;

      //노멀

      if (this.stone === 0 && this.level > 0 && this.invisible === "true") {
        let skill = new TowerSkill(
          this.scene,
          this,
          player.x,
          player.y,
          1,
          6000,
          2
        );

        UICam.ignore(skill);
        skill.anims.play(this.skillSprite);
        skill.setAlpha(0.5);
        thisScene.physics.add.overlap(skill, bossSet);
        thisScene.physics.add.overlap(skill, monsterSet);
      }
      //전기
      if (this.stone === 1 && this.level > 0 && this.invisible === "true") {
        for (let i = 0; i < this.towerSkillcount[this.stone][this.level]; i++) {
          let angle = Math.floor(Math.random() * 360);
          let x = Math.cos(angle * (Math.PI / 180)) * 300;
          let y = Math.sin(angle * (Math.PI / 180)) * 200;
          let skill = new TowerSkill(
            this.scene,
            this,
            player.x + x,
            player.y + y,
            1,
            1000,
            2
          );
          UICam.ignore(skill);
          skill.anims.play(this.skillSprite);
          thisScene.physics.add.overlap(skill, bossSet);
          thisScene.physics.add.overlap(skill, monsterSet);
        }
      }
      //불
      if (this.stone === 2 && this.level > 0 && this.invisible === "true") {
        for (let i = 0; i < this.towerSkillcount[this.stone][this.level]; i++) {
          let angle = Math.floor(Math.random() * 360);
          let x = Math.cos(angle * (Math.PI / 180)) * 300;
          let y = Math.sin(angle * (Math.PI / 180)) * 200;
          let skill = new TowerSkill(
            this.scene,
            this,
            player.x + x,
            player.y + y,
            1,
            6000,
            2
          );
          UICam.ignore(skill);
          skill.anims.play(this.skillSprite);
          thisScene.physics.add.overlap(skill, bossSet);
          thisScene.physics.add.overlap(skill, monsterSet);
        }
      }
      //물
      if (this.stone === 3 && this.level > 0 && this.invisible === "true") {
        for (let i = 0; i < this.towerSkillcount[this.stone][this.level]; i++) {
          let angle = Math.floor(Math.random() * 360);
          let x = Math.cos(angle * (Math.PI / 180));
          let y = Math.sin(angle * (Math.PI / 180));
          let skill = new TowerSkill(
            this.scene,
            this,
            player.x,
            player.y,
            1,
            15000,
            2
          );
          UICam.ignore(skill);
          skill.anims.play(this.skillSprite);
          this.scene.physics.moveTo(skill, skill.x + x, skill.y + y, 130);
          this.scene.physics.add.collider(skill, monsterSet);
          this.scene.physics.add.collider(skill, bossSet);
        }
      }
      //땅
      if (this.stone === 4 && this.level > 0 && this.invisible === "true") {
        let angle = Math.floor(Math.random() * 360);
        let x = Math.cos(angle * (Math.PI / 180)) * 300;
        let y = Math.sin(angle * (Math.PI / 180)) * 200;
        for (let i = 0; i < this.towerSkillcount[this.stone][this.level]; i++) {
          let skill = new TowerSkill(
            this.scene,
            this,
            player.x + i * 30,
            player.y,
            1,
            15000,
            2
          );
          UICam.ignore(skill);
          skill.body.immovable = true;
          skill.anims.play(this.skillSprite);
          this.scene.physics.add.collider(skill, monsterSet);
          this.scene.physics.add.collider(skill, bossSet);
        }
      }
      //갓
      if (this.stone === 5 && this.level > 0 && this.invisible === "true") {
        let skill = new TowerSkill(
          this.scene,
          this,
          player.x,
          player.y,
          1,
          6000,
          2
        );

        UICam.ignore(skill);
        skill.setSize(UICam.width, UICam.height);
        skill.anims.play(this.skillSprite);
        thisScene.physics.add.overlap(skill, bossSet);
        thisScene.physics.add.overlap(skill, monsterSet);
      }
    }

    if (this.level > 0 && this.invisible === "false") {
      this.invisible = "true";
      this.setVisible(true);
    }
  }

  scale_Circle() {
    this.setScale(this.circleSize);
    let hw = this.body.halfWidth;
    let hh = this.body.halfHeight;
    this.setCircle(hw * 5, (hh - hw) * 5, (hh - hw) * 5);
  }

  levelUp() {
    this.level++;
  }

  overlaphit() {}
}
