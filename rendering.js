const canvas = document.getElementById("viewport");
const ctx = canvas.getContext("2d");

const pixelScale = 1;
const width = canvas.width / pixelScale;
const height = canvas.height / pixelScale;

const color_black = "black";
const color_white = "white";

let viewportPixels = [];

// --- Seeded RNG (simple LCG) ---
function createSeededRandom(seed) {
    let m = 0x80000000; // 2^31
    let a = 1664525;
    let c = 1013904223;
    let state = seed;

    return function() {
        state = (a * state + c) % m;
        return state / m;
    };
}

// Example: set a fixed seed (can be any number)
let seed = Math.random() * 12345;
let rand = createSeededRandom(seed);

function placePixel(x = 0, y = 0, color = "black") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, pixelScale, pixelScale);
}

function initializeViewportPixels() {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (rand() >= 0.5)
                viewportPixels.push(color_white);
            else
                viewportPixels.push(color_black);
        }
    }
}

function update() {
    let i = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const color = viewportPixels[i++];
            placePixel(x, y, color);
        }
    }
}

initializeViewportPixels();
console.log(seed);
requestAnimationFrame(update); // Call update once after pixels are initialized