export enum FilterParams {
	COLLEGE = "college",
	BRANCH = "branch",
	SEMESTER = "sem",
	SESSION = "session",
	QUERY = "q",
	SORT_BY = "by",
	SORT_ORDER = "order",
}

export type SortColumn = "marks" | "sgpa" | "name" | "reg_no" | "roll";
export type SortDirection = "asc" | "desc";

export interface FilterControls {
	college: () => number[];
	collegeNames: () => string[];
	setCollege: (val: (number | string)[]) => void;
	branch: () => number[];
	branchNames: () => string[];
	setBranch: (val: (number | string)[]) => void;
	semester: () => number[];
	setSemester: (val: number[]) => void;
	session: () => string[];
	setSession: (val: string[]) => void;
	query: () => string;
	setQuery: (val: string) => void;
	flushQuery: () => void;
	sortBy: () => SortColumn;
	sortOrder: () => SortDirection;
	setSortFilter: (by: SortColumn, order: SortDirection) => void;
	clearFilters: () => void;
	anyFilterActive: () => boolean;
}
