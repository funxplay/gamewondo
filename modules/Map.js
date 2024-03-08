import Block from "./Block.js";
import Palette from "./Palette.js";
import Player from "./Player.js";

export default class Map{
    constructor(bgImg, blockImg) {
        this.bgImg = bgImg;
        this.blockImg = blockImg;
        this.skeleton = [
            // w = (0...19) x h = (0...13)
            "                    ", // 0
            "                    ", // 1
            "                    ", // 2
            "                    ", // 3
            "xxxxx         xxxxxx", // 4
            "                    ", // 5
            "                    ", // 6
            "                    ", // 7
            "     xxxxxxxxxx     ", // 8
            "                    ", // 9
            "                    ", // 10
            "                    ", // 11
            "                    ", // 12
            "xxxxxxxxxxxxxxxxxxxx", // 13
        ];
        this.blocks = [];
        for (let row = 0; row < 14; row++) {
            for (let col = 0; col < 20; col++) {
                if (this.skeleton[row][col] == "x") {
                    this.blocks.push(new Block(col, row));
                };
            };
        };
        this.createNewPlayers();
    }

    update(layer, correction, input, scene) {
        this.blocks.forEach((block) => {
            block.update(layer)
        });
        this.lp.update(correction, layer, input, this);
        this.rp.update(correction, layer, input, this);
        this.collisionPlayers(correction, layer, input);
        if (this.lp.hp == 0 || this.rp.hp == 0) {
            if (this.lp.hp == 0) scene.end.currentPlayerImg = scene.end.rpImg;
            if (this.rp.hp == 0) scene.end.currentPlayerImg = scene.end.lpImg;
            scene.state = "end";
        };
    }

    createNewPlayers() {
        this.lp = new Player(0, 2/14, Palette.red, true, 65, 68, 87, 83);
        this.rp = new Player(19/20, 2/14, Palette.blue, false, 37, 39, 38, 40);
    }

    draw(layer) {
        layer.context.drawImage(this.bgImg, layer.bgX, layer.bgY, layer.bgW, layer.bgH);
        this.blocks.forEach((block) => {
            block.draw(layer, this.blockImg);
        });
        this.lp.draw(layer);
        this.rp.draw(layer);
    }

    collisionPlayers(correction, layer, input) {
        if ((this.lp.x - this.rp.x) * (this.lp.x - this.rp.x) + (this.lp.y - this.rp.y) * (this.lp.y - this.rp.y) > layer.cellSize * layer.cellSize) return;
        
        this.lp.freeze = true;
        this.rp.freeze = true;

        if (this.lp.y - this.rp.y > 0 && this.rp.isFly == true) {
            this.lp.hp -= 5;
        };
        if (this.lp.y - this.rp.y < 0 && this.lp.isFly == true) {
            this.rp.hp -= 5;
        };
    }
}