import type { ResultRow } from "@app/shared/dto";
import type { ResultQuery } from "@app/shared/schemas";
import { createEffect, createSignal } from "solid-js";
import type { FilterControls } from "~/components/misc/results-filter/types";
import { useMeta } from "~/hooks/use-meta";
import { fetchResults } from "~/lib/api/results";

export interface UseResultsOptions {
	limit?: number;
}

const STEP_LIMITS = [100, 250, 500, 1000];

export function useResults(filters: FilterControls, options?: UseResultsOptions) {
	const meta = useMeta();
	const [results, setResults] = createSignal<ResultRow[]>([]);
	const [total, setTotal] = createSignal<number | undefined>(undefined);
	const [nextCursor, setNextCursor] = createSignal<string | undefined>(undefined);
	const [loading, setLoading] = createSignal(true);
	const [loadingMore, setLoadingMore] = createSignal(false);
	const [error, setError] = createSignal<string | null>(null);

	let pageStep = 0;

	function getCurrentLimit() {
		if (options?.limit !== undefined) return options.limit;
		const idx = Math.min(pageStep, STEP_LIMITS.length - 1);
		return STEP_LIMITS[idx];
	}

	let currentAbort: AbortController | null = null;
	let requestGen = 0;

	async function loadInitial() {
		if (currentAbort) {
			currentAbort.abort();
		}
		currentAbort = new AbortController();
		const gen = ++requestGen;

		pageStep = 0;
		setLoading(true);
		setError(null);

		const collegeVal = filters.college();
		const branchVal = filters.branch();
		const semVal = filters.semester();
		const sessionVal = filters.session();
		const qVal = filters.query().trim();

		const params: Partial<ResultQuery> = {
			college: collegeVal.length > 0 ? collegeVal : undefined,
			branch: branchVal.length > 0 ? branchVal : undefined,
			sem: semVal.length > 0 ? semVal : undefined,
			session: sessionVal.length > 0 ? sessionVal : undefined,
			q: qVal.length >= 2 ? qVal : undefined,
			by: filters.sortBy(),
			order: filters.sortOrder(),
			limit: getCurrentLimit(),
		};

		try {
			const data = await fetchResults(params, currentAbort.signal);
			if (gen === requestGen) {
				setResults(data.results);
				setTotal(data.total);
				setNextCursor(data.next_cursor);
				setLoading(false);
			}
		} catch (err: unknown) {
			if (gen === requestGen) {
				if (err instanceof Error && err.name === "AbortError") return;
				setError(err instanceof Error ? err.message : "Failed to load results");
				setLoading(false);
			}
		}
	}

	createEffect(() => {
		filters.college();
		filters.branch();
		filters.semester();
		filters.session();
		filters.query();
		filters.sortBy();
		filters.sortOrder();

		loadInitial();
	});

	async function loadMore() {
		const cursor = nextCursor();
		if (!cursor || loadingMore() || loading()) return;

		setLoadingMore(true);
		pageStep++;

		const collegeVal = filters.college();
		const branchVal = filters.branch();
		const semVal = filters.semester();
		const sessionVal = filters.session();
		const qVal = filters.query().trim();

		const params: Partial<ResultQuery> = {
			college: collegeVal.length > 0 ? collegeVal : undefined,
			branch: branchVal.length > 0 ? branchVal : undefined,
			sem: semVal.length > 0 ? semVal : undefined,
			session: sessionVal.length > 0 ? sessionVal : undefined,
			q: qVal.length >= 2 ? qVal : undefined,
			by: filters.sortBy(),
			order: filters.sortOrder(),
			limit: getCurrentLimit(),
			cursor,
		};

		try {
			const data = await fetchResults(params);
			setResults((prev) => [...prev, ...data.results]);
			setNextCursor(data.next_cursor);
		} catch (err: unknown) {
			console.error("Failed to load more results:", err);
		} finally {
			setLoadingMore(false);
		}
	}

	return {
		results,
		total,
		totalItems: () => meta.totalResults(),
		loading,
		loadingMore,
		error,
		hasMore: () => !!nextCursor(),
		loadMore,
		refresh: loadInitial,
		retry: loadInitial,
	};
}
