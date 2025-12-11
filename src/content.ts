export const getExceptions = async () => {
    const { exceptions } = (await chrome.storage.local.get(["exceptions"])) as { exceptions?: string[] };
    return exceptions || [];
};

const domain = new URL(window.location.href).hostname;
const DARK_MODE_CLASS = "extension-dark-mode";
const DARK_MODE_STYLE_ID = "extension-dark-mode-style";
const INVERT_FILTER = "invert(1) hue-rotate(180deg)";

function ensureDarkModeStyles() {
    if (document.getElementById(DARK_MODE_STYLE_ID)) {
        return;
    }

    const style = document.createElement("style");
    style.id = DARK_MODE_STYLE_ID;
    style.textContent = `
        html.${DARK_MODE_CLASS} {
            filter: ${INVERT_FILTER} !important;
            background: #111 !important;
        }

        html.${DARK_MODE_CLASS} img,
        html.${DARK_MODE_CLASS} video,
        html.${DARK_MODE_CLASS} picture,
        html.${DARK_MODE_CLASS} canvas {
            filter: ${INVERT_FILTER} !important;
        }
    `;
    document.head.append(style);
}

function applyDarkMode() {
    ensureDarkModeStyles();
    document.documentElement.classList.add(DARK_MODE_CLASS);
}

function removeDarkMode() {
    document.documentElement.classList.remove(DARK_MODE_CLASS);
    const style = document.getElementById(DARK_MODE_STYLE_ID);
    if (style) {
        style.remove();
    }
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
