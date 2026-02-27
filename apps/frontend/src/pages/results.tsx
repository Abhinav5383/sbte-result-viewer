import { COLLEGE_NAME, type ParsedResult } from "@app/shared/types";
import { type Setter, Show, createMemo, createSignal, onCleanup } from "solid-js";
import { ResultsListTable } from "~/components/ui/results-table";
import { Select } from "~/components/ui/select";
import { OrdinalSuffix } from "~/components/utils";
import { type Filters, SearchBy, SortBy, SortOrder } from "~/lib/types";

interface ResultListPageProps {
    studentResultList: ParsedResult[];
}

type FilterOptions = {
    [K in keyof Filters]: Filters[K][];
};

export function ResultListPage(props: ResultListPageProps) {
    const [searchBy, setSearchBy] = createSignal(SearchBy.Name);
    const [searchQuery, debouncedSearchQuery, setSearchQuery] = createDebouncedSignal("", 200);

    const [filters, setFilters] = createSignal({
        college: COLLEGE_NAME.NGP_PATNA_13 as string,
        branch: "",
        semester: "",
    });

    const [sortBy, setSortBy] = createSignal(SortBy.Marks);
    const [sortOrder, setSortOrder] = createSignal(SortOrder.Descending);

    // pre-index all data once
    const indexedData = createMemo(() => {
        const semesters = new Set<string>();
        const branches = new Set<string>();
        const colleges = new Set<string>();

        // let maxNameLen = 0;
        // let maxCollegeLen = 0;
        let maxBranchLen = 0;

        for (let i = 0; i < props.studentResultList.length; i++) {
            const item = props.studentResultList[i];
            const semester = item.student.roll.charAt(0);

            semesters.add(semester);
            branches.add(item.student.branch);
            colleges.add(item.student.college);

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
        const filterValues = filters();
        const searchQ = debouncedSearchQuery().trim();
        const searchMode = searchBy();
        const searchLower = searchQ.toLowerCase();

        const hasCollegeFilter = filterValues.college.length > 0;
        const hasBranchFilter = filterValues.branch.length > 0;
        const hasSemesterFilter = filterValues.semester.length > 0;
        const hasSearch = searchQ.length > 0;

        // fast path: no filters
        if (!hasCollegeFilter && !hasBranchFilter && !hasSemesterFilter && !hasSearch) {
            return fullList.slice();
        }

        const filtered: ParsedResult[] = [];

        for (const item of fullList) {
            if (hasCollegeFilter && item.student.college !== filterValues.college) continue;
            if (hasBranchFilter && item.student.branch !== filterValues.branch) continue;
            if (hasSemesterFilter && item.student.roll.charAt(0) !== filterValues.semester)
                continue;

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
        const sort = sortBy();
        const order = sortOrder();
        const asc = order === SortOrder.Ascending;

        sorted.sort((a, b) => {
            switch (sort) {
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
                        a.grandTotal.maximum > 0
                            ? a.grandTotal.obtained / a.grandTotal.maximum
                            : 0;
                    const obtainedPercentB =
                        b.grandTotal.maximum > 0
                            ? b.grandTotal.obtained / b.grandTotal.maximum
                            : 0;

                    return asc
                        ? obtainedPercentA - obtainedPercentB
                        : obtainedPercentB - obtainedPercentA;
                }
                case SortBy.sgpa:
                    return asc ? a.sgpa - b.sgpa : b.sgpa - a.sgpa;
                default:
                    return 0;
            }
        });

        // the array is sorted in place, no one wants to clone an array of 50k+ items every time
        // but solid wants the value to "change, so we keep the array is same,
        // but return a brand new object; magic (insert_sparkly_emoji_here)
        return {
            results: sorted,
            sortedBy: sort,
            sortOrder: order,
        };
    });

    return (
        <div>
            <Controls
                searchBy={searchBy()}
                setSearchBy={setSearchBy}
                searchQuery={searchQuery()}
                setSearchQuery={setSearchQuery}
                filters={filters()}
                setFilters={setFilters}
                filterOptions={indexedData().filters}
                isFiltering={searchQuery() !== debouncedSearchQuery()}
                sortBy={sortBy()}
                setSortBy={setSortBy}
                sortOrder={sortOrder()}
                setSortOrder={setSortOrder}
            />

            <ResultsListTable
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
                sortedResults={sortedResults()}
                totalItems={props.studentResultList.length}
                maxStrSizes={indexedData().maxStrSizes}
                filters={filters()}
            />
        </div>
    );
}

interface ControlProps {
    searchBy: SearchBy;
    setSearchBy: Setter<SearchBy>;
    searchQuery: string;
    setSearchQuery: (val: string) => void;

    filters: Filters;
    setFilters: Setter<Filters>;

    filterOptions: FilterOptions;
    isFiltering?: boolean;

    sortBy: SortBy;
    setSortBy: Setter<SortBy>;
    sortOrder: SortOrder;
    setSortOrder: Setter<SortOrder>;
}

function Controls(props: ControlProps) {
    return (
        <div class="grid grid-cols-1 lg:grid-cols-[3fr_3fr_2fr_2fr] gap-4 py-4 px-6">
            <div class="grid">
                <label for="searchBy" class="w-fit">
                    Search
                </label>
                <div class="grid gap-y-3 grid-cols-1 xs:grid-cols-[12ch_1fr] gap-0">
                    <Select
                        value={props.searchBy}
                        onChange={(val) => {
                            props.setSearchBy(val as SearchBy);
                        }}
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
                            placeholder={`Enter ${props.searchBy} to search`}
                            class="no-focus-ring xs:rounded-s-none border-2 border-border focus:border-accent-bg w-full"
                            value={props.searchQuery}
                            onInput={(e) => props.setSearchQuery(e.currentTarget.value)}
                        />
                        <Show when={props.isFiltering}>
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-dim-fg text-xs animate-pulse">
                                ...
                            </span>
                        </Show>
                    </div>
                </div>
            </div>

            <div>
                <label for="college-filter">College</label>
                <Select
                    id="college-filter"
                    value={props.filters.college}
                    onChange={(val) => {
                        props.setFilters((prev) => ({
                            ...prev,
                            college: val,
                        }));
                    }}
                    options={[
                        {
                            value: "",
                            label: "All Colleges",
                        },
                        ...props.filterOptions.college.map((college) => ({
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
                    value={props.filters.branch}
                    onChange={(val) => {
                        props.setFilters((prev) => ({
                            ...prev,
                            branch: val,
                        }));
                    }}
                    options={[
                        {
                            value: "",
                            label: "All Branches",
                        },
                        ...props.filterOptions.branch.map((branch) => ({
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
                    value={props.filters.semester}
                    onChange={(val) => {
                        props.setFilters((prev) => ({
                            ...prev,
                            semester: val,
                        }));
                    }}
                    options={[
                        {
                            value: "",
                            label: "All Semesters",
                        },
                        ...props.filterOptions.semester.map((sem) => ({
                            value: sem,
                            label: SemesterLabel(sem),
                        })),
                    ]}
                />
            </div>

            <div class="lg:hidden">
                <div>
                    <label for="mb-sort">Sort By</label>
                    <div class="grid gap-y-3 grid-cols-1 xs:grid-cols-[3fr_max-content]">
                        <Select
                            id="mb-sort"
                            value={props.sortBy}
                            onChange={(v) => props.setSortBy(v as SortBy)}
                            options={Object.values(SortBy).map((sortBy) => ({
                                value: sortBy,
                                label: sortBy,
                            }))}
                            class="xs:rounded-e-none"
                        />

                        <Select
                            id="mb-order"
                            value={props.sortOrder}
                            onChange={(v) => props.setSortOrder(v as SortOrder)}
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
    );
}

function createDebouncedSignal<T>(initialValue: T, delay = 150) {
    const [value, setValue] = createSignal(initialValue);
    const [debouncedValue, setDebouncedValue] = createSignal(initialValue);
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const setValueDebounced = (newValue: T) => {
        setValue(() => newValue);
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setDebouncedValue(() => newValue), delay);
    };

    onCleanup(() => {
        if (timeoutId) clearTimeout(timeoutId);
    });

    return [value, debouncedValue, setValueDebounced] as const;
}

function SemesterLabel(sem: string) {
    const suffix = OrdinalSuffix(sem);
    return `${sem}${suffix} Semester`;
}
