import {useCallback, useEffect, useState} from "react";

export default function Popup() {
    const [enabled, setEnabled] = useState<boolean>(false);
    const [exceptions, setExceptions] = useState<string[]>([]);

    const getExceptions = useCallback(async () => {
        const { exceptions } = (await chrome.storage.local.get(["exceptions"])) as { exceptions?: string[] };
        return exceptions || [];
    }, []);

    useEffect(() => {
        chrome.storage.local.get(["enabled"]).then(({enabled}) => {
            setEnabled(!!enabled);
        });

        getExceptions().then(setExceptions);
    }, [getExceptions]);

    const handleToggle = useCallback(async () => {
        const {enabled} = await chrome.storage.local.get(["enabled"]);
        const newState = !enabled;

        await chrome.storage.local.set({enabled: newState});
        setEnabled(newState);

        chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
            chrome.tabs.sendMessage(tab.id!, {type: "toggle", enabled: newState});
        });
    }, []);

    const addToExceptions = useCallback(async () => {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        if (tab.url) {
            const url = new URL(tab.url);
            const domain = url.hostname;

            const { exceptions } = (await chrome.storage.local.get(["exceptions"])) as { exceptions?: string[] };
            const updatedExceptions = exceptions ? [...exceptions, domain] : [domain];

            await chrome.storage.local.set({exceptions: updatedExceptions});

            setExceptions(updatedExceptions);
        }
    }, []);

    const removeFromExceptions = useCallback(async () => {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        if (tab.url) {
            const url = new URL(tab.url);
            const domain = url.hostname;

            const { exceptions } = (await chrome.storage.local.get(["exceptions"])) as { exceptions?: string[] };
            if (exceptions) {
                const updatedExceptions = exceptions.filter(d => d !== domain);
                await chrome.storage.local.set({exceptions: updatedExceptions});
            }

            setExceptions(prev => prev.filter(d => d !== domain));
        }
    }, []);

    return (
        <div>
            <h1>Extension Popup</h1>
            <button onClick={handleToggle}>{ enabled ? "Disable Dark Mode" : "Enable Dark Mode" }</button>
            <div style={{ marginTop: "10px" }}>
                <button onClick={addToExceptions}>Add Current Domain to Exceptions</button>
                <button onClick={removeFromExceptions} style={{ marginLeft: "10px" }}>Remove Current Domain from Exceptions</button>
            </div>
            <div style={{ marginTop: "10px" }}>
                <strong>Exceptions:</strong>
                <ul>
                    {exceptions.map((domain, index) => (
                        <li key={index}>{domain}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}