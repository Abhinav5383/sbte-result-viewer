import { ResultsFilter } from "~/components/misc/results-filter/component";
import { useFilterControls } from "~/components/misc/results-filter/hook";
import { useResults } from "~/hooks/use-results";
import { ResultsListTable } from "./components/results-table";

export function ResultListPage() {
	const filters = useFilterControls({ sortBy: "marks", sortOrder: "desc" });
	const resultsHook = useResults(filters);

	return (
		<div id="results" class="@container">
			<div class="grid grid-cols-1 @min-desktop:grid-cols-[4fr_3fr_2fr_2fr_2fr] gap-x-2.5 gap-y-4 py-4 px-6">
				<ResultsFilter hook={filters} />
			</div>

			<ResultsListTable
				results={resultsHook.results()}
				total={resultsHook.total()}
				totalItems={resultsHook.totalItems()}
				loading={resultsHook.loading()}
				loadingMore={resultsHook.loadingMore()}
				hasMore={resultsHook.hasMore()}
				loadMore={resultsHook.loadMore}
				sortBy={filters.sortBy}
				sortOrder={filters.sortOrder}
				setSort={filters.setSortFilter}
				clearFilters={filters.clearFilters}
				anyFilterActive={filters.anyFilterActive()}
				showCollegeColumn={filters.college().length !== 1}
				error={resultsHook.error()}
				onRetry={resultsHook.retry}
			/>
		</div>
	);
}
