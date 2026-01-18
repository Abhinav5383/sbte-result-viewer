import type { ParsedResult } from "@app/shared/types";
import { type Setter, Show, createMemo, createSignal, onCleanup } from "solid-js";
import { ResultsListTable } from "~/components/ui/results-table";
import { Select } from "~/components/ui/select";
import { OrdinalSuffix } from "~/components/utils";
import { SearchBy, SortBy, SortOrder } from "~/lib/types";

interface ResultListPageProps {
    studentResultList: ParsedResult[];
}

interface Filters {
    college: string;
    branch: string;
    semester: string;
}

type FilterOptions = {
    [K in keyof Filters]: Filters[K][];
};

export function ResultListPage(props: ResultListPageProps) {
    const [searchBy, setSearchBy] = createSignal(SearchBy.Name);

    // Use debounced signal for search - immediate value for input, debounced for filtering
    const [searchQuery, debouncedSearchQuery, setSearchQuery] = createDebouncedSignal("", 200);

    const [filters, setFilters] = createSignal({
        college: "",
        branch: "",
        semester: "",
    });

    const [sortBy, setSortBy] = createSignal(SortBy.Marks);
    const [sortOrder, setSortOrder] = createSignal(SortOrder.Descending);

    const computedValues = createMemo(() => {
        const semesters = new Set<string>();
        const branches = new Set<string>();
        const colleges = new Set<string>();

        let maxNameLen = 0;
        let maxBranchLen = 0;
        let maxCollegeLen = 0;

        for (const item of props.studentResultList) {
            semesters.add(item.student.roll.charAt(0));
            branches.add(item.student.branch);
            colleges.add(item.student.college);

            const nameLength = item.student.name.length;
            if (nameLength > maxNameLen) maxNameLen = nameLength;
            const branchLength = item.student.branch.length;
            if (branchLength > maxBranchLen) maxBranchLen = branchLength;
            const collegeLength = item.student.college.length;
            if (collegeLength > maxCollegeLen) maxCollegeLen = collegeLength;
        }

        return {
            filters: {
                semester: Array.from(semesters).sort(),
                branch: Array.from(branches).sort(),
                college: Array.from(colleges).sort(),
            } satisfies FilterOptions,
            maxStrSizes: {
                name: maxNameLen,
                branch: maxBranchLen,
                college: maxCollegeLen,
            },
        };
    });

    const totalItems = createMemo(() => props.studentResultList.length);

    const filteredResults = createMemo(() => {
        const filtered: ParsedResult[] = [];
        const filterValues = filters();
        const searchQ = debouncedSearchQuery().trim();
        const searchMode = searchBy();
        const searchLower = searchQ.toLowerCase();

        for (const item of props.studentResultList) {
            if (filterValues.college.length && item.student.college !== filterValues.college) {
                continue;
            }
            if (filterValues.branch.length && item.student.branch !== filterValues.branch) {
                continue;
            }
            if (
                filterValues.semester.length &&
                item.student.roll.charAt(0) !== filterValues.semester
            ) {
                continue;
            }

            if (searchQ) {
                if (searchMode === SearchBy.Roll && !item.student.roll.includes(searchQ)) {
                    continue;
                }
                if (
                    searchMode === SearchBy.Name &&
                    !item.student.name.toLowerCase().includes(searchLower)
                ) {
                    continue;
                }
            }

            filtered.push(item);
        }

        return filtered;
    });

    const sortedResults = createMemo(() => {
        const results = [...filteredResults()];

        results.sort((a, b) => {
            switch (sortBy()) {
                case SortBy.Roll:
                    return sortOrder() === SortOrder.Ascending
                        ? a.student.roll.localeCompare(b.student.roll)
                        : b.student.roll.localeCompare(a.student.roll);
                case SortBy.Name:
                    return sortOrder() === SortOrder.Ascending
                        ? a.student.name.localeCompare(b.student.name)
                        : b.student.name.localeCompare(a.student.name);
                case SortBy.Marks:
                    return sortOrder() === SortOrder.Ascending
                        ? a.grandTotal.obtained - b.grandTotal.obtained
                        : b.grandTotal.obtained - a.grandTotal.obtained;
                case SortBy.sgpa:
                    return sortOrder() === SortOrder.Ascending ? a.sgpa - b.sgpa : b.sgpa - a.sgpa;
                default:
                    return 0;
            }
        });

        return results;
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
                filterOptions={computedValues().filters}
                isFiltering={searchQuery() !== debouncedSearchQuery()}
            />

            <ResultsListTable
                sortBy={sortBy()}
                setSortBy={setSortBy}
                sortOrder={sortOrder()}
                setSortOrder={setSortOrder}
                displayedResults={sortedResults()}
                totalItems={totalItems()}
                maxStrSizes={computedValues().maxStrSizes}
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
}

function Controls(props: ControlProps) {
    return (
        <div class="grid grid-cols-1 md:grid-cols-[3fr_3fr_2fr_2fr] gap-4 py-4 px-6">
            <div class="grid">
                <label for="searchBy" class="w-fit">
                    Search
                </label>
                <div class="grid grid-cols-[12ch_1fr] gap-0">
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
                        class="rounded-e-none border-2 border-e min-w-[10ch] border-border focus:border-accent-bg"
                    />

                    <div class="relative">
                        <input
                            id="searchBy"
                            type="text"
                            placeholder={`Enter ${props.searchBy} to search`}
                            class="no-focus-ring rounded-s-none border-s border-2 border-border focus:border-accent-bg w-full"
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
        </div>
    );
}

// Debounce hook for search input
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
