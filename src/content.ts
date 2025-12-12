export const getExceptions = async () => {
    const { exceptions } = (await chrome.storage.local.get(["exceptions"])) as { exceptions?: string[] };
    return exceptions || [];
};

type Settings = {
    brightness: number;
    contrast: number;
    grayscale: number;
};

const DEFAULT_SETTINGS: Settings = {
    brightness: 1,
    contrast: 1,
    grayscale: 0
};

const domain = new URL(window.location.href).hostname;
const DARK_MODE_CLASS = "extension-dark-mode";
const DARK_MODE_STYLE_ID = "extension-dark-mode-style";
const INVERT_FILTER = "invert(1) hue-rotate(180deg)";

const makeFilter = ({ brightness, contrast, grayscale }: Settings) =>
    `invert(1) hue-rotate(180deg) brightness(${brightness}) contrast(${contrast}) grayscale(${grayscale})`;

function ensureDarkModeStyles(settings: Settings) {
    const css = `
        html.${DARK_MODE_CLASS} {
            filter: ${makeFilter(settings)} !important;
            background: #111 !important;
        }
        
        html.${DARK_MODE_CLASS} img,
        html.${DARK_MODE_CLASS} video,
        html.${DARK_MODE_CLASS} picture,
        html.${DARK_MODE_CLASS} canvas {
            filter: ${INVERT_FILTER} !important;
        }
    `;

    const existingStyle = document.getElementById(DARK_MODE_STYLE_ID) as HTMLStyleElement | null;
    if (existingStyle) {
        existingStyle.textContent = css;
        return;
    }

    const style = document.createElement("style");
    style.id = DARK_MODE_STYLE_ID;
    style.textContent = css;
    document.head.append(style);
}

function applyDarkMode(settings: Settings) {
    ensureDarkModeStyles(settings);
    document.documentElement.classList.add(DARK_MODE_CLASS);
}

function removeDarkMode() {
    document.documentElement.classList.remove(DARK_MODE_CLASS);
    const style = document.getElementById(DARK_MODE_STYLE_ID);
    if (style) {
        style.remove();
    }
}

async function refreshDarkMode(overrideSettings?: Settings) {
    const [state, exceptions] = await Promise.all([
        chrome.storage.local.get(["enabled", "settings"]),
        getExceptions()
    ]);
    const enabled = state.enabled as boolean | undefined;
    const storedSettings = state.settings as Partial<Settings> | undefined;
    const currentSettings =
        overrideSettings || { ...DEFAULT_SETTINGS, ...(storedSettings || {}) };

    if (!enabled || exceptions.includes(domain)) {
        removeDarkMode();
        return;
    }

    applyDarkMode(currentSettings);
}

void refreshDarkMode();

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && (changes.enabled || changes.exceptions || changes.settings)) {
        void refreshDarkMode();
    }
});

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "toggle") {
        void refreshDarkMode();
    }

    if (msg.type === "update_settings" && msg.settings) {
        void refreshDarkMode(msg.settings);
    }
});
