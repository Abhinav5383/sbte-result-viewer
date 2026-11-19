import { createEffect, createSignal, on } from "solid-js";
import type { FilterControls, SortBy, SortDirection } from "~/components/misc/results-filter/types";

export interface ListParams {
	college?: number[];
	branch?: number[];
	sem?: number[];
	session?: string[];
	q?: string;
	by: SortBy;
	order: SortDirection;
	limit: number;
	cursor?: string;
}

export interface ListPage<Row> {
	results: Row[];
	total?: number;
	next_cursor?: string;
}

export interface UsePaginatedListOptions<Row> {
	fetchPage: (params: ListParams, signal: AbortSignal) => Promise<ListPage<Row>>;
	errorMessage: string;
	withSearch?: boolean;
	limit?: number;
}

const STEP_LIMITS = [100, 250, 500, 1000];
const MIN_SEARCH_LENGTH = 2;

function nonEmpty<T>(arr: T[]): T[] | undefined {
	return arr.length > 0 ? arr : undefined;
}

export function usePaginatedList<Row>(
	filters: FilterControls,
	options: UsePaginatedListOptions<Row>,
) {
	const [results, setResults] = createSignal<Row[]>([]);
	const [total, setTotal] = createSignal<number | undefined>(undefined);
	const [nextCursor, setNextCursor] = createSignal<string | undefined>(undefined);
	const [loading, setLoading] = createSignal(true);
	const [loadingMore, setLoadingMore] = createSignal(false);
	const [error, setError] = createSignal<string | null>(null);

	let pageStep = 0;
	let currentAbort: AbortController | null = null;
	let requestGen = 0;

	function getCurrentLimit() {
		if (options.limit !== undefined) return options.limit;
		return STEP_LIMITS[Math.min(pageStep, STEP_LIMITS.length - 1)];
	}

	function buildParams(): ListParams {
		const q = options.withSearch ? filters.query().trim() : "";

		return {
			college: nonEmpty(filters.college()),
			branch: nonEmpty(filters.branch()),
			sem: nonEmpty(filters.semester()),
			session: nonEmpty(filters.session()),
			q: q.length >= MIN_SEARCH_LENGTH ? q : undefined,
			by: filters.sortBy(),
			order: filters.sortOrder(),
			limit: getCurrentLimit(),
		};
	}

	async function loadInitial() {
		currentAbort?.abort();
		currentAbort = new AbortController();
		const gen = ++requestGen;

		pageStep = 0;
		setLoading(true);
		setError(null);

		try {
			const data = await options.fetchPage(buildParams(), currentAbort.signal);
			if (gen !== requestGen) return;
			setResults(data.results);
			setTotal(data.total);
			setNextCursor(data.next_cursor);
			setLoading(false);
		} catch (err: unknown) {
			if (gen !== requestGen) return;
			if (err instanceof Error && err.name === "AbortError") return;
			setError(err instanceof Error ? err.message : options.errorMessage);
			setLoading(false);
		}
	}

	createEffect(on(buildParams, () => loadInitial()));

	async function loadMore() {
		const cursor = nextCursor();
		if (!cursor || !currentAbort || loadingMore() || loading()) return;

		setLoadingMore(true);
		pageStep++;

		const gen = requestGen;
		try {
			const data = await options.fetchPage({ ...buildParams(), cursor }, currentAbort.signal);
			if (gen !== requestGen) return;
			setResults((prev) => [...prev, ...data.results]);
			setNextCursor(data.next_cursor);
		} catch (err: unknown) {
			if (gen !== requestGen) return;
			console.error(`${options.errorMessage}:`, err);
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
		retry: loadInitial,
	};
}
