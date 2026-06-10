/* @refresh reload */
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import analyticsScript from "~/lib/umalytics.js?raw";
import App from "./app.tsx";
import "./index.css";

const root = document.getElementById("root");
if (root) {
    render(() => <Router root={App} />, root);
}

if (!import.meta.env.DEV) {
    const script = document.createElement("script");
    script.setAttribute("data-website-id", "e9826197-f32b-4fa6-9df2-1691dada9ff4");
    script.innerHTML = analyticsScript;

    document.head.appendChild(script);
}
