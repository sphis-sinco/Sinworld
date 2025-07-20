import { renderFromSeed } from "./rendering.js";
import { seedInput } from "./seedDisplay.js";

const loadBtn = document.getElementById("loadBtn");

loadBtn.addEventListener("click", () => {
        renderFromSeed(parseInt(seedInput.value));
});