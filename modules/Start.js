import Palette from "./Palette.js";

export default class Start{
    constructor(bgImg, startImg, gameName) {
        this.bgImg = bgImg;
        this.startImg = startImg;
        this.gameName = gameName;
        this.gameNameTextColor = Palette.white;
    }
    update(layer, input, scene) {
        this.startX = layer.bgX + 5 * layer.cellSize;
        this.startY = layer.bgY + 4 * layer.cellSize;
        this.startW = 10 * layer.cellSize;
        this.startH = 4 * layer.cellSize;

        if (input.mouse.x > this.startX && 
            input.mouse.x < (this.startX + this.startW) &&
            input.mouse.y > this.startY && 
            input.mouse.y < (this.startY + this.startH)) {
                this.startX -= layer.cellSize/2;
                this.startY -= layer.cellSize/2;
                this.startW += layer.cellSize;
                this.startH += layer.cellSize;

                if (input.mouse.isUp === true) {
                    scene.state = "game";
                };
            };
        
        this.gameNameFontSize = layer.cellSize/1.6;
        this.gameNamex = layer.bgX + 8.3 * layer.cellSize;
        this.gameNameY = layer.bgY + 1 * layer.cellSize;
    }
    draw(layer) {
        layer.context.drawImage(this.bgImg, layer.bgX, layer.bgY, layer.bgW, layer.bgH);
        layer.context.drawImage(this.startImg, this.startX, this.startY, this.startW, this.startH);

        layer.context.font = `${this.gameNameFontSize}px serif`;
        layer.context.fillStyle = this.gameNameTextColor;
        layer.context.fillText(this.gameName, this.gameNamex, this.gameNameY);
    }
}