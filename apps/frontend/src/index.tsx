/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";
import App from "./app.tsx";
import "./index.css";

const root = document.getElementById("root");
if (root)
    render(
        () => (
            <Router>
                <Route path="/" component={App} />
            </Router>
        ),
        root,
    );
