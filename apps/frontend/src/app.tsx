import { HashRouter, Route } from "@solidjs/router";
import NotFoundPage from "./pages/404";
import AboutPage from "./pages/about/page";
import RootLayout from "./pages/layout";
import LeaderboardPage from "./pages/leaderboard/page";
import HomePage from "./pages/page";
import CsvExportPage from "./pages/tools/csv-export/page";
import { ToolsPage } from "./pages/tools/page";

import "./app.css";

export default function App() {
	return (
		<HashRouter>
			{/* @ts-expect-error router component typing */}
			<Route path="/" component={RootLayout}>
				<Route path="/" component={HomePage} />
				<Route path="/leaderboard" component={LeaderboardPage} />
				<Route path="/about" component={AboutPage} />
				<Route path="/tools">
					<Route component={ToolsPage} />
					<Route path="/csv-export" component={CsvExportPage} />
				</Route>

				<Route path="*" component={NotFoundPage} />
			</Route>
		</HashRouter>
	);
}
