import type { EncodedData, EncodedResultT } from "@app/shared/encoder";
import { getVal } from "@app/shared/encoder/helpers";
import { BRANCH_NAME, COLLEGE_NAME } from "@app/shared/types";
import { getBranchFromRoll, getCollegeFromRoll, getSessionFromRoll } from "@app/shared/utils";
import { useSearchParams } from "@solidjs/router";
import { createEffect, createMemo } from "solid-js";
import { getValidEntry } from "~/lib/enum";
import { SearchBy, SortBy, SortOrder } from "~/lib/types";
import { FilterParams, type Filters } from "./types";

const _defaults = {
    searchBy: SearchBy.Name,
    sortBy: SortBy.Marks,
    sortOrder: SortOrder.Descending,
};

export function useResultsFilter(data: EncodedData, defaultOps?: Partial<typeof _defaults>) {
    const DEFAULTS = { ..._defaults, ...defaultOps };
    const [searchParams, _setSearchParams] = useSearchParams();

    const setSearchParams: typeof _setSearchParams = (params, options) => {
        _setSearchParams(params, { replace: true, ...options });
    };

    const searchBy = () => getValidEntry(searchParams[FilterParams.SEARCH_BY], SearchBy, DEFAULTS.searchBy);
    function setSearchBy(newVal: SearchBy) {
        setSearchParams({
            [FilterParams.SEARCH_BY]: newVal === DEFAULTS.searchBy ? null : newVal,
            // reset 'query'
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

    const college = () => getValidEntry(searchParams[FilterParams.COLLEGE], COLLEGE_NAME, "");
    function setCollege(clg: string) {
        setSearchParams({ [FilterParams.COLLEGE]: clg });
    }

    const branch = () => getValidEntry(searchParams[FilterParams.BRANCH], BRANCH_NAME, "");
    function setBranch(br: string) {
        setSearchParams({ [FilterParams.BRANCH]: br });
    }

    const semester = () => {
        const sem = searchParams[FilterParams.SEMESTER];
        if (typeof sem === "string") return sem;
        return "";
    };
    function setSemester(sem: string) {
        setSearchParams({ [FilterParams.SEMESTER]: sem });
    }

    const session = () => {
        const sess = searchParams[FilterParams.SESSION];
        if (typeof sess === "string") return sess;
        return "";
    };
    function setSession(sess: string) {
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

    const filteredResults = createMemo(() => {
        const fullList = data.results;
        const filterValues: Filters = {
            college: college(),
            branch: branch(),
            semester: semester(),
            admissionYear: session(),
        };
        const searchQ = searchQuery().trim();
        const searchMode = searchBy();
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

            if (hasCollegeFilter && COLLEGE_NAME[getCollegeFromRoll(roll)] !== filterValues.college) continue;
            if (hasBranchFilter && BRANCH_NAME[getBranchFromRoll(roll)] !== filterValues.branch) continue;
            if (hasSemesterFilter && roll.charAt(0) !== filterValues.semester) continue;
            if (hasSessionFilter && getSessionFromRoll(roll) !== filterValues.admissionYear) continue;

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
        const _sortBy = sortBy();
        const _sortOrder = sortOrder();

        const asc = _sortOrder === SortOrder.Ascending;

        sorted.sort((a, b) => {
            const rollA = getVal(a, "roll");
            const rollB = getVal(b, "roll");
            const nameA = getVal(a, "name");
            const nameB = getVal(b, "name");

            switch (_sortBy) {
                case SortBy.Roll:
                    if (rollA < rollB) return asc ? -1 : 1;
                    if (rollA > rollB) return asc ? 1 : -1;
                    return 0;
                case SortBy.Name:
                    if (nameA < nameB) return asc ? -1 : 1;
                    if (nameA > nameB) return asc ? 1 : -1;
                    return 0;
                case SortBy.Marks: {
                    const obtainedPercentA =
                        getVal(a, "grandTotalMax") > 0
                            ? getVal(a, "grandTotalObtained") / getVal(a, "grandTotalMax")
                            : 0;

                    const obtainedPercentB =
                        getVal(b, "grandTotalMax") > 0
                            ? getVal(b, "grandTotalObtained") / getVal(b, "grandTotalMax")
                            : 0;

                    return asc ? obtainedPercentA - obtainedPercentB : obtainedPercentB - obtainedPercentA;
                }
                case SortBy.sgpa:
                    return asc ? getVal(a, "sgpa") - getVal(b, "sgpa") : getVal(b, "sgpa") - getVal(a, "sgpa");
                default:
                    return 0;
            }
        });

        // the array is sorted in place, no one wants to clone an array of 50k+ items every time
        // but solid wants the value to "change, so we keep the array the same,
        // but return a brand new object; magic (insert_sparkly_emoji_here)
        return {
            results: sorted,
            sortedBy: _sortBy,
            sortOrder: _sortOrder,
        };
    });

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

        filteredResults,
        sortedResults,

        setQueryInputRef,
    };
}

export type ResultsFilterHook = ReturnType<typeof useResultsFilter>;
