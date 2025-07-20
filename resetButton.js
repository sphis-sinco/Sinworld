import { renderFromSeed } from "./rendering.js";
import { seedInput, updateSeedValueDisplay } from "./seedDisplay.js";

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", () => {
        seedInput.value = 50;
        updateSeedValueDisplay();
        renderFromSeed(parseInt(seedInput.value));
});