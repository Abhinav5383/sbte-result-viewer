import { HashRouter, Route } from "@solidjs/router";
import RootLayout from "./pages/layout";
import HomePage from "./pages/page";
import CsvExportPage from "./pages/tools/csv-export/page";
import RandomGroupGeneratorPage from "./pages/tools/group-generator/page";
import { ToolsPage } from "./pages/tools/page";
import { ResultsProvider } from "./providers/results";

import "./app.css";

export default function App() {
    return (
        <ResultsProvider>
            <HashRouter>
                {/* @ts-expect-error */}
                <Route path="/" component={RootLayout}>
                    <Route path="/" component={HomePage} />
                    <Route path="/tools">
                        <Route component={ToolsPage} />
                        <Route path="/csv-export" component={CsvExportPage} />
                        <Route path="/group-generator" component={RandomGroupGeneratorPage} />
                    </Route>
                </Route>
            </HashRouter>
        </ResultsProvider>
    );
}
