export default class Layer {
  constructor(container) {
  	this.canvas = document.createElement('canvas');
  	this.context = this.canvas.getContext('2d');
  	container.appendChild(this.canvas);

    this.fitToContainer = this.fitToContainer.bind(this);
    addEventListener(`resize`, this.fitToContainer);
    this.fitToContainer();
  }

  fitToContainer() {
  	this.w = this.canvas.width = this.canvas.clientWidth;
  	this.h = this.canvas.height = this.canvas.clientHeight;

    if (this.w / this.h > 20 / 14){
      this.cellSize = this.h / 14;
      this.bgW = 20 * this.cellSize;
      this.bgH = this.h;
      this.bgX = (this.w - this.bgW) / 2;
      this.bgY = 0;
    } else {
      this.cellSize = this.w / 20;
      this.bgW = this.w;
      this.bgH = 14 * this.cellSize;
      this.bgX = 0;
      this.bgY = (this.h - this.bgH) / 2;
    };
  }
}