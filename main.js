'use strict';

import Canvas from './canvas.js';
import Graph from './graph.js';
import Vector from './libs/vector.js';

const graph = new Graph({
    min: new Vector(-8, -8),
    max: new Vector(8, 8)
});

const canvas = new Canvas({
    width: innerWidth,
    height: innerHeight,
    parent: document.body,
    styling: {
        backgroundColor: '#040A18',
        strokeStyle: '#333'
    },
    graph: graph
});

graph.appendFunc('semicircle', x => (1 - x ** 2) ** .5, 'royalBlue', 1e-4);
graph.appendFunc('cosine', Math.cos, 'crimson');
graph.appendFunc('ascending sine', x => x + Math.sin(x), 'teal');
graph.appendFunc('fourier square wave', x => {
    let sum = 0;
    for (let n = 0; n < 8; n++)
        sum += Math.sin(x * (2 * n + 1)) / (2 * n + 1);
    return sum;
}, '#18A558', 1e-3);

function draw() {
    requestAnimationFrame(draw);
    canvas.render();
}
draw();