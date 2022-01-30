import Vector from './libs/vector.js';
import { map } from './moreMath.js';

export default class Canvas {
    constructor(params) {
        this.canvas = document.createElement('canvas');
        this.graph = params.graph;
        this.styling = params.styling;
        this.ctx = this.canvas.getContext('2d');
        this.mouse = {
            pos: new Vector(),
            prevPos: new Vector(),
            isPressed: false,
            updatePos: function (x, y) {
                this.prevPos.set(this.pos);
                this.pos.set(x, y);
            }
        };
        this.resize(params.width, params.height, false);
        params.parent.appendChild(this.canvas);
        this.init();
    }

    init() {
        window.addEventListener('resize', () => {
            this.resize(innerWidth, innerHeight, true);
        });
        document.addEventListener('mousedown', event => {
            this.mouse.isPressed = true;
            this.mouse.updatePos(event.clientX, event.clientY);
            document.body.style.cursor = 'grabbing';
        });
        document.addEventListener('mousemove', event => {
            if (!this.mouse.isPressed) return;
            this.mouse.isPressed = true;
            this.mouse.updatePos(event.clientX, event.clientY);
            this.update();
        });
        document.addEventListener('mouseup', () => {
            this.mouse.isPressed = false;
            document.body.style.cursor = 'default';
        });
        document.addEventListener('wheel', event => {
            this.mouse.updatePos(event.clientX, event.clientY);
            this.graph.zoom(this.canvasToGraph(this.mouse.pos), Math.sign(event.deltaY) * -.1);
        });
        document.addEventListener('keydown', event => {
            //If the home key is pressed, reset the graph to its original scaling.
            if (event.key.toLowerCase() === 'h') {
                this.graph.min = new Vector(-10, -10);
                this.graph.max = new Vector(10, 10);
                return;
            }
            const vec = {
                'ArrowLeft': { x: .99, y: 1 },
                'ArrowRight': { x: 1.01, y: 1 },
                'ArrowDown': { x: 1, y: .99 },
                'ArrowUp': { x: 1, y: 1.01 }
            }[event.key];
            if (!vec) return;
            this.graph.scale(
                new Vector(vec.x, vec.y)
            );
        });
    }

    resize(newWidth, newHeight, remapGraph) {
        if (remapGraph) {
            const ratio = (newWidth * this.height) / (this.width * newHeight);
            this.graph.min.x *= ratio;
            this.graph.max.x *= ratio;
        }
        this.canvas.width = this.width = newWidth;
        this.canvas.height = this.height = newHeight;
    }

    render() {
        this.clear();
        this.drawBackground();
        this.drawGrid();
        this.drawAxis(this.graph);
        for (let id in this.graph.funcs) {
            const funcObj = this.graph.funcs[id];
            this.plotFunc(funcObj.func, funcObj.strokeStyle, funcObj.customIncConst ?? 1e-2);
        }
    }

    update() {
        if (this.mouse.isPressed) {
            this.graph.pan(Vector.sub(
                this.canvasToGraph(this.mouse.prevPos),
                this.canvasToGraph(this.mouse.pos)
            ));
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawBackground() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.styling.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.closePath();
    }

    drawGrid() {
        const mid = Vector.add(this.graph.min, this.graph.max);
        for (let x = 0; x > this.graph.min.x; x--)
            this.drawVerticalLine(x);
        for (let x = 0; x < this.graph.max.x; x++)
            this.drawVerticalLine(x);
        for (let y = 0; y > this.graph.min.y; y--)
            this.drawHorizontalLine(y);
        for (let y = 0; y < this.graph.max.y; y++)
            this.drawHorizontalLine(y);
    }

    drawVerticalLine(xValue) {
        this.line(
            this.graphToCanvas(new Vector(xValue, this.graph.min.y)),
            this.graphToCanvas(new Vector(xValue, this.graph.max.y)),
            xValue % 5 == 0 ? '#888' : '#333', 1.5
        );
    }

    drawHorizontalLine(yValue) {
        this.line(
            this.graphToCanvas(new Vector(this.graph.min.x, yValue)),
            this.graphToCanvas(new Vector(this.graph.max.x, yValue)),
            yValue % 5 == 0 ? '#888' : '#333', 1.5
        );
    }

    drawAxis() {
        this.line(
            this.graphToCanvas(new Vector(this.graph.min.x, 0)),
            this.graphToCanvas(new Vector(this.graph.max.x, 0)),
            '#D9E4E8', 2
        );
        this.line(
            this.graphToCanvas(new Vector(0, this.graph.min.y)),
            this.graphToCanvas(new Vector(0, this.graph.max.y)),
            '#D9E4E8', 2
        );
    }

    plotFunc(func, strokeStyle, inc) {
        //This needs A LOT of improvement :/
        const dx = (this.graph.max.x - this.graph.min.x) * inc ?? 1e-2;
        this.ctx.beginPath();
        for (let x = this.graph.min.x; x < this.graph.max.x; x += dx) {
            const y = func(x);
            const vertex = this.graphToCanvas(new Vector(x, y));
            this.ctx.lineTo(vertex.x, vertex.y);
        }
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.stroke();
    }

    graphVertexOutOfRange(x, y) {
        return x < this.graph.min.x
            || x > this.graph.max.x
            || y < this.graph.min.y
            || y > this.graph.max.y;
    }

    getMinVertex(func) {
        return this.graphToCanvas(new Vector(this.graph.min.x, func(this.graph.min.x)));
    }

    line(vecA, vecB, strokeStyle, lineWidth) {
        this.ctx.beginPath();
        this.ctx.moveTo(vecA.x, vecA.y);
        this.ctx.lineTo(vecB.x, vecB.y);
        this.ctx.closePath();
        this.ctx.strokeStyle = strokeStyle ?? this.styling.strokeStyle;
        this.ctx.lineWidth = lineWidth ?? 1;
        this.ctx.stroke();
    }

    graphToCanvas(vec) {
        return new Vector(
            map(vec.x, this.graph.min.x, this.graph.max.x, 0, this.width),
            map(vec.y, this.graph.max.y, this.graph.min.y, 0, this.height)
        );
    }

    canvasToGraph(vec) {
        return new Vector(
            map(vec.x, 0, this.width, this.graph.min.x, this.graph.max.x),
            map(vec.y, 0, this.height, this.graph.max.y, this.graph.min.y)
        );
    }
}