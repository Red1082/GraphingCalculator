import Vector from './libs/vector.js';

export default class Graph {
    constructor(params) {
        this.min = params.min;
        this.max = params.max;
        this.funcs = {};
        this.graphStyles = [
            '#18A558',
            '#DF362D',
            '#01949A',
            '#FEDE00',
            '#FDB750'
        ];
    }

    pan(vec) {
        this.min.add(vec);
        this.max.add(vec);
    }

    zoom(pos, deltaZoom) {
        this.min.add(Vector.sub(pos, this.min).mult(deltaZoom));
        this.max.add(Vector.sub(pos, this.max).mult(deltaZoom));
    }

    appendFunc(id, func, color) {
        this.funcs[id] = {
            func,
            strokeStyle: color ?? this.graphStyles[
                Math.floor(Math.random() * this.graphStyles.length)
            ]
        };
    }
}