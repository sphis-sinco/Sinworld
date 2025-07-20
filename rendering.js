import { seedInput } from "./seedDisplay.js";

let animationFrameId = null;
let viewportPixels = null;
let lastFrameTime = 0;
let isPaused = false;

let gif = null;
let recording = false;

export function renderFromSeed(seed) {
        if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
        }
        lastFrameTime = 0;
        isPaused = false;
        recording = false;
        gif = null;

        const canvas = document.getElementById("viewport");
        const ctx = canvas.getContext("2d");

        const pixelScale = 2;
        canvas.width = 640 / pixelScale;
        canvas.height = 640 / pixelScale;

        const width = canvas.width;
        const height = canvas.height;

        const colorPalette = ["black", "white"];
        const DEAD = colorPalette[0];
        const ALIVE = colorPalette[1];
        const baseWeights = [1.0, 1.0];

        const rules = {
                survive: [2, 3],
                birth: [3],
        };

        function createSeededRandom(seed) {
                let m = 0x80000000,
                        a = 1664525,
                        c = 1013904223,
                        state = seed;
                return function () {
                        state = (a * state + c) % m;
                        return state / m;
                };
        }

        const rand = createSeededRandom(seed);

        function placePixel(x, y, color) {
                ctx.fillStyle = color;
                ctx.fillRect(
                        x * pixelScale,
                        y * pixelScale,
                        pixelScale,
                        pixelScale
                );
        }

        const modifiers = baseWeights.map(() => rand() - 0.5);
        const distortedWeights = baseWeights.map(
                (w, i) => w * (1 + modifiers[i])
        );
        const totalWeight = distortedWeights.reduce((a, b) => a + b, 0);
        const normalizedWeights = distortedWeights.map((w) => w / totalWeight);

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
                                        nx >= 0 &&
                                        nx < width &&
                                        ny >= 0 &&
                                        ny < height &&
                                        grid[ny][nx] === ALIVE
                                )
                                        count++;
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
                                const neighbors = countAliveNeighbors(
                                        grid,
                                        x,
                                        y
                                );
                                if (alive) {
                                        newGrid[y][x] = rules.survive.includes(
                                                neighbors
                                        )
                                                ? ALIVE
                                                : DEAD;
                                } else {
                                        newGrid[y][x] = rules.birth.includes(
                                                neighbors
                                        )
                                                ? ALIVE
                                                : DEAD;
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

        const baseFPS = 10;
        const fps = baseFPS * (pixelScale / 4);
        const frameInterval = 1000 / fps;

        // GIF buttons
        const startBtn = document.getElementById("startGifBtn");
        const stopBtn = document.getElementById("stopGifBtn");

        function initGif() {
                if (!window.GIF) {
                        alert(
                                "GIF.js library not loaded. Please add the script."
                        );
                        return;
                }

                gif = new GIF({
                        workers: 2,
                        quality: 10,
                        workerScript: "plugins/gifWorker.js", // path relative to your index.html
                        width: canvas.width,
                        height: canvas.height,
                        transparent: "rgba(0,0,0,0)",
                });

                gif.on("finished", function (blob) {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "sinworld.gif";
                        a.click();
                        URL.revokeObjectURL(url);
                        startBtn.disabled = false;
                        stopBtn.disabled = true;
                        recording = false;
                });
        }

        if (startBtn && stopBtn) {
                startBtn.disabled = false;
                stopBtn.disabled = true;

                startBtn.onclick = () => {
                        initGif();
                        if (!gif) return;

                        recording = true;
                        startBtn.disabled = true;
                        stopBtn.disabled = false;
                        console.log("GIF recording started");
                };

                stopBtn.onclick = () => {
                        if (!gif) return;

                        recording = false;
                        stopBtn.disabled = true;
                        startBtn.disabled = false;
                        console.log("Rendering GIF...");
                        gif.render();
                };
        }

        function animate(timestamp) {
                if (!lastFrameTime) lastFrameTime = timestamp;
                const elapsed = timestamp - lastFrameTime;

                if (!isPaused && elapsed > frameInterval) {
                        viewportPixels = evolveGrid(viewportPixels);
                        drawGrid(viewportPixels);
                        lastFrameTime = timestamp - (elapsed % frameInterval);

                        if (recording && gif) {
                                gif.addFrame(canvas, {
                                        copy: true,
                                        delay: frameInterval,
                                });
                        }
                }

                animationFrameId = requestAnimationFrame(animate);
        }

        drawGrid(viewportPixels);
        animationFrameId = requestAnimationFrame(animate);

        // Pause controls exposed
        renderFromSeed.isPaused = () => isPaused;
        renderFromSeed.togglePause = () => {
                isPaused = !isPaused;
                console.log("Paused:", isPaused);
        };
        renderFromSeed.setPause = (val) => {
                isPaused = !!val;
                console.log("Paused:", isPaused);
        };
}
