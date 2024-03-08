export default class Block {
    constructor(col, row) {
        this.col = col;
        this.row = row;
    }

    update(layer) {
        this.x = layer.bgX + layer.cellSize * this.col;
        this.y = layer.bgY + layer.cellSize * this.row;
        this.w = layer.cellSize;
        this.h = layer.cellSize;
        this.left = this.x;
        this.top = this.y;
        this.right = this.x + this.w;
        this.bottom = this.y + this.h;
    }

    draw(layer, blockImg) {
        layer.context.drawImage(blockImg, this.x, this.y, this.w, this.h);
    }

}