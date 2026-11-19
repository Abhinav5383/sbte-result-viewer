import type { ResultRow } from "@app/shared/dto";
import type { FilterControls } from "~/components/misc/results-filter/types";
import { useMeta } from "~/hooks/use-meta";
import { usePaginatedList } from "~/hooks/use-paginated-list";
import { fetchResults } from "~/lib/api/results";

export function useResults(filters: FilterControls, options?: { limit?: number }) {
	const meta = useMeta();
	const list = usePaginatedList<ResultRow>(filters, {
		fetchPage: fetchResults,
		errorMessage: "Failed to load results",
		withSearch: true,
		limit: options?.limit,
	});

	return { ...list, totalItems: () => meta.totalResults() };
}
