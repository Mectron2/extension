export const getExceptions = async () => {
    const { exceptions } = (await chrome.storage.local.get(["exceptions"])) as { exceptions?: string[] };
    return exceptions || [];
};

const domain = new URL(window.location.href).hostname;

function applyDarkMode() {
    document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
}

function removeDarkMode() {
    document.documentElement.style.filter = "";
}

async function refreshDarkMode() {
    const [{ enabled }, exceptions] = await Promise.all([
        chrome.storage.local.get(["enabled"]),
        getExceptions()
    ]);

    console.log('Exceptions: ', exceptions);
    console.log('Enabled: ', enabled);
    console.log('Current domain: ', domain);

    if (!enabled || exceptions.includes(domain)) {
        removeDarkMode();
        return;
    }

    applyDarkMode();
}

void refreshDarkMode();

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && (changes.enabled || changes.exceptions)) {
        void refreshDarkMode();
    }
});

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "toggle") {
        void refreshDarkMode();
    }
});
