import { seedInput } from "./seedDisplay.js";

let animationFrameId = null; // store current animation frame id
let viewportPixels = null;   // store current grid state
let lastFrameTime = 0;       // for frame timing control

export function renderFromSeed(seed) {
    // Cancel any ongoing animation
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    const canvas = document.getElementById("viewport");
    const ctx = canvas.getContext("2d");

    const pixelScale = 2;

    // Set canvas size ONCE here (optional: move outside for performance)
    canvas.width = 640 / pixelScale;
    canvas.height = 640 / pixelScale;

    const width = canvas.width;
    const height = canvas.height;

    const colorPalette = ["black", "white"];
    const DEAD = colorPalette[0];
    const ALIVE = colorPalette[1];
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
                    grid[ny][nx] === ALIVE
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
                const alive = grid[y][x] === ALIVE;
                const neighbors = countAliveNeighbors(grid, x, y);

                if (alive) {
                    newGrid[y][x] = rules.survive.includes(neighbors) ? ALIVE : DEAD;
                } else {
                    newGrid[y][x] = rules.birth.includes(neighbors) ? ALIVE : DEAD;
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

    // Toggle cell state helper function
    // Flips the cell between DEAD and ALIVE using colorPalette values
    function toggleCell(grid, x, y) {
        if (x < 0 || x >= width || y < 0 || y >= height) return; // boundary check
        grid[y][x] = (grid[y][x] === ALIVE) ? DEAD : ALIVE;
    }

    // Calculate FPS and frame interval based on pixelScale
    // Base FPS is 10 at pixelScale=4, scale linearly:
    const baseFPS = 30;
    const fps = baseFPS * (pixelScale / 4);
    const frameInterval = 1000 / fps;

    function animate(timestamp) {
        if (!lastFrameTime) lastFrameTime = timestamp;
        const elapsed = timestamp - lastFrameTime;

        if (elapsed > frameInterval) {
            viewportPixels = evolveGrid(viewportPixels);
            drawGrid(viewportPixels);
            lastFrameTime = timestamp - (elapsed % frameInterval);
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    drawGrid(viewportPixels);
    animationFrameId = requestAnimationFrame(animate);

    // Expose toggleCell globally for external use (optional)
    renderFromSeed.toggleCell = toggleCell;

    console.log({
        pixels: width * height,
        rules,
        colors: colorPalette,
        colorWeights: baseWeights,
        colorWeightsDistorted: distortedWeights,
        colorWeightsTotal: totalWeight,
        pixelScale,
        fps,
    });
}
