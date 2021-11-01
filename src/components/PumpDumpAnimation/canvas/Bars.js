import { ROSI_GAME_MAX_DURATION_SEC } from 'constants/RosiGame';
import * as PIXI from 'pixi.js';
import * as particles from '@pixi/particle-emitter';
import {
  calcPercent,
  isMobileRosiGame,
  calcCrashFactorFromElapsedTime,
} from './utils';

const AXIS_LABEL_NUM = 50;
const AXIS_LABEL_FONT_FAMILY = 'PlusJakarta-Bold';
const AXIS_LABEL_COLOR = 0xffffff;
const AXIS_LABEL_FONT_SIZE = 10;

export class Bars {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();

    console.log('BARS ARE HEREEEEEEEEE');

    /* axis labels */
    this.axisLabels = [];
    for (let i = 0; i < AXIS_LABEL_NUM; i++) {
      const label = new PIXI.Text('0', {
        fontFamily: AXIS_LABEL_FONT_FAMILY,
        fontSize: AXIS_LABEL_FONT_SIZE,
        fill: AXIS_LABEL_COLOR,
      });
      label.visible = false;
      label.anchor.x = 0.5;
      label.anchor.y = 0.5;
      this.axisLabels.push(label);
      this.container.addChild(label);
    }

    // CONTAINER WITH BARS
    this.bars = [];
    this.reactions = [];
    this.basicBarWidth = 30;

    this.trajectory = new PIXI.Graphics();
    this.container.addChild(this.trajectory);

    this.elonAndCoin = new PIXI.Container();
    this.container.addChild(this.elonAndCoin);

    this.coin = new PIXI.Sprite(this.app.loader.resources.coin.texture);
    this.elonAndCoin.addChild(this.coin);

    const spritesheet =
      this.app.loader.resources['elon-coin-animation'].spritesheet;
    this.elon = new PIXI.AnimatedSprite(Object.values(spritesheet.textures));
    this.elon.x = -92 / (isMobileRosiGame ? 2 : 1);
    this.elon.y = -111 / (isMobileRosiGame ? 2 : 1);
    this.elonAndCoin.addChild(this.elon);

    this.elonAndCoindAnimationHandle = null;
    this.elonAfterExplosionAnimationHandle = null;

    this.setCoinDefaultPosition();

    this.container.visible = false;

    this.boundary = {
      x0: 0,
      x1: this.app.renderer.width - (isMobileRosiGame ? 50 : 55),
      y0: calcPercent(this.app.renderer.height, 74),
      y1: calcPercent(this.app.renderer.height, 25),
    };

    this.trajectoryAngle = Math.atan2(
      this.boundary.y0 - this.boundary.y1,
      this.boundary.x1 - this.boundary.x0,
      0
    );

    this.gameStartTime = Date.now();

    /* TODO: move to  utils */
    this.getGlobalPositionByTime = time => {
      const x = time * 0.8;

      const y = (calcCrashFactorFromElapsedTime(time) - 1) * 100;
      return { x, y };
    };

    this.getTime = (rX, scaleX) => {
      const x = (rX - this.boundary.x0) / scaleX;
      return x;
    };

    this.getScaleYByGlobalY = y => {
      const dY = this.boundary.y0 - this.boundary.y1;
      let scaleY = 1;

      if (y * scaleY >= dY) {
        scaleY = dY / y;
      }
      return scaleY;
    };

    this.getRealPosition = gPos => {
      const { x, y } = gPos;
      const dX = this.boundary.x1 - this.boundary.x0;
      const scaleX = x > dX ? dX / x : 2 - x / dX;

      const scaleY = this.getScaleYByGlobalY(y);
      return this.getRealPositionByScale(gPos, { scaleX, scaleY });
    };

    this.getRealPositionByScale = (gPos, scale) => {
      const { x, y } = gPos;
      const { scaleX, scaleY } = scale;

      const rX = x * scaleX + this.boundary.x0;
      const rY = -y * scaleY + this.boundary.y0;

      return {
        x: rX,
        y: rY,
        scaleX,
        scaleY,
      };
    };

    this.printOne = () => {
      console.log('OOOOOOOOOOOONE');
    };

    //this function is responsible for creating a stngle bar for the graph
    this.createGradRectangle = (
      color1,
      color2,
      lineColor,
      x,
      y,
      width,
      height,
      app
    ) => {
      const canvas = document.createElement('canvas');

      let width = 20 * scaleX;

      // need to find from where I get the scale
      // width = width * scaleX
      // height = height * scaleX;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');

      // use canvas2d API to create gradient
      const grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, color1);
      grd.addColorStop(1, color2);

      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      const container = new PIXI.Container();
      app.stage.addChild(container);
      container.x = x;
      container.y = y;
      container.pivot.y = height;

      const barLine = new PIXI.Graphics();

      barLine.lineStyle(2, lineColor, 1);
      barLine.moveTo(0, -height * 0.65);
      barLine.lineTo(0, height * 0.65);

      barLine.x = width / 2;
      barLine.y = height / 2;

      const graphics = new PIXI.Graphics()
        .beginTextureFill({ texture: PIXI.Texture.from(canvas) })
        .drawRoundedRect(0, 0, width, height, 3)
        .endFill();

      container.addChild(barLine);

      container.scale.set(0.01, 0.01);

      container.addChild(graphics);

      var counter = 1;
      var i = setInterval(function () {
        container.scale.set(0.01 * counter, 0.01 * counter);
        counter++;
        if (counter === 101) {
          clearInterval(i);
        }
      }, 5);

      this.bars.push(graphics);

      return graphics;
    };

    // function to spawn a new sticker and scale it
    this.createSticker = (logo, x, y) => {
      logo.anchor.set(0.5);

      // Move the sprite to the center of the screen
      logo.x = x;
      logo.y = y;

      logo.scale.set(0.01);

      app.app.stage.addChild(logo);

      var i = setInterval(function () {
        // do your thing
        logo.scale.set(0.01 * counter, 0.01 * counter);
        counter++;
        if (counter === 40) {
          clearInterval(i);
        }
      }, 10);

      this.stickers.push(logo);

      return logo;
    };
  }

  getCurrentElonFrame() {
    return this.elon.currentFrame;
  }

  getElonFramesCount() {
    return this.elon.totalFrames;
  }

  setElonFrame(frame) {
    if (frame <= this.elon.totalFrames) {
      this.elon.gotoAndStop(frame);
    }
  }

  setCoinDefaultPosition() {
    this.elonAndCoin.scale.set(1);
    this.elonAndCoin.x = 0;
    this.elonAndCoin.y = this.app.renderer.height - this.coin.height / 2;
  }

  getCoinExplosionPosition() {
    const coinGlobalPos = this.coin.toGlobal(this.coin.position);
    return {
      x: coinGlobalPos.x + this.coin.width / 2,
      y: coinGlobalPos.y + this.coin.height / 2,
    };
  }

  getCoinCrashPosition() {
    const coinGlobalPos = this.coin.toGlobal(this.coin.position);
    return {
      x: coinGlobalPos.x,
      y: coinGlobalPos.y + this.coin.height / 2,
    };
  }

  canUpdateElonFrame() {
    return true; // TODO: consider further
  }

  startCoinFlyingAnimation(gameStartTime) {
    this.gameStartTime = gameStartTime;
    this.container.visible = true;
    this.resetAllAnimations();
    this.setCoinDefaultPosition();

    /* Star Particle (flame) */
    this.flameEmitter.emit = true;

    /* Coin and Elon */
    let time = 0;
    /* Trajectory */
    const tSegs = 600;
    let randYArray = Array(tSegs + 1)
      .fill()
      .map(() => null); // trajectory path: traPath[rX] = rY

    const firstPos = this.getRealPosition({ x: 0, y: 0 });
    let prevTime = Date.now() - this.gameStartTime;

    const update = dt => {
      time = Date.now() - this.gameStartTime;
      const gPos = this.getGlobalPositionByTime(time);
      const rPos = this.getRealPosition(gPos);

      this.elonAndCoin.x =
        rPos.x + Math.cos(time / 100) / 3 - (isMobileRosiGame ? 30 : 60);
      this.elonAndCoin.y = rPos.y + Math.sin(time / 200) * 1.5 + Math.random();
      this.elonAndCoin.rotation = -Math.sin(time / 100) / 100;
      this.flameEmitter.updateOwnerPos(
        this.elonAndCoin.x,
        this.elonAndCoin.y + (isMobileRosiGame ? 25 : 50)
      ); // set flame

      this.flameEmitter.rotate(-this.trajectoryAngle + (Math.PI * 3) / 2); // TODO: particle direction

      // Draw trajectory path
      const strokeWidth = 1;
      const offsetY = isMobileRosiGame ? 30 : 60;
      this.trajectory.clear();
      this.trajectory.moveTo(firstPos.x - strokeWidth, offsetY);
      const randEtries = [...randYArray];
      randYArray = [];

      randEtries.forEach((e, i) => {
        const t = (i / tSegs) * prevTime;
        const tP = Math.floor((t / time) * tSegs);

        const gP = this.getGlobalPositionByTime(t);
        this.trajectory.lineStyle(2, 0x7300d8, strokeWidth);
        const rP = this.getRealPositionByScale(
          { x: gP.x, y: gP.y + rPos.scaleY * (e ? e * 1 : 0) * 0.001 },
          rPos
        );
        this.trajectory.lineTo(
          rP.x - strokeWidth - 2,
          (rP.y < 0 ? 0 : rP.y) + offsetY
        );
        const gP1 = this.getGlobalPositionByTime(t + 1000);
        randYArray[tP] = e
          ? e
          : Math.sin((t / 1000) * Math.PI) * (gP1.y - gP.y) * t * 0.02;
      });
      const gPos1 = this.getGlobalPositionByTime(time + 1000);

      randYArray[tSegs] =
        Math.sin((time / 1000) * Math.PI) * (gPos1.y - gPos.y) * time * 0.02;

      /* x axis */
      this.axisLabels.forEach(e => (e.visible = false));
      this.trajectory.lineStyle(2, 0xeaeaea, strokeWidth);
      const sT =
        time < 10000
          ? 1000
          : time < 20000
          ? 2000
          : time < 100000
          ? 10000
          : time < 200000
          ? 20000
          : 100000;
      let labelIndex = 0;
      for (let aT = 0, index = 0; aT < time; aT += sT, index++) {
        const gP = this.getGlobalPositionByTime(aT);
        const rP = this.getRealPositionByScale({ x: gP.x, y: 0 }, rPos);
        this.trajectory.moveTo(rP.x - strokeWidth, this.boundary.y0 + offsetY);
        this.trajectory.lineTo(
          rP.x - strokeWidth,
          this.boundary.y0 + 10 + offsetY
        );
        this.axisLabels[index].text = `${aT / 1000}s`;
        this.axisLabels[index].visible = aT ? true : false;
        this.axisLabels[index].x = rP.x - strokeWidth;
        this.axisLabels[index].y = this.boundary.y0 + 10 + offsetY + 2;
        this.axisLabels[index].anchor.x = 0.5;
        this.axisLabels[index].anchor.y = 0;
        this.axisLabels[index].alpha = 1;
        labelIndex = index;
      }

      /* y axis */
      const mF = calcCrashFactorFromElapsedTime(time);
      const sV =
        mF > 25
          ? 30
          : mF > 18
          ? 20
          : mF > 12
          ? 10
          : mF > 7
          ? 5
          : mF > 4
          ? 2
          : 1;
      const dY =
        this.getRealPositionByScale({ x: 0, y: sV * 100 }, rPos).y -
        this.getRealPositionByScale({ x: 0, y: 0 }, rPos).y;

      for (
        let aV = 0, index = labelIndex + 1;
        aV < Math.max(mF * 2, 10);
        aV += sV, index++
      ) {
        const { y } = this.getRealPositionByScale({ x: 0, y: aV * 100 }, rPos);

        /* small division */
        let sDY =
          Math.abs(dY) > 100
            ? dY / 20
            : Math.abs(dY) > 60
            ? dY / 10
            : Math.abs(dY) > 40
            ? dY / 6
            : dY;
        for (let yy = 0; yy < Math.abs(dY); yy += Math.abs(sDY)) {
          this.trajectory.lineStyle(2, 0x666666, 1);
          this.trajectory.moveTo(this.boundary.x1 + 4, y + offsetY - yy);
          this.trajectory.lineTo(this.boundary.x1 + 10, y + offsetY - yy);
        }

        /* main division */
        this.trajectory.lineStyle(2, 0xffffff, 1);
        this.trajectory.moveTo(this.boundary.x1, y + offsetY);
        this.trajectory.lineTo(this.boundary.x1 + 10, y + offsetY);

        this.axisLabels[index].text = `${(aV + 1).toFixed(2)}x`;
        this.axisLabels[index].visible = true;
        this.axisLabels[index].x = this.boundary.x1 + 10 + 2;
        this.axisLabels[index].y = y + offsetY;
        this.axisLabels[index].anchor.x = 0;
        this.axisLabels[index].anchor.y = 0.5;
        this.axisLabels[index].alpha = 1;

        index++;

        /* half division */
        this.trajectory.lineStyle(2, 0x666666, 1);
        this.trajectory.moveTo(this.boundary.x1 + 2, y + offsetY + dY / 2);
        this.trajectory.lineTo(this.boundary.x1 + 10, y + offsetY + dY / 2);

        this.axisLabels[index].text = `${(aV + sV / 2 + 1).toFixed(2)}x`;
        this.axisLabels[index].visible = true;
        this.axisLabels[index].x = this.boundary.x1 + 10 + 2;
        this.axisLabels[index].y = y + offsetY + dY / 2;
        this.axisLabels[index].anchor.x = 0;
        this.axisLabels[index].anchor.y = 0.5;
        this.axisLabels[index].alpha = 0.5;
      }

      prevTime = time;
    };

    this.elonAndCoindAnimationHandle = update;
    this.app.ticker.add(update);
  }

  endCoinFlyingAnimation() {
    this.flameEmitter.emit = false;

    if (this.elonAndCoindAnimationHandle) {
      this.app.ticker.remove(this.elonAndCoindAnimationHandle);
      this.elonAndCoindAnimationHandle = null;
    }

    this.coin.alpha = 0;
    this.elon.alpha = 0;
  }

  resetAllAnimations() {
    if (this.elonAndCoindAnimationHandle) {
      this.app.ticker.remove(this.elonAndCoindAnimationHandle);
      this.elonAndCoindAnimationHandle = null;
    }

    if (this.elonAfterExplosionAnimationHandle) {
      this.app.ticker.remove(this.elonAfterExplosionAnimationHandle);
      this.elonAfterExplosionAnimationHandle = null;
    }

    this.coin.alpha = 1;
    this.elon.alpha = 1;
    this.elonAndCoin.rotation = 0;
    this.elon.gotoAndStop(0);

    this.flameEmitter.emit = false;

    this.trajectory.clear();
  }

  isBoostAnimComplete() {
    return this.initialBoostAnimationComplete === true;
  }
}
