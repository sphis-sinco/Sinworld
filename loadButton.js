import { renderFromSeed } from "./rendering.js";
import { seedInput } from "./seedDisplay.js";

const loadBtn = document.getElementById("loadBtn");

loadBtn.addEventListener("click", () => {
    const seed = parseInt(seedInput.value);
    if (isNaN(seed)) {
        console.warn("Invalid seed, defaulting to 50");
        renderFromSeed(50);
    } else {
        renderFromSeed(seed);
    }
});
