function applyDarkMode() {
    document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
}

function removeDarkMode() {
    document.documentElement.style.filter = "";
}

chrome.storage.local.get(["enabled"], ({ enabled }) => {
    if (enabled) applyDarkMode();
});

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "toggle") {
        if (msg.enabled) applyDarkMode();
        else removeDarkMode();
    }
});
