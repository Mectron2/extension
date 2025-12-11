import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./popup.tsx";

const root = document.getElementById("root")!;
ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
