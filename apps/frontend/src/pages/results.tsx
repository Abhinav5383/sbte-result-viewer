import type { ParsedResult } from "@app/shared/types";
import { type Setter, Show, createMemo, createSignal, onCleanup } from "solid-js";
import { ResultsListTable } from "~/components/ui/results-table";
import { Select } from "~/components/ui/select";
import { OrdinalSuffix } from "~/components/utils";
import { SearchBy, SortBy, SortOrder } from "~/lib/types";

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

interface ResultListPageProps {
    studentResultList: Record<string, ParsedResult>;
}

export function ResultListPage(props: ResultListPageProps) {
    const [searchBy, setSearchBy] = createSignal(SearchBy.Name);
    // Use debounced signal for search - immediate value for input, debounced for filtering
    const [searchQuery, debouncedSearchQuery, setSearchQuery] = createDebouncedSignal("", 200);
    const [branch, setBranch] = createSignal("");
    const [semester, setSemester] = createSignal("");

    const [sortBy, setSortBy] = createSignal(SortBy.Marks);
    const [sortOrder, setSortOrder] = createSignal(SortOrder.Descending);

    // Compute available options from the full data (not filtered)
    const semesterOptions = createMemo(() => {
        const options = new Set<string>();
        for (const key in props.studentResultList) {
            options.add(props.studentResultList[key].student.roll.charAt(0));
        }
        return Array.from(options).sort();
    });

    const branchOptions = createMemo(() => {
        const options = new Set<string>();
        for (const key in props.studentResultList) {
            options.add(props.studentResultList[key].student.branch);
        }
        return Array.from(options).sort();
    });

    const totalItems = createMemo(() => Object.keys(props.studentResultList).length);

    const filteredResults = createMemo(() => {
        const filtered: ParsedResult[] = [];
        const branchFilter = branch();
        const semesterFilter = semester();
        const searchQ = debouncedSearchQuery().trim();
        const searchMode = searchBy();
        const searchLower = searchQ.toLowerCase();

        for (const key in props.studentResultList) {
            const item = props.studentResultList[key];

            if (branchFilter && item.student.branch !== branchFilter) continue;
            if (semesterFilter && item.student.roll.charAt(0) !== semesterFilter) continue;

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
                branch={branch()}
                setBranch={setBranch}
                semester={semester()}
                setSemester={setSemester}
                semesterOptions={semesterOptions()}
                branchOptions={branchOptions()}
                isFiltering={searchQuery() !== debouncedSearchQuery()}
            />

            <ResultsListTable
                sortBy={sortBy()}
                setSortBy={setSortBy}
                sortOrder={sortOrder()}
                setSortOrder={setSortOrder}
                displayedResults={sortedResults()}
                totalItems={totalItems()}
            />
        </div>
    );
}

interface ControlProps {
    searchBy: SearchBy;
    setSearchBy: Setter<SearchBy>;
    searchQuery: string;
    setSearchQuery: (val: string) => void;

    branch: string;
    setBranch: Setter<string>;
    semester: string;
    setSemester: Setter<string>;

    semesterOptions: string[];
    branchOptions: string[];
    isFiltering?: boolean;
}

function Controls(props: ControlProps) {
    return (
        <div class="grid grid-cols-3 gap-4 py-4 px-6">
            <div class="grid">
                <label for="searchBy" class="w-fit">
                    Search
                </label>
                <div class="grid grid-cols-[2fr_5fr] gap-0">
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
                <label for="branch-filter">Branch</label>
                <Select
                    id="branch-filter"
                    value={props.branch}
                    onChange={(val) => {
                        props.setBranch(val);
                    }}
                    options={[
                        {
                            value: "",
                            label: "All Branches",
                        },
                        ...props.branchOptions.map((branch) => ({
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
                    value={props.semester}
                    onChange={(val) => {
                        props.setSemester(val);
                    }}
                    options={[
                        {
                            value: "",
                            label: "All Semesters",
                        },
                        ...props.semesterOptions.map((sem) => ({
                            value: sem,
                            label: SemesterLabel(sem),
                        })),
                    ]}
                />
            </div>
        </div>
    );
}

function SemesterLabel(sem: string) {
    const suffix = OrdinalSuffix(sem);
    return `${sem}${suffix} Semester`;
}
