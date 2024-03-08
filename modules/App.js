import Layer from './Layer.js'
import Loop from './Loop.js'
import Scene from './Scene.js'
import Input from './Input.js'
import Map from './Map.js'
import Music from './Music.js'
import Start from './Start.js'
import End from './End.js'

export default class App {
  GAME_NAME = 'GameWondo';
  GAME_VERSION = '1.0';
  constructor(container, bgImg, startImg, blockImg, restartImg, lpImg, rpImg, bgEnd) {
  	this.layer = new Layer(container);
    this.input = new Input(this.layer.canvas);
    this.map = new Map(bgImg, blockImg);
    this.start = new Start(bgImg, startImg, this.GAME_NAME);
    this.end = new End(bgEnd, restartImg, lpImg, rpImg, this.GAME_NAME);
    this.music = new Music();
    this.scene = new Scene(this.map, this.end, this.GAME_VERSION);
    new Loop(this.update.bind(this), this.display.bind(this));
  }

  update(correction) {
    this.scene.update(correction, this.layer, this.start, this.input);
    this.input.update();
  }
  display() {
    this.layer.context.clearRect(0, 0, this.layer.w, this.layer.h);
    this.scene.draw(this.layer, this.start);
  }
}

onload = () => {
  const bgImg = new Image();
  const startImg = new Image();
  const blockImg = new Image();
  const restartImg = new Image();
  const lpImg = new Image();
  const rpImg = new Image();
  const bgEnd = new Image();
  bgImg.addEventListener("load", () => {
    startImg.addEventListener("load", () => {
      blockImg.addEventListener("load", () => {
        restartImg.addEventListener("load", () => {
          lpImg.addEventListener("load", () => {
            rpImg.addEventListener("load", () => {
              bgEnd.addEventListener("load", () => {
                new App(document.body, bgImg, startImg, blockImg, restartImg, lpImg, rpImg, bgEnd);
              });
            });
          });
        });
      });
    });
  });
  bgImg.src = "./img/bg.png";
  startImg.src = "./img/start.png";
  blockImg.src = "./img/block.png";
  restartImg.src = "./img/restart.png";
  lpImg.src = "./img/LP.png";
  rpImg.src = "./img/RP.png";
  bgEnd.src = "./img/bgEnd.png";
}