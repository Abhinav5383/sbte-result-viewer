import { FilterParams, SortBy, SortDirection } from "@app/shared/schemas";

export { FilterParams, SortBy, SortDirection };

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
	sortBy: () => SortBy;
	sortOrder: () => SortDirection;
	setSortFilter: (by: SortBy, order: SortDirection) => void;
	clearFilters: () => void;
	anyFilterActive: () => boolean;
}
