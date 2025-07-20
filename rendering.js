import { seedInput } from "./seedDisplay.js";
import GIF from "https://cdn.jsdelivr.net/npm/gif.js.optimized/dist/gif.js";

// === CONSTANTS (Global) ===
const pixelScale = 2;
const baseCanvasWidth = 640;
const baseCanvasHeight = 640;
const canvasWidth = baseCanvasWidth / pixelScale;
const canvasHeight = baseCanvasHeight / pixelScale;
const colorPalette = ["black", "white"];
const DEAD = colorPalette[0];
const ALIVE = colorPalette[1];
const baseWeights = [1.0, 1.0];
const rules = {
    survive: [2, 3],
    birth: [3],
};
const baseFPS = 10;
const fps = baseFPS * (pixelScale / 4);
const frameInterval = 1000 / fps;
const directions = [-1, 0, 1];

// === STATE ===
let animationFrameId = null;
let viewportPixels = null;
let lastFrameTime = 0;
let isPaused = false;
let gif = null;
let captureFrames = false;
let canvasRef = null;

// === SEED RANDOM ===
function createSeededRandom(seed) {
    let m = 0x80000000, a = 1664525, c = 1013904223, state = seed;
    return function () {
        state = (a * state + c) % m;
        return state / m;
    };
}

// === PIXEL + DRAW ===
function placePixel(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * pixelScale, y * pixelScale, pixelScale, pixelScale);
}

function drawGrid(ctx, grid, width, height) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            placePixel(ctx, x, y, grid[y][x]);
        }
    }
}

// === GAME OF LIFE LOGIC ===
function countAliveNeighbors(grid, x, y, width, height) {
    let count = 0;
    for (let dy of directions) {
        for (let dx of directions) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            const inBounds = nx >= 0 && nx < width && ny >= 0 && ny < height;
            if (inBounds && grid[ny][nx] === ALIVE) count++;
        }
    }
    return count;
}

function evolveGrid(grid, width, height) {
    const newGrid = [];
    for (let y = 0; y < height; y++) {
        newGrid[y] = [];
        for (let x = 0; x < width; x++) {
            const alive = grid[y][x] === ALIVE;
            const neighbors = countAliveNeighbors(grid, x, y, width, height);
            newGrid[y][x] = alive
                ? rules.survive.includes(neighbors) ? ALIVE : DEAD
                : rules.birth.includes(neighbors) ? ALIVE : DEAD;
        }
    }
    return newGrid;
}

// === MAIN ENTRY ===
export function renderFromSeed(seed) {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    lastFrameTime = 0;
    isPaused = false;

    const canvas = document.getElementById("viewport");
    const ctx = canvas.getContext("2d");
    canvasRef = canvas;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const width = canvas.width;
    const height = canvas.height;

    const rand = createSeededRandom(seed);

    const modifiers = baseWeights.map(() => rand() - 0.5);
    const distortedWeights = baseWeights.map((w, i) => w * (1 + modifiers[i]));
    const totalWeight = distortedWeights.reduce((a, b) => a + b, 0);
    const normalizedWeights = distortedWeights.map(w => w / totalWeight);

    const cumulativeWeights = [];
    let cumulativeTotal = 0;
    for (let weight of normalizedWeights) {
        cumulativeTotal += weight;
        cumulativeWeights.push(cumulativeTotal);
    }

    function chooseWeightedColor() {
        const r = rand();
        for (let i = 0; i < cumulativeWeights.length; i++) {
            if (r < cumulativeWeights[i]) return colorPalette[i];
        }
        return colorPalette[colorPalette.length - 1];
    }

    viewportPixels = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => chooseWeightedColor())
    );

    function animate(timestamp) {
        if (!lastFrameTime) lastFrameTime = timestamp;
        const elapsed = timestamp - lastFrameTime;

        if (!isPaused && elapsed > frameInterval) {
            viewportPixels = evolveGrid(viewportPixels, width, height);
            drawGrid(ctx, viewportPixels, width, height);

            if (captureFrames && gif) {
                gif.addFrame(canvas, { copy: true, delay: frameInterval });
            }

            lastFrameTime = timestamp - (elapsed % frameInterval);
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    drawGrid(ctx, viewportPixels, width, height);
    animationFrameId = requestAnimationFrame(animate);

    renderFromSeed.isPaused = () => isPaused;
    renderFromSeed.togglePause = () => { isPaused = !isPaused; };
    renderFromSeed.setPause = (val) => { isPaused = !!val; };
    renderFromSeed.startRecording = () => {
        gif = new GIF({ workers: 2, quality: 10, workerScript: 'https://cdn.jsdelivr.net/npm/gif.js.optimized/dist/gif.worker.js' });
        captureFrames = true;
    };
    renderFromSeed.stopRecording = () => {
        captureFrames = false;
        gif.on('finished', function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `grid-${Date.now()}.gif`;
            a.click();
        });
        gif.render();
    };
}
