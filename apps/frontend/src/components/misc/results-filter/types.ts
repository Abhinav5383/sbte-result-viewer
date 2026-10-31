import type { SearchBy, SortBy, SortOrder } from "~/lib/types";

export interface Filters {
    college: string[];
    branch: string[];
    semester: string[];
    admissionYear: string[];
}

export type FilterOptions = {
    [K in keyof Filters]: Filters[K];
};

export enum FilterParams {
    SEARCH_BY = "searchBy",
    QUERY = "query",
    COLLEGE = "college",
    BRANCH = "branch",
    SEMESTER = "sem",
    SESSION = "session",
}

export interface FilterControls {
    college: () => string[];
    setCollege: (clg: string[]) => void;
    branch: () => string[];
    setBranch: (br: string[]) => void;
    semester: () => string[];
    setSemester: (sem: string[]) => void;
    session: () => string[];
    setSession: (sess: string[]) => void;
    searchBy: () => SearchBy;
    setSearchBy: (newVal: SearchBy) => void;
    searchQuery: () => string;
    setSearchQuery: (q: string) => void;
    clearFilters: () => void;
    anyFilterActive: () => boolean;
    sortBy: () => SortBy;
    sortOrder: () => SortOrder;
    setSortFilter: (by: SortBy, order: SortOrder) => void;
    setQueryInputRef: (ref: HTMLInputElement) => void;
}
