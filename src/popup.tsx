import { useCallback, useEffect, useState } from "react";

export default function Popup() {
    const [enabled, setEnabled] = useState<boolean>(false);
    const [exceptions, setExceptions] = useState<string[]>([]);
    const [brightness, setBrightness] = useState<number>(1);
    const [contrast, setContrast] = useState<number>(1);

    const getExceptions = useCallback(async () => {
        const { exceptions } =
            (await chrome.storage.local.get(["exceptions"])) as { exceptions?: string[] };
        return exceptions || [];
    }, []);

    useEffect(() => {
        chrome.storage.local.get(["enabled"]).then(({ enabled }) => {
            setEnabled(!!enabled);
        });

        getExceptions().then(setExceptions);
    }, [getExceptions]);

    const handleToggle = useCallback(async () => {
        const { enabled } = await chrome.storage.local.get(["enabled"]);
        const newState = !enabled;

        await chrome.storage.local.set({ enabled: newState });
        setEnabled(newState);

        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id!, { type: "toggle", enabled: newState });
        });
    }, []);

    const handleBrightnessOrContrastChange = useCallback(async (brght: number | undefined, cntr: number | undefined) => {
        if (brght) setBrightness(brght);
        if (cntr) setContrast(cntr);

        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id!, { type: "brightness_contrast", brightness, contrast });
        })
    }, [brightness, contrast]);

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
                    Brightness: {brightness.toFixed(1)}
                    <input type='range' className='w-full'
                        min={0}
                        max={3}
                        step={0.1}
                        value={brightness.toFixed(1)}
                        onChange={e => handleBrightnessOrContrastChange(Number(e.target.value), undefined)}
                    />
                </label>
                <label className='w-full flex flex-col items-start text-sm'>
                    Contrast: {contrast.toFixed(1)}
                    <input type='range' className='w-full'
                        min={0}
                        max={3}
                        step={0.1}
                        value={contrast.toFixed(1)}
                        onChange={e => handleBrightnessOrContrastChange(undefined, Number(e.target.value))}
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
