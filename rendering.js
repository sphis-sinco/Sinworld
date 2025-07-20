import { seedInput } from "./seedDisplay.js";

let animationFrameId = null; // store current animation frame id
let viewportPixels = null;   // store current grid state

export function renderFromSeed(seed) {
    // Cancel any ongoing animation
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    const canvas = document.getElementById("viewport");
    const ctx = canvas.getContext("2d");

    const pixelScale = 4;

    // Set canvas size ONCE here (optional: move outside for performance)
    canvas.width = 640 / pixelScale;
    canvas.height = 640 / pixelScale;

    const width = canvas.width;
    const height = canvas.height;

    const colorPalette = ["black", "white"];
    const baseWeights = [1.0, 1.0]; // black = dead, white = alive

    const rules = {
        survive: [2, 3],
        birth: [3]
    };

    // Seeded RNG generator
    function createSeededRandom(seed) {
        let m = 0x80000000;
        let a = 1664525;
        let c = 1013904223;
        let state = seed;

        return function () {
            state = (a * state + c) % m;
            return state / m;
        };
    }

    const rand = createSeededRandom(seed);

    function placePixel(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * pixelScale, y * pixelScale, pixelScale, pixelScale);
    }

    // Weighted color setup
    const modifiers = baseWeights.map(() => rand() - 0.5);
    const distortedWeights = baseWeights.map((w, i) => w * (1 + modifiers[i]));
    const totalWeight = distortedWeights.reduce((a, b) => a + b, 0);
    const normalizedWeights = distortedWeights.map(w => w / totalWeight);

    const cumulativeWeights = [];
    let total = 0;
    for (let i = 0; i < normalizedWeights.length; i++) {
        total += normalizedWeights[i];
        cumulativeWeights.push(total);
    }

    function chooseWeightedColor() {
        const r = rand();
        for (let i = 0; i < cumulativeWeights.length; i++) {
            if (r < cumulativeWeights[i]) return colorPalette[i];
        }
        return colorPalette[colorPalette.length - 1];
    }

    // Initialize grid using seed
    viewportPixels = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => chooseWeightedColor())
    );

    function countAliveNeighbors(grid, x, y) {
        const dirs = [-1, 0, 1];
        let count = 0;

        for (let dy of dirs) {
            for (let dx of dirs) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (
                    nx >= 0 && nx < width &&
                    ny >= 0 && ny < height &&
                    grid[ny][nx] === "white"
                ) {
                    count++;
                }
            }
        }

        return count;
    }

    function evolveGrid(grid) {
        const newGrid = [];

        for (let y = 0; y < height; y++) {
            newGrid[y] = [];
            for (let x = 0; x < width; x++) {
                const alive = grid[y][x] === "white";
                const neighbors = countAliveNeighbors(grid, x, y);

                if (alive) {
                    newGrid[y][x] = rules.survive.includes(neighbors) ? "white" : "black";
                } else {
                    newGrid[y][x] = rules.birth.includes(neighbors) ? "white" : "black";
                }
            }
        }

        return newGrid;
    }

    function drawGrid(grid) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                placePixel(x, y, grid[y][x]);
            }
        }
    }

    function animate() {
        viewportPixels = evolveGrid(viewportPixels);
        drawGrid(viewportPixels);
        animationFrameId = requestAnimationFrame(animate);
    }

    drawGrid(viewportPixels);
    animationFrameId = requestAnimationFrame(animate);

    console.log({
        pixels: width * height,
        rules,
        colors: colorPalette,
        colorWeights: baseWeights,
        colorWeightsDistorted: distortedWeights,
        colorWeightsTotal: totalWeight,
    });
}
