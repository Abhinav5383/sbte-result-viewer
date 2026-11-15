import { ResultsFilter } from "~/components/misc/results-filter/component";
import { useFilterControls } from "~/components/misc/results-filter/hook";
import { useLeaderboard } from "~/hooks/use-leaderboard";
import { LeaderboardTable } from "./components/leaderboard-table";

export default function LeaderboardPage() {
	const filters = useFilterControls({ sortBy: "sgpa", sortOrder: "desc" });
	const leaderboardHook = useLeaderboard(filters);

	return (
		<main class="@container grid content-start">
			<div class="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
				<div class="grid gap-1">
					<h1 class="text-3xl font-bold text-normal-fg">Leaderboard</h1>
					<p class="text-dim-fg text-sm">
						Student rankings averaged across all available results.
					</p>
				</div>
			</div>

			<div class="grid grid-cols-1 @min-desktop:grid-cols-[4fr_3fr_2fr_2fr] gap-x-2.5 gap-y-4 py-4 px-6">
				<ResultsFilter
					hook={filters}
					hideFilters={["query"]}
					sortOptions={[
						{ value: "sgpa", label: "Avg SGPA" },
						{ value: "marks", label: "Avg Marks" },
						{ value: "name", label: "Name" },
						{ value: "reg_no", label: "Roll No" },
					]}
				/>
			</div>

			<LeaderboardTable
				results={leaderboardHook.results()}
				total={leaderboardHook.total()}
				totalItems={leaderboardHook.totalItems()}
				loading={leaderboardHook.loading()}
				loadingMore={leaderboardHook.loadingMore()}
				hasMore={leaderboardHook.hasMore()}
				loadMore={leaderboardHook.loadMore}
				sortBy={filters.sortBy}
				sortOrder={filters.sortOrder}
				setSort={filters.setSortFilter}
				clearFilters={filters.clearFilters}
				anyFilterActive={filters.anyFilterActive()}
				showCollegeColumn={filters.college().length !== 1}
				error={leaderboardHook.error()}
				onRetry={leaderboardHook.retry}
			/>
		</main>
	);
}
