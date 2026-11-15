import type { ResultRow } from "@app/shared/dto";
import type { ResultQuery } from "@app/shared/schemas";
import { createEffect, createSignal, onCleanup } from "solid-js";
import type { FilterControls } from "~/components/misc/results-filter/types";
import { fetchResults } from "~/lib/api/results";

export interface UseResultsOptions {
	limit?: number;
}

const STEP_LIMITS = [100, 250, 500, 1000];

export function useResults(filters: FilterControls, options?: UseResultsOptions) {
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

	const [debouncedQ, setDebouncedQ] = createSignal(filters.query());

	createEffect(() => {
		const query = filters.query();
		const timer = setTimeout(() => {
			setDebouncedQ(query);
		}, 300);

		onCleanup(() => clearTimeout(timer));
	});

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

		const params: Partial<ResultQuery> = {
			college: collegeVal.length > 0 ? collegeVal : undefined,
			branch: branchVal.length > 0 ? branchVal : undefined,
			sem: semVal.length > 0 ? semVal : undefined,
			session: sessionVal.length > 0 ? sessionVal : undefined,
			q: debouncedQ() && debouncedQ().trim().length >= 2 ? debouncedQ().trim() : undefined,
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
		debouncedQ();
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

		const params: Partial<ResultQuery> = {
			college: collegeVal.length > 0 ? collegeVal : undefined,
			branch: branchVal.length > 0 ? branchVal : undefined,
			sem: semVal.length > 0 ? semVal : undefined,
			session: sessionVal.length > 0 ? sessionVal : undefined,
			q: debouncedQ() && debouncedQ().trim().length >= 2 ? debouncedQ().trim() : undefined,
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
		loading,
		loadingMore,
		error,
		hasMore: () => !!nextCursor(),
		loadMore,
		refresh: loadInitial,
		retry: loadInitial,
	};
}
