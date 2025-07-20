const canvas = document.getElementById("viewport");
const ctx = canvas.getContext("2d");

var pixelScale = 1;

var width = 640 / pixelScale;
var height = 480 / pixelScale;

var viewportPixels = [];

const color_black = "black";

function placePixel(x = 0, y = 0, color = "black") {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, pixelScale, pixelScale);
}

function initalizeViewportPixels() {
        let y = 0;
        while (y < height+1) {
                let x = 0;
                while (x < width+1) {
                        viewportPixels.push(color_black);

                        x++;
                }

                y++;
        }
}

console.log(viewportPixels);
initalizeViewportPixels();

function update() {
        let x = 0;
        let y = 0;
        for (const pixel in viewportPixels) {
                const color = viewportPixels[pixel];

                placePixel(x, y, color);

                x++;
                if (x > width)
                {
                        x = 0;
                        y++;
                }
        }
}

setTimeout(update(), 1 / 24);
