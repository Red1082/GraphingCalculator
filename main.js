'use strict';

import Canvas from './canvas.js';
import Graph from './graph.js';
import Vector from './libs/vector.js';

const graph = new Graph({
    min: new Vector(-20, -10),
    max: new Vector(20, 10)
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
*/

let k = 8;

document.addEventListener('keydown', event => {
    k += { '+': 1, '-': -1 }[event.key] ?? 0;
});

graph.appendFunc('fourierSquareWave', x => {
    let sum = 0;
    for (let n = 0; n < Math.abs(k); n++)
        sum += Math.sin((2 * n + 1) * x) / (2 * n + 1);
    return sum * 1.2732395447351628;
}, '#145DA0');

graph.appendFunc('sign', x => Math.sign(Math.sin(x)), 'rgba(0,255,0,.5)');

let prevTime = 0, fps = 0, frameCount = 0;

function draw() {
    requestAnimationFrame(draw);
    canvas.render();
    canvas.ctx.beginPath();
    canvas.ctx.fillStyle = '#fff';
    canvas.ctx.fillText(`${fps} fps`, 10, 10);
    canvas.ctx.closePath();
    frameCount++;
    let time = performance.now();
    if (frameCount % 9 == 0) {
        fps = Math.floor(1e3 / (time - prevTime));
    }
    prevTime = time;
}
draw();
