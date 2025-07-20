import { seedInput } from "./seedDisplay.js";

// rendering.js
export function renderFromSeed(seed) {
    const canvas = document.getElementById("viewport");
    const ctx = canvas.getContext("2d");

    const pixelScale = 4;
    canvas.width = 640 / pixelScale;
    canvas.height = 640 / pixelScale;
    const width = canvas.width;
    const height = canvas.height;

    // Define a color palette
    const colorPalette = ["black", "white"];

    // Custom base weights
    const baseWeights = [
        1.0,   // black (dead)
        1.0    // white (alive)
    ];

    // Seeded RNG
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

    // Generate weight modifiers based on seed
    const modifiers = baseWeights.map(() => rand() - 0.5);
    const distortedWeights = baseWeights.map((w, i) => w * (1 + modifiers[i]));
    const totalWeight = distortedWeights.reduce((a, b) => a + b, 0);
    const normalizedWeights = distortedWeights.map(w => w / totalWeight);

    // Cumulative weights
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
        return colorPalette[colorPalette.length - 1]; // fallback
    }

    // === Game of Life ===

    // Step 1: Seeded pixel grid (2D)
    let viewportPixels = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => chooseWeightedColor())
    );

    // Step 2: Count alive neighbors
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

    // Step 3: Apply Conway's rules
    function evolveGrid(grid) {
        const newGrid = [];

        for (let y = 0; y < height; y++) {
            newGrid[y] = [];
            for (let x = 0; x < width; x++) {
                const alive = grid[y][x] === "white";
                const neighbors = countAliveNeighbors(grid, x, y);

                if (alive) {
                    newGrid[y][x] = (neighbors === 2 || neighbors === 3) ? "white" : "black";
                } else {
                    newGrid[y][x] = (neighbors === 3) ? "white" : "black";
                }
            }
        }

        return newGrid;
    }

    // Step 4: Draw
    function drawGrid(grid) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                placePixel(x, y, grid[y][x]);
            }
        }
    }

    // Step 5: Animate (10 FPS)
    function animate() {
        viewportPixels = evolveGrid(viewportPixels);
        drawGrid(viewportPixels);
        setTimeout(() => requestAnimationFrame(animate), 100); // ~10 FPS
    }

    // Initial draw and start animation
    drawGrid(viewportPixels);
    requestAnimationFrame(animate);

    console.log({
        pixels: width * height,
        colors: colorPalette,
        colorWeights: baseWeights,
        colorWeightsDistorted: distortedWeights,
        colorWeightsTotal: totalWeight,
    });
}

// Initial render
renderFromSeed(parseInt(seedInput.value));
