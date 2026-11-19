import type { LeaderboardRow } from "@app/shared/dto";
import type { FilterControls } from "~/components/misc/results-filter/types";
import { useMeta } from "~/hooks/use-meta";
import { usePaginatedList } from "~/hooks/use-paginated-list";
import { fetchLeaderboard } from "~/lib/api/results";

export function useLeaderboard(filters: FilterControls) {
	const meta = useMeta();
	const list = usePaginatedList<LeaderboardRow>(filters, {
		fetchPage: fetchLeaderboard,
		errorMessage: "Failed to load leaderboard",
	});

	return { ...list, totalItems: () => meta.totalStudents() };
}
