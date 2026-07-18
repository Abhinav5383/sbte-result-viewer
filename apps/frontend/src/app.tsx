import { Route, Router } from "@solidjs/router";
import HomePage from "./pages/home";
import RootLayout from "./pages/layout";
import "./app.css";
import { ResultsProvider } from "./providers/results";

export default function App() {
    return (
        <ResultsProvider>
            <Router base={import.meta.env.BASE_URL}>
                {/* @ts-expect-error */}
                <Route path="/" component={RootLayout}>
                    <Route path="/" component={HomePage} />
                </Route>
            </Router>
        </ResultsProvider>
    );
}
