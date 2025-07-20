import { seedInput } from "./seedDisplay.js";

// rendering.js
export function renderFromSeed(seed) {
        const canvas = document.getElementById("viewport");
        const ctx = canvas.getContext("2d");

        const pixelScale = 1;
        canvas.width = 640 / pixelScale;
        canvas.height = 640 / pixelScale;
        const width = canvas.width;
        const height = canvas.height;

        // Define a color palette
        const colorPalette = [
                "black",
                "white",
                "#ff0040", // red
                "#00e5ff", // cyan
                "#39ff14", // green
                "#ffff00", // yellow
                "#ff00ff", // magenta
                "#ff8000", // orange
                "#8080ff", // lavender
        ];

        // Custom base weights (adjust these to your taste)
        const baseWeights = [
                1.0, // black
                1.0, // white
                0.8, // red
                0.8, // cyan
                1.2, // green
                0.5, // yellow
                0.6, // magenta
                0.9, // orange
                0.7, // lavender
        ];

        let viewportPixels = [];

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
                ctx.fillRect(x, y, pixelScale, pixelScale);
        }

        // Generate modifier factors (-0.5 to +0.5) per color based on seed
        const modifiers = baseWeights.map(() => rand() - 0.5);

        // Apply distortion to base weights
        const distortedWeights = baseWeights.map((w, i) => {
                const variation = 1 + modifiers[i]; // varies between 0.5 and 1.5
                return w * variation;
        });

        // Normalize weights to sum to 1
        const totalWeight = distortedWeights.reduce((a, b) => a + b, 0);
        const normalizedWeights = distortedWeights.map((w) => w / totalWeight);

        // Create cumulative distribution
        const cumulativeWeights = [];
        let total = 0;
        for (let i = 0; i < normalizedWeights.length; i++) {
                total += normalizedWeights[i];
                cumulativeWeights.push(total);
        }

        // Weighted color selector
        function chooseWeightedColor() {
                const r = rand();
                for (let i = 0; i < cumulativeWeights.length; i++) {
                        if (r < cumulativeWeights[i]) return colorPalette[i];
                }
                return colorPalette[colorPalette.length - 1]; // fallback
        }

        // Fill pixels
        for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                        viewportPixels.push(chooseWeightedColor());
                }
        }

        // Draw to canvas
        let i = 0;
        for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                        placePixel(x, y, viewportPixels[i++]);
                }
        }
}

// Initial render
renderFromSeed(parseInt(seedInput.value));
