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
        this.resize(params.width, params.height);
        params.parent.appendChild(this.canvas);
        this.init();
    }

    init() {
        window.addEventListener('resize', () => {
            this.resize(innerWidth, innerHeight);
        });
        document.addEventListener('mousedown', event => {
            this.mouse.isPressed = true;
            this.mouse.updatePos(event.clientX, event.clientY);
        });
        document.addEventListener('mousemove', event => {
            if (!this.mouse.isPressed) return;
            this.mouse.updatePos(event.clientX, event.clientY);
            this.update();
        });
        document.addEventListener('mouseup', () => {
            this.mouse.isPressed = false;
        });
        document.addEventListener('wheel', event => {
            const deltaZoom = Math.sign(event.deltaY) * -.1;
            this.mouse.updatePos(event.clientX, event.clientY);
            const mappedMousePos = this.canvasToGraph(this.mouse.pos);
            this.graph.min.add(Vector.sub(mappedMousePos, this.graph.min).mult(deltaZoom));
            this.graph.max.add(Vector.sub(mappedMousePos, this.graph.max).mult(deltaZoom));
        });
    }

    resize(newWidth, newHeight) {
        this.canvas.width = this.width = newWidth;
        this.canvas.height = this.height = newHeight;
    }

    render() {
        this.clear();
        this.drawBackground();
        this.drawAxis(this.graph);
        for (let id in this.graph.funcs) {
            const funcObj = this.graph.funcs[id];
            this.plotFunc(funcObj.func, funcObj.strokeStyle);
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

    drawAxis() {
        this.line(
            this.graphToCanvas(new Vector(this.graph.min.x, 0)),
            this.graphToCanvas(new Vector(this.graph.max.x, 0)),
            '#D9E4E8'
        );
        this.line(
            this.graphToCanvas(new Vector(0, this.graph.min.y)),
            this.graphToCanvas(new Vector(0, this.graph.max.y)),
            '#D9E4E8'
        );
    }

    plotFunc(func, strokeStyle) {
        const dx = (this.graph.max.x - this.graph.min.x) * 1e-3;
        let firstVertex;
        this.ctx.beginPath();
        for (let graphX = this.graph.min.x; graphX <= this.graph.max.x; graphX += dx) {
            const graphY = func(graphX);
            if (isNaN(graphY)) continue;
            const graphVertex = new Vector(graphX, graphY);
            if (this.graphVertexOutOfRange(graphVertex)) continue;
            const canvasVertex = this.graphToCanvas(graphVertex);
            if (!firstVertex) firstVertex = canvasVertex;
            this.ctx.lineTo(canvasVertex.x, canvasVertex.y);
        }
        if (!firstVertex) firstVertex = new Vector();
        this.ctx.moveTo(firstVertex.x, firstVertex.y);
        this.ctx.closePath();
        this.ctx.strokeStyle = strokeStyle ?? this.styling.strokeStyle;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    graphVertexOutOfRange(vec) {
        return vec.x < this.graph.min.x ||
            vec.x > this.graph.max.x ||
            vec.y < this.graph.min.y ||
            vec.y > this.graph.max.y;
    }

    getMinVertex(func) {
        return this.graphToCanvas(new Vector(this.graph.min.x, func(this.graph.min.x)));
    }

    line(vecA, vecB, strokeStyle) {
        this.ctx.beginPath();
        this.ctx.moveTo(vecA.x, vecA.y);
        this.ctx.lineTo(vecB.x, vecB.y);
        this.ctx.closePath();
        this.ctx.strokeStyle = strokeStyle ?? this.styling.strokeStyle;
        this.ctx.lineWidth = 1;
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