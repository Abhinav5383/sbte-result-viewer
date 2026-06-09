/* @refresh reload */
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import App from "./app.tsx";
import "./index.css";

console.log(import.meta.env);

const root = document.getElementById("root");
if (root) {
    render(() => <Router root={App} />, root);
}
