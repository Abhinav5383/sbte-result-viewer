import { useSearchParams } from "@solidjs/router";
import { createMemo } from "solid-js";
import { useMeta } from "~/hooks/use-meta";
import { type FilterControls, FilterParams, type SortColumn, type SortDirection } from "./types";

export interface UseFilterControlsOptions {
	sortBy?: SortColumn;
	sortOrder?: SortDirection;
}

const VALID_SORT_COLUMNS: SortColumn[] = ["marks", "sgpa", "name", "reg_no", "roll"];
const VALID_SORT_DIRECTIONS: SortDirection[] = ["asc", "desc"];

function parseArrayParam(val: unknown): string[] {
	if (!val) return [];
	if (Array.isArray(val)) {
		return val
			.flatMap((v) => (typeof v === "string" ? v.split(",") : String(v)))
			.map((s) => s.trim())
			.filter(Boolean);
	}
	if (typeof val === "string") {
		return val
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
	}
	return [];
}

function parseNumberArrayParam(val: unknown): number[] {
	return parseArrayParam(val)
		.map((v) => Number.parseInt(v, 10))
		.filter((n) => !Number.isNaN(n));
}

export function useFilterControls(options?: UseFilterControlsOptions): FilterControls {
	const defaultSortBy: SortColumn = options?.sortBy ?? "marks";
	const defaultSortOrder: SortDirection = options?.sortOrder ?? "desc";

	const meta = useMeta();
	const [searchParams, setSearchParams] = useSearchParams();

	const rawCollegeParams = () => parseArrayParam(searchParams[FilterParams.COLLEGE]);

	const collegeNames = createMemo(() => {
		const raw = rawCollegeParams();
		return raw.map((entry) => meta.getCollegeCanonicalName(entry)).filter(Boolean);
	});

	const college = createMemo(() => {
		const raw = rawCollegeParams();
		return raw
			.map((entry) => meta.getCollegeCode(entry))
			.filter((c): c is number => c !== undefined);
	});

	function setCollege(vals: (number | string)[]) {
		const names = vals
			.map((v) => meta.getCollegeCanonicalName(v))
			.filter(Boolean)
			.sort((a, b) => a.localeCompare(b));
		setSearchParams(
			{ [FilterParams.COLLEGE]: names.length > 0 ? names : null },
			{ replace: true },
		);
	}

	const rawBranchParams = () => parseArrayParam(searchParams[FilterParams.BRANCH]);

	const branchNames = createMemo(() => {
		const raw = rawBranchParams();
		return raw.map((entry) => meta.getBranchCanonicalName(entry)).filter(Boolean);
	});

	const branch = createMemo(() => {
		const raw = rawBranchParams();
		return raw
			.map((entry) => meta.getBranchCode(entry))
			.filter((b): b is number => b !== undefined);
	});

	function setBranch(vals: (number | string)[]) {
		const names = vals
			.map((v) => meta.getBranchCanonicalName(v))
			.filter(Boolean)
			.sort((a, b) => a.localeCompare(b));
		setSearchParams(
			{ [FilterParams.BRANCH]: names.length > 0 ? names : null },
			{ replace: true },
		);
	}

	const semester = () =>
		parseNumberArrayParam(searchParams[FilterParams.SEMESTER] ?? searchParams.semester);
	function setSemester(vals: number[]) {
		const sorted = [...vals].sort((a, b) => a - b);
		setSearchParams(
			{
				[FilterParams.SEMESTER]: sorted.length > 0 ? sorted.map(String) : null,
				semester: null,
			},
			{ replace: true },
		);
	}

	const session = () => parseArrayParam(searchParams[FilterParams.SESSION]);
	function setSession(vals: string[]) {
		const sorted = [...vals].sort((a, b) => a.localeCompare(b));
		setSearchParams(
			{ [FilterParams.SESSION]: sorted.length > 0 ? sorted : null },
			{ replace: true },
		);
	}

	const queryFromUrl = () => {
		const q = searchParams[FilterParams.QUERY] ?? searchParams.query;
		if (typeof q === "string") return q;
		return "";
	};

	function setQuery(newQ: string) {
		const trimmed = newQ.trim();
		setSearchParams(
			{
				[FilterParams.QUERY]: trimmed ? newQ : null,
				query: null,
			},
			{ replace: true },
		);
	}

	const sortBy = () => {
		const raw = (searchParams[FilterParams.SORT_BY] ?? searchParams.sortBy) as
			| SortColumn
			| undefined;
		if (raw && VALID_SORT_COLUMNS.includes(raw)) {
			return raw;
		}
		return defaultSortBy;
	};

	const sortOrder = () => {
		const raw = searchParams[FilterParams.SORT_ORDER] as SortDirection | undefined;
		if (raw && VALID_SORT_DIRECTIONS.includes(raw)) {
			return raw;
		}
		return defaultSortOrder;
	};

	function setSortFilter(by: SortColumn, order: SortDirection) {
		setSearchParams(
			{
				[FilterParams.SORT_BY]: by === defaultSortBy ? null : by,
				sortBy: null,
				[FilterParams.SORT_ORDER]: order === defaultSortOrder ? null : order,
			},
			{ replace: true },
		);
	}

	const anyFilterActive = createMemo(() => {
		return (
			rawCollegeParams().length > 0 ||
			rawBranchParams().length > 0 ||
			semester().length > 0 ||
			session().length > 0 ||
			queryFromUrl().trim().length > 0
		);
	});

	function clearFilters() {
		setSearchParams(
			{
				[FilterParams.COLLEGE]: null,
				[FilterParams.BRANCH]: null,
				[FilterParams.SEMESTER]: null,
				semester: null,
				[FilterParams.SESSION]: null,
				[FilterParams.QUERY]: null,
				query: null,
			},
			{ replace: true },
		);
	}

	return {
		college,
		collegeNames,
		setCollege,
		branch,
		branchNames,
		setBranch,
		semester,
		setSemester,
		session,
		setSession,
		query: queryFromUrl,
		setQuery,
		sortBy,
		sortOrder,
		setSortFilter,
		clearFilters,
		anyFilterActive,
	};
}
