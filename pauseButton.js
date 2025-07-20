import { renderFromSeed } from "./rendering.js";

const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.addEventListener("click", () => {
    renderFromSeed.togglePause();
    pauseBtn.textContent = renderFromSeed.isPaused() ? "Resume" : "Pause";
});