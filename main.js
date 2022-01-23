import Canvas from './canvas.js';
import Graph from './graph.js';
import Vector from './libs/vector.js';

const graph = new Graph({
    min: new Vector(-10, -10),
    max: new Vector(10, 10)
});

const canvas = new Canvas({
    width: innerWidth,
    height: innerHeight,
    parent: document.body,
    styling: {
        backgroundColor: '#040A18',
        strokeStyle: '#18A558'
    },
    graph: graph
});

/*
graph.appendFunc('log', Math.log2, 'green');
graph.appendFunc('n', n => n < 0 ? NaN : n, '#44f902');
graph.appendFunc('nlogn', n => n * Math.log2(n), '#ddf902');
graph.appendFunc('n^2', n => n < 0 ? NaN : n ** 2, '#fc1500');
graph.appendFunc('sine', Math.sin, 'cyan');
*/

graph.appendFunc('sine', Math.sin, '#18A558');

function draw() {
    requestAnimationFrame(draw);
    canvas.render();
}
draw();