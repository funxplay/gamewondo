import Palette from "./Palette.js";

export default class Player{
    FREEZE_TIME = 0.25;
    constructor(koeffX, koeffY, color, moveRight, keyCodeLeft, keyCodeRight, keyCodeUp, keyCodeDown) {
        this.freeze = false;
        this.freezeCounter = 0;
        this.keyCodeLeft = keyCodeLeft;
        this.keyCodeRight = keyCodeRight;
        this.keyCodeUp = keyCodeUp;
        this.keyCodeDown = keyCodeDown;
        this.isKeyLeftPressedFreeze = false;
        this.isKeyRightPressedFreeze = false;
        this.koeffY = koeffY;
        this.koeffX = koeffX;
        this.color = color;
        this.koeffVx = 10;
        this.doubleKoeffVx = 30;
        this.vy = 0;
        this.acc = 0;
        this.accKoeff = 25;
        this.doubleAccKoeff = 250;
        this.moveRight = moveRight;
        this.isFly = true;
        this.jumpKoeff = 16.5;
        this.x = 0;
        this.y = 0;
        this.body = {x: 0, y: 0, w: 0, h: 0, lineWidth: 0};
        this.belt = {x: 0, y: 0, w: 0, h: 0 };
        this.eye = {cx: 0, cy: 0, r: 0};
        this.legs = {
            left: {cx: 0, cy: 0, r: 0},
            right: {cx: 0, cy: 0, r: 0}
        };
        this.knot = {
            top: {x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0},
            bottom: {x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0}
        };
        this.hp = 100;
        this.hpColor = color; 
    }

    update(correction, layer, input, map) {
        if (this.freeze && this.freezeCounter < this.FREEZE_TIME) {
            if (this.freezeCounter == 0) {
                this.isKeyLeftPressedFreeze = !this.isKeyLeftPressed;
                this.isKeyRightPressedFreeze = !this.isKeyRightPressed;
                if (this.vy != 0) {
                    this.vyFreeze = -layer.cellSize * this.jumpKoeff;
                } else {
                    this.vyFreeze = -this.vy;
                };
            };
            this.freezeCounter += correction;

            this.isKeyLeftPressed = this.isKeyLeftPressedFreeze;
            this.isKeyRightPressed = this.isKeyRightPressedFreeze;
            this.vy = this.vyFreeze;
        } else {
            this.freeze = false;
            this.freezeCounter = 0;
            this.isKeyLeftPressed = input.keys.indexOf(this.keyCodeLeft) != -1;
            this.isKeyRightPressed = input.keys.indexOf(this.keyCodeRight) != -1;
            this.isKeyUpPressed = input.keys.indexOf(this.keyCodeUp) != -1;
            this.isKeyDownPressed = input.keys.indexOf(this.keyCodeDown) != -1;
        };

        this.y = this.koeffY * layer.bgH;
        this.x = this.koeffX * layer.bgW;
        
        this.acc = this.isKeyDownPressed ? layer.cellSize * this.doubleAccKoeff : layer.cellSize * this.accKoeff;

        if (!(this.isKeyLeftPressed && this.isKeyRightPressed)) {
            if (this.isKeyLeftPressed) {
                this.moveRight = false;
            };
            if (this.isKeyRightPressed) {
                this.moveRight = true;
            };
        };

        if (this.isKeyUpPressed && !this.isFly) {
            this.vy -= layer.cellSize * this.jumpKoeff;
        };

        const directionX = this.moveRight ? 1 : -1;

        const A = {gx: this.x + layer.bgX + directionX * layer.cellSize * (this.isKeyDownPressed ? this.doubleKoeffVx : this.koeffVx) * correction, gy: this.y + layer.bgY + (this.acc * correction + this.vy) * correction}; // player top left dot in future
        const B = {gx: A.gx + layer.cellSize, gy: A.gy}; // player top right dot in future
        const C = {gx: A.gx, gy: A.gy + layer.cellSize}; // player bottom left dot in future
        const D = {gx: A.gx + layer.cellSize, gy: A.gy + layer.cellSize}; // player bottom right dot in future

        const collisionX = this.collisionDetectX(layer, map, A, B, C, D);
        const collisionY = this.collisionDetectY(layer, map, A, B, C, D);
        const collisionUp = this.collisionDetectUp(layer, map, A, B, C, D);

        if (collisionUp !== undefined) {
            this.vy = -this.vy;
        };

        if (collisionY === undefined) {
            this.isFly = true;
            if (collisionUp === undefined) {
                this.y = A.gy - layer.bgY;    
            } else {
                this.y = collisionUp - layer.bgY;
            };
            this.vy += this.acc * correction;
        } else {
            this.isFly = false;
            this.y = collisionY - layer.bgY - layer.cellSize;
            this.vy = 0;
        };
        
        if (!(this.isKeyLeftPressed && this.isKeyRightPressed)) {
            if (this.isKeyLeftPressed) {
                if (collisionX === undefined) {
                    this.x = A.gx - layer.bgX;
                } else {
                    if (collisionUp === undefined) this.x = collisionX - layer.bgX;
                };
            };
            if (this.isKeyRightPressed) {
                if (collisionX === undefined) {
                    this.x = A.gx - layer.bgX;
                } else {
                    if (collisionUp === undefined) this.x = collisionX - layer.bgX - layer.cellSize;
                };
            };
        };

        this.legs.left.r = layer.cellSize / 8;
        this.legs.left.cx = this.x + layer.bgX + layer.cellSize / 6 + this.legs.left.r;
        this.legs.left.cy = this.y + layer.bgY+ layer.cellSize - this.legs.left.r;

        this.legs.right.r = this.legs.left.r;
        this.legs.right.cx = this.x + layer.bgX + 5 * layer.cellSize / 6 -  this.legs.right.r;
        this.legs.right.cy = this.legs.left.cy;

        this.body.x = this.x + layer.bgX + layer.cellSize / 6;
        this.body.y = this.y + layer.bgY;
        this.body.w = 2 * layer.cellSize / 3;
        this.body.h = 5 * layer.cellSize / 6;
        this.body.lineWidth = layer.cellSize / 6;

        this.belt.x = this.x + layer.bgX + layer.cellSize / 6;
        this.belt.y = this.y + layer.bgY+ layer.cellSize / 2;
        this.belt.w = 2 * layer.cellSize / 3;
        this.belt.h = layer.cellSize / 10;

        this.hpFontSize = layer.cellSize/1.6;
        this.hpX = this.color == Palette.red ? layer.bgX : layer.bgX + layer.bgW - layer.cellSize;
        this.hpY = layer.bgY + 0.6 * layer.cellSize;

        switch (this.moveRight) {
            case true:
                this.eye.cx = this.x + layer.bgX + 2 * layer.cellSize / 3;
                this.eye.cy = this.y + layer.bgY+ layer.cellSize / 6;
                this.eye.r = layer.cellSize / 12;
                break;
            case false:
                this.eye.cx = this.x + layer.bgX + 1 * layer.cellSize / 3;
                this.eye.cy = this.y + layer.bgY+ layer.cellSize / 6;
                this.eye.r = layer.cellSize / 12;
                break;
        };

        switch (this.moveRight) {
            case true:
                this.knot.top.x1 = this.belt.x + this.belt.w;
                this.knot.top.y1 = this.belt.y;
                this.knot.top.x2 = this.knot.top.x1 + 1.5 * layer.cellSize / 6;
                this.knot.top.y2 = this.knot.top.y1 - 1.5 * layer.cellSize / 12;
                this.knot.top.x3 = this.knot.top.x1 + 1.5 * layer.cellSize / 12;
                this.knot.top.y3 = this.knot.top.y1 + 1.5 * layer.cellSize / 12;

                this.knot.bottom.x1 = this.knot.top.x1;
                this.knot.bottom.y1 = this.belt.y + this.belt.h;
                this.knot.bottom.x2 = this.knot.top.x2;
                this.knot.bottom.y2 = this.knot.bottom.y1 + 1.5 * layer.cellSize / 12;
                this.knot.bottom.x3 = this.knot.top.x3;
                this.knot.bottom.y3 = this.knot.bottom.y1 - 1.5 * layer.cellSize / 12;
                break;
            case false:
                this.knot.top.x1 = this.belt.x;
                this.knot.top.y1 = this.belt.y;
                this.knot.top.x2 = this.knot.top.x1 - 1.5 * layer.cellSize / 6;
                this.knot.top.y2 = this.knot.top.y1 - 1.5 * layer.cellSize / 12;
                this.knot.top.x3 = this.knot.top.x1 - 1.5 * layer.cellSize / 12;
                this.knot.top.y3 = this.knot.top.y1 + 1.5 * layer.cellSize / 12;

                this.knot.bottom.x1 = this.knot.top.x1;
                this.knot.bottom.y1 = this.belt.y + this.belt.h;
                this.knot.bottom.x2 = this.knot.top.x2;
                this.knot.bottom.y2 = this.knot.bottom.y1 + 1.5 * layer.cellSize / 12;
                this.knot.bottom.x3 = this.knot.top.x3;
                this.knot.bottom.y3 = this.knot.bottom.y1 - 1.5 * layer.cellSize / 12;
                break;
        };

        this.koeffY = this.y / layer.bgH;
        this.koeffX = this.x / layer.bgW;
    }

    collisionDetectY(layer, map, A, B, C, D) {
        for (let index = 0; index < map.blocks.length; index++) {
            if (this.x + layer.bgX == map.blocks[index].left && C.gy > map.blocks[index].top && C.gy < map.blocks[index].bottom) return map.blocks[index].top;
            if (this.x + layer.bgX + layer.cellSize == map.blocks[index].right && D.gy > map.blocks[index].top && D.gy < map.blocks[index].bottom) return map.blocks[index].top;
            if (C.gy > map.blocks[index].top && C.gy < map.blocks[index].bottom && this.x + layer.bgX > map.blocks[index].left && this.x + layer.bgX < map.blocks[index].right) return map.blocks[index].top;
            if (D.gy > map.blocks[index].top && D.gy < map.blocks[index].bottom && this.x + layer.bgX + layer.cellSize > map.blocks[index].left && this.x + layer.bgX + layer.cellSize < map.blocks[index].right) return map.blocks[index].top;
        };
        return undefined;
    }

    collisionDetectUp(layer, map, A, B, C, D) {
        for (let index = 0; index < map.blocks.length; index++) {
            if (this.x + layer.bgX == map.blocks[index].left && A.gy > map.blocks[index].top && A.gy < map.blocks[index].bottom) return map.blocks[index].bottom;
            if (this.x + layer.bgX + layer.cellSize == map.blocks[index].right && B.gy > map.blocks[index].top && B.gy < map.blocks[index].bottom) return map.blocks[index].bottom;
            if (A.gy > map.blocks[index].top && A.gy < map.blocks[index].bottom && this.x + layer.bgX > map.blocks[index].left && this.x + layer.bgX < map.blocks[index].right) return map.blocks[index].bottom;
            if (B.gy > map.blocks[index].top && B.gy < map.blocks[index].bottom && this.x + layer.bgX + layer.cellSize > map.blocks[index].left && this.x + layer.bgX + layer.cellSize < map.blocks[index].right) return map.blocks[index].bottom;
        };
        return undefined;
    }

    collisionDetectX(layer, map, A, B, C, D) {
        if (this.moveRight === true) {
            if (this.x + layer.bgX + layer.cellSize == layer.bgX + layer.bgW) return layer.bgX + layer.bgW;
            if (B.gx > layer.bgX + layer.bgW) return layer.bgX + layer.bgW;
            for (let index = 0; index < map.blocks.length; index++) {
                if (this.y + layer.bgY == map.blocks[index].top && B.gx > map.blocks[index].left && B.gx < map.blocks[index].right) return map.blocks[index].left;
                if (this.y + layer.bgY + layer.cellSize == map.blocks[index].bottom && D.gx > map.blocks[index].left && D.gx < map.blocks[index].right) return map.blocks[index].left;
                if (B.gx > map.blocks[index].left && B.gx < map.blocks[index].right && this.y + layer.bgY > map.blocks[index].top && this.y + layer.bgY < map.blocks[index].bottom) return map.blocks[index].left;
                if (D.gx > map.blocks[index].left && D.gx < map.blocks[index].right && this.y + layer.bgY + layer.cellSize > map.blocks[index].top && this.y + layer.bgY + layer.cellSize < map.blocks[index].bottom) return map.blocks[index].left;
            };
        } else {
            if (this.x + layer.bgX == layer.bgX) return layer.bgX;
            if (A.gx < layer.bgX) return layer.bgX;
            for (let index = 0; index < map.blocks.length; index++) {
                if (this.y + layer.bgY == map.blocks[index].top && A.gx > map.blocks[index].left && A.gx < map.blocks[index].right) return map.blocks[index].right;
                if (this.y + layer.bgY + layer.cellSize == map.blocks[index].bottom && C.gx > map.blocks[index].left && C.gx < map.blocks[index].right) return map.blocks[index].right;
                if (A.gx > map.blocks[index].left && A.gx < map.blocks[index].right && this.y + layer.bgY > map.blocks[index].top && this.y + layer.bgY < map.blocks[index].bottom) return map.blocks[index].right;
                if (C.gx > map.blocks[index].left && C.gx < map.blocks[index].right && this.y + layer.bgY + layer.cellSize > map.blocks[index].top && this.y + layer.bgY + layer.cellSize < map.blocks[index].bottom) return map.blocks[index].right;
            };
        };
        return undefined;
    }

    draw(layer) {
        this.drawLegs(layer);
        this.drawBody(layer);
        this.drawBelt(layer);
        this.drawEye(layer);
        this.drawKnot(layer);
        this.drawHp(layer);
    }

    drawLegs(layer) {
        layer.context.beginPath();
        layer.context.arc(this.legs.left.cx, this.legs.left.cy, this.legs.left.r, 0, 2 * Math.PI);
        layer.context.fillStyle = Palette.black;
        layer.context.fill();

        layer.context.beginPath();
        layer.context.arc(this.legs.right.cx, this.legs.right.cy, this.legs.right.r, 0, 2 * Math.PI);
        layer.context.fillStyle = Palette.black;
        layer.context.fill();
    }

    drawBody(layer) {
        layer.context.beginPath();
        layer.context.rect(this.body.x, this.body.y, this.body.w, this.body.h);
        layer.context.fillStyle = Palette.black;
        layer.context.fill();
        layer.context.strokeStyle = Palette.black;
        layer.context.lineJoin = 'round';
        layer.context.lineWidth = this.body.lineWidth;
        layer.context.stroke();
    }
    
    drawBelt(layer) {
        layer.context.beginPath();
        layer.context.rect(this.belt.x, this.belt.y, this.belt.w, this.belt.h);
        layer.context.fillStyle = this.color;
        layer.context.fill();
        layer.context.strokeStyle = this.color;
        layer.context.lineJoin = 'miter';
        layer.context.lineWidth = 0;
        layer.context.stroke();
    }

    drawEye(layer) {
        layer.context.beginPath();
        layer.context.arc(this.eye.cx, this.eye.cy, this.eye.r, 0, Math.PI);
        layer.context.fillStyle = Palette.white;
        layer.context.fill();
    }

    drawKnot(layer) {
        layer.context.beginPath();
        layer.context.moveTo(this.knot.top.x1, this.knot.top.y1);
        layer.context.lineTo(this.knot.top.x2, this.knot.top.y2);
        layer.context.lineTo(this.knot.top.x3, this.knot.top.y3);
        layer.context.fillStyle = this.color;
        layer.context.fill();

        layer.context.beginPath();
        layer.context.moveTo(this.knot.bottom.x1, this.knot.bottom.y1);
        layer.context.lineTo(this.knot.bottom.x2, this.knot.bottom.y2);
        layer.context.lineTo(this.knot.bottom.x3, this.knot.bottom.y3);
        layer.context.fillStyle = this.color;
        layer.context.fill();
    }

    drawHp(layer) {
        layer.context.font = `${this.hpFontSize}px serif`;
        layer.context.fillStyle = this.hpColor;
        layer.context.fillText(this.hp, this.hpX, this.hpY);
    }
}