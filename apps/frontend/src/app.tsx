import { Route, Router } from "@solidjs/router";
import RootLayout from "./pages/layout";
import HomePage from "./pages/page";
import { ResultsProvider } from "./providers/results";
import "./app.css";
import GroupGeneratorPage from "./pages/group-gen/page";

export default function App() {
    return (
        <ResultsProvider>
            <Router base={import.meta.env.BASE_URL}>
                {/* @ts-expect-error */}
                <Route path="/" component={RootLayout}>
                    <Route path="/" component={HomePage} />
                    <Route path="/group-creator" component={GroupGeneratorPage} />
                </Route>
            </Router>
        </ResultsProvider>
    );
}
