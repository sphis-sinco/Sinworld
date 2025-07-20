export var seedInput = document.getElementById("seedRange");
export var seedDisplay = document.getElementById("seedValue");

export function updateSeedValueDisplay() {
        seedDisplay.textContent = seedInput.value;
}

updateSeedValueDisplay();

seedInput.addEventListener("input", () => {
        updateSeedValueDisplay();
});