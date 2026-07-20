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
