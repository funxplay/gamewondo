export default class Input{
    constructor(container) {
        this.container = container;
        this.keys = [];
        this.mouse = {
            x: 0,
            y: 0,
            isDown: false,
            isUp: false
        };
        this.container.addEventListener('mousemove', event => this.changeState(event));
        this.container.addEventListener('mouseup', event => this.changeState(event));
        this.container.addEventListener('mousedown', event => this.changeState(event));
        this.container.addEventListener('contextmenu', event => this.changeState(event));

        window.addEventListener('keydown', event => {
            if ((
                event.keyCode === 87 || //w
                event.keyCode === 65 || //a
                event.keyCode === 83 || //s
                event.keyCode === 68 || //d
                event.keyCode === 38 || //ArrowUp
                event.keyCode === 37 || //ArrowLeft
                event.keyCode === 39 || //ArrowRight
                event.keyCode === 40 //ArrowUDown
            ) && this.keys.indexOf(event.keyCode) === -1) {
                this.keys.push(event.keyCode);
            };
        });
          
        window.addEventListener('keyup', event => {
            if (
                event.keyCode === 87 || //w
                event.keyCode === 65 || //a
                event.keyCode === 83 || //s
                event.keyCode === 68 || //d
                event.keyCode === 38 || //ArrowUp
                event.keyCode === 37 || //ArrowLeft
                event.keyCode === 39 || //ArrowRight
                event.keyCode === 40 //ArrowUDown
            ) {
                this.keys.splice(this.keys.indexOf(event.keyCode), 1);
            };
        });
    }

    changeState(event) {
        const canvasRect = this.container.getBoundingClientRect();
        this.mouse.x = event.clientX - canvasRect.left;
        this.mouse.y = event.clientY - canvasRect.top;
        if (event.type === 'mousedown') {
            this.mouse.isDown = true;
            this.mouse.isUp = false;
        } else if (event.type === 'mouseup') {
            this.mouse.isDown = false;
            this.mouse.isUp = true;
        } else if (event.type === 'contextmenu') {
            event.preventDefault();
        };
    }

    update() {
        this.mouse.isDown = false;
        this.mouse.isUp = false;
    }
}