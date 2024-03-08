import Palette from "./Palette.js";

export default class Scene{
    constructor(map, end, gameVersion) {
        this.map = map;
        this.end = end;
        this.state = "start";
        this.correction = 0;

        this.gameVersion = `Ver. ${gameVersion}`;
        this.versionTextColor = Palette.white;
    }
    update(correction, layer, start, input) {
        this.correction = correction;
        switch (this.state) {
            case "start":
                start.update(layer, input, this);
                break;
            case "game":
                this.map.update(layer, correction, input, this);
                break;
            case "end":
                this.end.update(layer, input, this);
                break;
            default:
                console.log("default update");
                break;
        };

        this.versionFontSize = layer.cellSize / 2;
        this.versionX = layer.bgX + 9.3 * layer.cellSize;
        this.versionY = layer.bgY + layer.bgH - 0.2 * layer.cellSize;
    }

    draw(layer, start) {
        switch (this.state) {
            case "start":
                start.draw(layer);
                break;
            case "game":
                this.map.draw(layer);
                break;
            case "end":
                this.end.draw(layer);
                break;
            default:
                console.log("default draw");
                break;
        };

        // DRAW VERSION
        layer.context.font = `${this.versionFontSize}px serif`;
        layer.context.fillStyle = this.versionTextColor;
        layer.context.fillText(this.gameVersion, this.versionX, this.versionY);
    }
}