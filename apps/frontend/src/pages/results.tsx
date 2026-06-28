import { BRANCH_NAME, COLLEGE_NAME, type ParsedResult } from "@app/shared/types";
import { getSessionFromRoll } from "@app/shared/utils";
import { useSearchParams } from "@solidjs/router";
import { createMemo, onCleanup } from "solid-js";
import { ResultsListTable } from "~/components/ui/results-table";
import { Select } from "~/components/ui/select";
import { OrdinalSuffix } from "~/components/utils";
import { getValidEntry } from "~/lib/enum";
import { SearchBy, SortBy, SortOrder } from "~/lib/types";

interface Filters {
    college: string;
    branch: string;
    semester: string;
    admissionYear: string;
}

type FilterOptions = {
    [K in keyof Filters]: Filters[K][];
};

interface ResultListPageProps {
    studentResultList: ParsedResult[];
}

enum FilterParams {
    SEARCH_BY = "searchBy",
    QUERY = "query",
    COLLEGE = "college",
    BRANCH = "branch",
    SEMESTER = "sem",
    SESSION = "session",
}

export function ResultListPage(props: ResultListPageProps) {
    const [searchParams, setSearchParams] = useSearchParams();

    const searchBy = () => getValidEntry(searchParams[FilterParams.SEARCH_BY], SearchBy, SearchBy.Name);
    function setSearchBy(newVal: SearchBy) {
        setSearchParams({
            [FilterParams.SEARCH_BY]: newVal === SearchBy.Name ? null : newVal,
            // reset 'query'
            [FilterParams.QUERY]: "",
        });
    }

    const searchQuery = () => {
        const q = searchParams[FilterParams.QUERY];
        if (typeof q === "string") return q;
        return "";
    };
    const setSearchQuery = createDebouncedParamSetter(FilterParams.QUERY);

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

    // ---------- SORTING STUFF ----------------

    const sortBy = () => getValidEntry(searchParams.sortBy, SortBy, SortBy.Marks);
    const sortOrder = () => getValidEntry(searchParams.order, SortOrder, SortOrder.Descending);
    function setSortFilter(by: SortBy, order: SortOrder) {
        setSearchParams({
            sortBy: by === SortBy.Marks ? null : by,
            order: order,
        });
    }

    // pre-index all data once
    const indexedData = createMemo(() => {
        const semesters = new Set<string>();
        const branches = new Set<BRANCH_NAME>();
        const colleges = new Set<COLLEGE_NAME>();
        const admissionYear = new Set<string>();

        // let maxNameLen = 0;
        // let maxCollegeLen = 0;
        let maxBranchLen = 0;

        for (let i = 0; i < props.studentResultList.length; i++) {
            const item = props.studentResultList[i];
            const semester = item.student.roll.charAt(0);

            semesters.add(semester);
            branches.add(item.student.branch);
            colleges.add(item.student.college);
            admissionYear.add(getSessionFromRoll(item.student.roll));

            // if (item.student.name.length > maxNameLen) {
            //     maxNameLen = item.student.name.length;
            // }
            // if (item.student.college.length > maxCollegeLen) {
            //     maxCollegeLen = item.student.college.length;
            // }
            if (item.student.branch.length > maxBranchLen) {
                maxBranchLen = item.student.branch.length;
            }
        }

        return {
            filters: {
                semester: Array.from(semesters).sort(),
                branch: Array.from(branches).sort(),
                college: Array.from(colleges).sort(),
                admissionYear: Array.from(admissionYear).sort().reverse(),
            } satisfies FilterOptions,
            maxStrSizes: {
                // name: maxNameLen,
                // college: maxCollegeLen,
                branch: maxBranchLen,
            },
        };
    });

    const filteredResults = createMemo(() => {
        const fullList = props.studentResultList;
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

        const filtered: ParsedResult[] = [];

        for (const item of fullList) {
            if (hasCollegeFilter && item.student.college !== filterValues.college) continue;
            if (hasBranchFilter && item.student.branch !== filterValues.branch) continue;
            if (hasSemesterFilter && item.student.roll.charAt(0) !== filterValues.semester) continue;
            if (hasSessionFilter && getSessionFromRoll(item.student.roll) !== filterValues.admissionYear) continue;

            if (hasSearch) {
                if (searchMode === SearchBy.Roll) {
                    if (!item.student.roll.includes(searchQ)) continue;
                } else {
                    if (!item.student.name.toLowerCase().includes(searchLower)) continue;
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
            switch (_sortBy) {
                case SortBy.Roll:
                    if (a.student.roll < b.student.roll) return asc ? -1 : 1;
                    if (a.student.roll > b.student.roll) return asc ? 1 : -1;
                    return 0;
                case SortBy.Name:
                    if (a.student.name < b.student.name) return asc ? -1 : 1;
                    if (a.student.name > b.student.name) return asc ? 1 : -1;
                    return 0;
                case SortBy.Marks: {
                    const obtainedPercentA =
                        a.grandTotal.maximum > 0 ? a.grandTotal.obtained / a.grandTotal.maximum : 0;
                    const obtainedPercentB =
                        b.grandTotal.maximum > 0 ? b.grandTotal.obtained / b.grandTotal.maximum : 0;

                    return asc ? obtainedPercentA - obtainedPercentB : obtainedPercentB - obtainedPercentA;
                }
                case SortBy.sgpa:
                    return asc ? a.sgpa - b.sgpa : b.sgpa - a.sgpa;
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

    return (
        <div id="results">
            <div class="grid grid-cols-1 xl:grid-cols-[4fr_3fr_2fr_2fr_2fr] gap-4 py-4 px-6">
                <div>
                    <label for="searchBy" class="w-fit">
                        Search
                    </label>
                    <div class="grid gap-y-3 grid-cols-1 xs:grid-cols-[12ch_1fr] gap-0">
                        <Select
                            value={searchBy()}
                            onChange={(val) => setSearchBy(val as SearchBy)}
                            options={[
                                {
                                    value: SearchBy.Roll,
                                    label: "Roll",
                                },
                                {
                                    value: SearchBy.Name,
                                    label: "Name",
                                },
                            ]}
                            class="xs:rounded-e-none xs:border-e-0 border-2 min-w-[10ch] border-border focus:border-accent-bg"
                        />

                        <div class="relative">
                            <input
                                id="searchBy"
                                type="text"
                                inputMode={searchBy() === SearchBy.Roll ? "numeric" : "text"}
                                autocomplete="off"
                                spellcheck={false}
                                enterkeyhint="search"
                                placeholder={`Enter ${searchBy()} to search`}
                                class="no-focus-ring xs:rounded-s-none border-2 border-border focus:border-accent-bg w-full"
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label for="college-filter">College</label>
                    <Select
                        id="college-filter"
                        value={college()}
                        onChange={setCollege}
                        options={[
                            {
                                value: "",
                                label: "All Colleges",
                            },
                            ...indexedData().filters.college.map((college) => ({
                                value: college,
                                label: college,
                            })),
                        ]}
                    />
                </div>

                <div>
                    <label for="branch-filter">Branch</label>
                    <Select
                        id="branch-filter"
                        value={branch()}
                        onChange={setBranch}
                        options={[
                            {
                                value: "",
                                label: "All Branches",
                            },
                            ...indexedData().filters.branch.map((branch) => ({
                                value: branch,
                                label: branch,
                            })),
                        ]}
                    />
                </div>

                <div>
                    <label for="semester-filter">Semester</label>
                    <Select
                        id="semester-filter"
                        value={semester()}
                        onChange={setSemester}
                        options={[
                            {
                                value: "",
                                label: "All Semesters",
                            },
                            ...indexedData().filters.semester.map((sem) => ({
                                value: sem,
                                label: SemesterLabel(sem),
                            })),
                        ]}
                    />
                </div>

                <div>
                    <label for="session-filter">Session</label>
                    <Select
                        id="session-filter"
                        value={session()}
                        onChange={setSession}
                        options={[
                            {
                                value: "",
                                label: "All Sessions",
                            },
                            ...indexedData().filters.admissionYear.map((year) => ({
                                value: year,
                                label: `20${year}`,
                            })),
                        ]}
                    />
                </div>

                <div class="xl:hidden">
                    <div>
                        <label for="mb-sort">Sort By</label>
                        <div class="grid gap-y-3 grid-cols-1 xs:grid-cols-[3fr_max-content]">
                            <Select
                                id="mb-sort"
                                value={sortBy()}
                                onChange={(v) => setSortFilter(v as SortBy, sortOrder())}
                                options={Object.values(SortBy).map((sortBy) => ({
                                    value: sortBy,
                                    label: sortBy,
                                }))}
                                class="xs:rounded-e-none"
                            />

                            <Select
                                id="mb-order"
                                value={sortOrder()}
                                onChange={(v) => setSortFilter(sortBy(), v as SortOrder)}
                                options={[
                                    { value: SortOrder.Descending, label: SortOrder.Descending },
                                    { value: SortOrder.Ascending, label: SortOrder.Ascending },
                                ]}
                                class="xs:rounded-s-none xs:border-s-0"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ResultsListTable
                setSortFilter={setSortFilter}
                clearFilters={clearFilters}
                anyFilterActive={anyFilterActive()}
                sortedResults={sortedResults()}
                totalItems={props.studentResultList.length}
                maxStrSizes={indexedData().maxStrSizes}
                showCollegeColumn={!college()}
            />
        </div>
    );
}

function createDebouncedParamSetter(key: string, delay = 200) {
    const [_, setSearchParams] = useSearchParams();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const setParam = (newValue: string) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            setSearchParams({ [key]: newValue });
        }, delay);
    };

    onCleanup(() => {
        if (timeoutId) clearTimeout(timeoutId);
    });

    return setParam;
}

function SemesterLabel(sem: string) {
    const suffix = OrdinalSuffix(sem);
    return `${sem}${suffix} Semester`;
}
