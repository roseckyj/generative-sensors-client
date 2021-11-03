import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const location = window.location;

if (location.protocol !== "https:" && !location.href.includes("localhost")) {
    location.replace(
        `https:${location.href.substring(location.protocol.length)}`
    );
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
