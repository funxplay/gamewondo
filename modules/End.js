import Palette from "./Palette.js";

export default class End{
    constructor(bgImg, restartImg, lpImg, rpImg, gameName) {
        this.bgImg = bgImg;
        this.restartImg = restartImg;
        this.lpImg = lpImg;
        this.rpImg = rpImg;
        this.currentPlayerImg;
        this.gameName = gameName;
        this.gameNameTextColor = Palette.white;
    }
    update(layer, input, scene) {
        this.playerX = layer.bgX + 6.7 * layer.cellSize;
        this.playerY = layer.bgY + 1 * layer.cellSize;
        this.playerW = 7 * layer.cellSize;
        this.playerH = 7 * layer.cellSize;

        this.restartX = layer.bgX + 4 * layer.cellSize;
        this.restartY = layer.bgY + 9 * layer.cellSize;
        this.restartW = 12 * layer.cellSize;
        this.restartH = 4 * layer.cellSize;

        if (input.mouse.x > this.restartX && 
            input.mouse.x < (this.restartX + this.restartW) &&
            input.mouse.y > this.restartY && 
            input.mouse.y < (this.restartY + this.restartH)) {
                this.restartX -= layer.cellSize/2;
                this.restartY -= layer.cellSize/2;
                this.restartW += layer.cellSize;
                this.restartH += layer.cellSize;

                if (input.mouse.isUp === true) {
                    scene.map.createNewPlayers();
                    scene.state = "game";
                };
            };

        this.gameNameFontSize = layer.cellSize/1.6;
        this.gameNamex = layer.bgX + 8.3 * layer.cellSize;
        this.gameNameY = layer.bgY + 1 * layer.cellSize;
    }
    draw(layer) {
        layer.context.drawImage(this.bgImg, layer.bgX, layer.bgY, layer.bgW, layer.bgH);
        layer.context.drawImage(this.restartImg, this.restartX, this.restartY, this.restartW, this.restartH);
        layer.context.drawImage(this.currentPlayerImg, this.playerX, this.playerY, this.playerW, this.playerH);

        layer.context.font = `${this.gameNameFontSize}px serif`;
        layer.context.fillStyle = this.gameNameTextColor;
        layer.context.fillText(this.gameName, this.gameNamex, this.gameNameY);
    }
}