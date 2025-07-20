// rendering.js
export function renderFromSeed(seed) {
        const canvas = document.getElementById("viewport");
        const ctx = canvas.getContext("2d");

        const pixelScale = 1;
        canvas.width = 640 / pixelScale;
        canvas.height = 640 / pixelScale;
        const width = canvas.width;
        const height = canvas.height;

        const color_black = "black";
        const color_white = "white";

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

        // Fill pixels based on RNG
        for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                        viewportPixels.push(
                                rand() >= 0.5 ? color_white : color_black
                        );
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
