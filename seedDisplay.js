export var seedInput = document.getElementById("seedRange");
export var seedDisplay = document.getElementById("seedValue");

export function updateSeedValueDisplay() {
        seedDisplay.textContent = seedInput.value;
}

updateSeedValueDisplay();

seedInput.addEventListener("input", () => {
        updateSeedValueDisplay();
});

const addition = 1;

const minusButton = document.getElementById("minusButton");
const plusButton = document.getElementById("plusButton");
minusButton.addEventListener("click", () => {
        seedInput.value -= addition;
        updateSeedValueDisplay();
});
plusButton.addEventListener("click", () => {
        const nsiv = parseInt(seedInput.value) + addition;
        seedInput.value = nsiv;
        updateSeedValueDisplay();
});
