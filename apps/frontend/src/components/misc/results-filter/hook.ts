import type { EncodedData, EncodedResultT } from "@app/shared/encoder";
import { getVal } from "@app/shared/encoder/helpers";
import { BRANCH_NAME, COLLEGE_NAME } from "@app/shared/types";
import { getBranchFromRoll, getCollegeFromRoll, getSessionFromRoll } from "@app/shared/utils";
import { useSearchParams } from "@solidjs/router";
import { createEffect, createMemo } from "solid-js";
import { getValidEntry } from "~/lib/enum";
import { SearchBy, SortBy, SortOrder } from "~/lib/types";
import { type FilterControls, FilterParams, type Filters } from "./types";

export const defaultFilterOptions = {
    searchBy: SearchBy.Name,
    sortBy: SortBy.Marks,
    sortOrder: SortOrder.Descending,
};

export function useFilterControls(defaultOps?: Partial<typeof defaultFilterOptions>): FilterControls {
    const DEFAULTS = { ...defaultFilterOptions, ...defaultOps };
    const [searchParams, _setSearchParams] = useSearchParams();

    const setSearchParams: typeof _setSearchParams = (params, options) => {
        _setSearchParams(params, { replace: true, ...options });
    };

    const searchBy = () => getValidEntry(searchParams[FilterParams.SEARCH_BY], SearchBy, DEFAULTS.searchBy);
    function setSearchBy(newVal: SearchBy) {
        setSearchParams({
            [FilterParams.SEARCH_BY]: newVal === DEFAULTS.searchBy ? null : newVal,
            [FilterParams.QUERY]: "",
        });
    }

    let queryInputRef = undefined as HTMLInputElement | undefined;
    function setQueryInputRef(ref: HTMLInputElement) {
        queryInputRef = ref;
    }

    const searchQuery = () => {
        const q = searchParams[FilterParams.QUERY];
        if (typeof q === "string") return q;
        return "";
    };
    function setSearchQuery(q: string) {
        setSearchParams({ [FilterParams.QUERY]: q });
    }
    createEffect(() => {
        if (queryInputRef) {
            queryInputRef.value = searchQuery();
        }
    });

    const college = () => getValidMultiSelectFilter(searchParams[FilterParams.COLLEGE], COLLEGE_NAME, []);
    function setCollege(clg: string[]) {
        setSearchParams({ [FilterParams.COLLEGE]: clg });
    }

    const branch = () => getValidMultiSelectFilter(searchParams[FilterParams.BRANCH], BRANCH_NAME, []);
    function setBranch(br: string[]) {
        setSearchParams({ [FilterParams.BRANCH]: br });
    }

    const semester = () => getMultiSelectFilter(searchParams[FilterParams.SEMESTER]);
    function setSemester(sem: string[]) {
        setSearchParams({ [FilterParams.SEMESTER]: sem });
    }

    const session = () => getMultiSelectFilter(searchParams[FilterParams.SESSION]);
    function setSession(sess: string[]) {
        setSearchParams({ [FilterParams.SESSION]: sess });
    }

    function clearFilters() {
        const newVal: Record<string, string> = {};
        for (const key of Object.values(FilterParams)) {
            newVal[key] = "";
        }
        setSearchParams(newVal);
    }

    const anyFilterActive = () => {
        for (const val of Object.values(FilterParams)) {
            if (searchParams[val]) return true;
        }
        return false;
    };

    const sortBy = () => getValidEntry(searchParams.sortBy, SortBy, DEFAULTS.sortBy);
    const sortOrder = () => getValidEntry(searchParams.order, SortOrder, DEFAULTS.sortOrder);
    function setSortFilter(by: SortBy, order: SortOrder) {
        setSearchParams({
            sortBy: by === DEFAULTS.sortBy ? null : by,
            order: order === DEFAULTS.sortOrder ? null : order,
        });
    }

    return {
        college,
        setCollege,
        branch,
        setBranch,
        semester,
        setSemester,
        session,
        setSession,
        searchBy,
        setSearchBy,
        searchQuery,
        setSearchQuery,
        clearFilters,
        anyFilterActive,
        sortBy,
        sortOrder,
        setSortFilter,
        setQueryInputRef,
    };
}

export function useResultsFilter(data: EncodedData, defaultOps?: Partial<typeof defaultFilterOptions>) {
    const controls = useFilterControls(defaultOps);

    const filteredResults = createMemo(() => {
        const fullList = data.results;
        const filterValues: Filters = {
            college: controls.college(),
            branch: controls.branch(),
            semester: controls.semester(),
            admissionYear: controls.session(),
        };
        const searchQ = controls.searchQuery().trim();
        const searchMode = controls.searchBy();
        const searchLower = searchQ.toLowerCase();

        const hasCollegeFilter = filterValues.college.length > 0;
        const hasBranchFilter = filterValues.branch.length > 0;
        const hasSemesterFilter = filterValues.semester.length > 0;
        const hasSessionFilter = filterValues.admissionYear.length > 0;
        const hasSearch = searchQ.length > 0;

        // fast path: no filters
        if (!hasCollegeFilter && !hasBranchFilter && !hasSemesterFilter && !hasSessionFilter && !hasSearch) {
            return fullList.slice();
        }

        const filtered: EncodedResultT[] = [];

        for (let i = 0; i < fullList.length; i++) {
            const item = data.results[i];
            const roll = getVal(item, "roll");

            if (hasCollegeFilter && !filterValues.college.includes(COLLEGE_NAME[getCollegeFromRoll(roll)])) continue;
            if (hasBranchFilter && !filterValues.branch.includes(BRANCH_NAME[getBranchFromRoll(roll)])) continue;
            if (hasSemesterFilter && !filterValues.semester.includes(roll.charAt(0))) continue;
            if (hasSessionFilter && !filterValues.admissionYear.includes(getSessionFromRoll(roll))) continue;

            if (hasSearch) {
                if (searchMode === SearchBy.Roll) {
                    if (!roll.includes(searchQ)) continue;
                } else {
                    if (!getVal(item, "name").toLowerCase().includes(searchLower)) continue;
                }
            }

            filtered.push(item);
        }

        return filtered;
    });

    const sortedResults = createMemo(() => {
        const sorted = filteredResults();
        const _sortBy = controls.sortBy();
        const _sortOrder = controls.sortOrder();

        const asc = _sortOrder === SortOrder.Ascending;

        sorted.sort((a, b) => {
            const rollA = getVal(a, "roll");
            const rollB = getVal(b, "roll");
            const nameA = getVal(a, "name");
            const nameB = getVal(b, "name");

            switch (_sortBy) {
                case SortBy.Marks: {
                    const diff = getVal(a, "grandTotalObtained") - getVal(b, "grandTotalObtained");
                    return asc ? diff : -diff;
                }

                case SortBy.sgpa: {
                    const diff = getVal(a, "sgpa") - getVal(b, "sgpa");
                    return asc ? diff : -diff;
                }

                case SortBy.Roll: {
                    const diff = rollA.localeCompare(rollB);
                    return asc ? diff : -diff;
                }

                case SortBy.RegNo: {
                    const regNoA = rollA.slice(2);
                    const regNoB = rollB.slice(2);
                    const diff = regNoA.localeCompare(regNoB);
                    return asc ? diff : -diff;
                }

                case SortBy.Name: {
                    const diff = nameA.localeCompare(nameB);
                    return asc ? diff : -diff;
                }
                default:
                    return 0;
            }
        });

        return {
            results: sorted,
            sortedBy: _sortBy,
            sortOrder: _sortOrder,
        };
    });

    return {
        ...controls,
        filteredResults,
        sortedResults,
    };
}

export type ResultsFilterHook = ReturnType<typeof useResultsFilter>;

export function getValidMultiSelectFilter<T, F>(
    val: string | string[] | undefined,
    enumObj: Record<string, T>,
    fallback: F[],
) {
    if (!val) return fallback as unknown as T[];
    const inpVals = typeof val === "string" ? [val] : val;

    const valid: T[] = [];
    for (const val of Object.values(enumObj)) {
        if (inpVals.includes(val as string)) valid.push(val);
    }

    return valid.length > 0 ? valid : (fallback as unknown as T[]);
}

export function getMultiSelectFilter(val: string | string[] | undefined) {
    if (typeof val === "string") return [val];
    if (Array.isArray(val)) return val;
    return [];
}
