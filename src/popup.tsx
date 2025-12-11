import {useCallback, useEffect, useState} from "react";

export default function Popup() {
    const [enabled, setEnabled] = useState<boolean>(false);

    useEffect(() => {
        chrome.storage.local.get(["enabled"]).then(({enabled}) => {
            setEnabled(!!enabled);
        });
    }, []);

    const handleToggle = useCallback(async () => {
        const {enabled} = await chrome.storage.local.get(["enabled"]);
        const newState = !enabled;

        await chrome.storage.local.set({enabled: newState});
        setEnabled(newState);

        chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
            chrome.tabs.sendMessage(tab.id!, {type: "toggle", enabled: newState});
        });
    }, []);

    return (
        <div>
            <h1>Extension Popup</h1>
            <button onClick={handleToggle}>{ enabled ? "Disable Dark Mode" : "Enable Dark Mode" }</button>
        </div>
    );
}