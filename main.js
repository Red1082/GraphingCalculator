import Canvas from './canvas.js';
import Graph from './graph.js';
import Vector from './libs/vector.js';

const canvas = new Canvas({
    width: innerWidth,
    height: innerHeight,
    parent: document.body,
    styling: {
        backgroundColor: '#040A18',
        strokeStyle: '#18A558'
    },
    graph: new Graph({
        min: new Vector(-10, -10),
        max: new Vector(10, 10)
    })
});

// /*
canvas.graph.appendFunc('log', Math.log2, 'green');
canvas.graph.appendFunc('n', n => n < 0 ? NaN : n, '#44f902');
canvas.graph.appendFunc('nlogn', n => n * Math.log2(n), '#ddf902');
canvas.graph.appendFunc('n^2', n => n < 0 ? NaN : n ** 2, '#fc1500');
// canvas.graph.appendFunc('sine', Math.sin, 'cyan');
// */

function draw() {
    requestAnimationFrame(draw);
    canvas.render();
}
draw();
