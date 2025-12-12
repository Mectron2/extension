import { useCallback, useEffect, useState } from "react";

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

export default function Popup() {
    const [enabled, setEnabled] = useState<boolean>(false);
    const [exceptions, setExceptions] = useState<string[]>([]);
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

    const sendSettingsUpdate = useCallback((next: Settings) => {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (!tab?.id) {
                return;
            }
            chrome.tabs.sendMessage(tab.id, { type: "update_settings", settings: next });
        });
    }, []);

    const getExceptions = useCallback(async () => {
        const { exceptions } =
            (await chrome.storage.local.get(["exceptions"])) as { exceptions?: string[] };
        return exceptions || [];
    }, []);

    useEffect(() => {
        chrome.storage.local.get(["enabled", "settings"]).then(({ enabled, settings }) => {
            setEnabled(!!enabled);
            if (settings) {
                setSettings((prev) => ({ ...prev, ...settings }));
            } else {
                void chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
            }
        });

        getExceptions().then(setExceptions);
    }, [getExceptions]);

    const handleToggle = useCallback(async () => {
        const { enabled } = await chrome.storage.local.get(["enabled"]);
        const newState = !enabled;

        await chrome.storage.local.set({ enabled: newState });
        setEnabled(newState);

        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (!tab?.id) {
                return;
            }
            chrome.tabs.sendMessage(tab.id, { type: "toggle", enabled: newState });
        });
    }, []);

    const persistAndBroadcastSettings = useCallback((partial: Partial<Settings>) => {
        setSettings((prev) => {
            const next = { ...prev, ...partial };
            void chrome.storage.local.set({ settings: next });
            sendSettingsUpdate(next);
            return next;
        });
    }, [sendSettingsUpdate]);

    const addToExceptions = useCallback(async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab.url) {
            const domain = new URL(tab.url).hostname;

            const { exceptions } =
                (await chrome.storage.local.get(["exceptions"])) as { exceptions?: string[] };

            if (exceptions && exceptions.includes(domain)) {
                return;
            }

            const updated = exceptions ? [...exceptions, domain] : [domain];
            await chrome.storage.local.set({ exceptions: updated });

            setExceptions(updated);
        }
    }, []);

    const removeFromExceptions = useCallback(async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab.url) {
            const domain = new URL(tab.url).hostname;

            const { exceptions } =
                (await chrome.storage.local.get(["exceptions"])) as { exceptions?: string[] };

            if (exceptions) {
                const updated = exceptions.filter((d) => d !== domain);
                await chrome.storage.local.set({ exceptions: updated });
                setExceptions(updated);
            }
        }
    }, []);

    return (
        <div className="w-[300px] p-4 bg-gray-900 text-white shadow-xl space-y-5">
            <h1 className="text-xl font-semibold text-center">Darkify</h1>

            <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                <span className="text-sm font-medium">Dark Mode</span>

                <button
                    onClick={handleToggle}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${
                        enabled ? "bg-green-500" : "bg-gray-500"
                    }`}
                >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                            enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                </button>
            </div>

            <div className='space-y-4 flex items-center justify-center flex-col'>
                <label className='w-full flex flex-col items-start text-sm'>
                    Brightness: {settings.brightness.toFixed(1)}
                    <input type='range' className='w-full'
                        min={0}
                        max={3}
                        step={0.1}
                        value={settings.brightness}
                        onChange={e => persistAndBroadcastSettings({ brightness: Number(e.target.value) })}
                    />
                </label>
                <label className='w-full flex flex-col items-start text-sm'>
                    Contrast: {settings.contrast.toFixed(1)}
                    <input type='range' className='w-full'
                        min={0}
                        max={3}
                        step={0.1}
                        value={settings.contrast}
                        onChange={e => persistAndBroadcastSettings({ contrast: Number(e.target.value) })}
                    />
                </label>
                <label className='w-full flex flex-col items-start text-sm'>
                    Grayscale: {settings.grayscale.toFixed(1)}
                    <input type='range' className='w-full'
                        min={0}
                        max={1}
                        step={0.1}
                        value={settings.grayscale}
                        onChange={e => persistAndBroadcastSettings({ grayscale: Number(e.target.value) })}
                    />
                </label>
            </div>

            <div className="space-y-2">
                <button
                    onClick={addToExceptions}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-sm font-medium"
                >
                    Add to Exceptions
                </button>

                <button
                    onClick={removeFromExceptions}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 transition rounded-lg text-sm font-medium"
                >
                    Remove From Exceptions
                </button>
            </div>

            <div>
                <h2 className="text-sm font-semibold mb-2">Exceptions:</h2>

                {exceptions.length === 0 ? (
                    <p className="text-gray-400 text-sm">No exceptions added.</p>
                ) : (
                    <ul className="space-y-1">
                        {exceptions.map((domain, i) => (
                            <li
                                key={i}
                                className="bg-gray-800 p-2 rounded-md text-xs break-all border border-gray-700"
                            >
                                {domain}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
