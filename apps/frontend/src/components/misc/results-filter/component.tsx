import SearchIcon from "lucide-solid/icons/search";
import { Select } from "~/components/ui/select";
import { OrdinalSuffix } from "~/components/utils";
import type { IndexedResultsData } from "~/lib/hooks/index-results";
import { SearchBy, SortBy, SortOrder } from "~/lib/types";
import type { ResultsFilterHook } from "./hook";

interface Props {
    hook: ResultsFilterHook;
    indexedData: IndexedResultsData;
    alwaysShowSort?: boolean;
}

export function ResultsFilter(props: Props) {
    const res = props.hook;
    const indexedData = props.indexedData;

    return (
        <>
            <div>
                <label for="searchBy" class="w-fit">
                    Search
                </label>
                <div class="grid gap-y-3 grid-cols-1 xs:grid-cols-[12ch_1fr] gap-0">
                    <Select
                        value={res.searchBy()}
                        onChange={(val) => res.setSearchBy(val as SearchBy)}
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
                            inputMode={res.searchBy() === SearchBy.Roll ? "numeric" : "text"}
                            autocomplete="off"
                            spellcheck={false}
                            enterkeyhint="search"
                            placeholder={`Enter ${res.searchBy()} to search`}
                            class="no-focus-ring xs:rounded-s-none border-2 border-border focus:border-accent-bg w-full"
                            ref={res.setQueryInputRef}
                            onChange={(e) => {
                                res.setSearchQuery(e.currentTarget.value);
                                e.currentTarget.blur();
                            }}
                            onInput={(e) => {
                                if (!e.currentTarget.value) res.setSearchQuery("");
                            }}
                            onBlur={(e) => res.setSearchQuery(e.currentTarget.value)}
                        />

                        <button
                            type="button"
                            class="grid place-content-center absolute rounded-md text-dim-fg transition-all min-h-0 py-0 px-0 aspect-square inset-y-0 inset-e-0 hover:text-accent-fg focus-visible:text-accent-fg"
                        >
                            <SearchIcon />
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <label for="college-filter">College</label>
                <Select
                    id="college-filter"
                    value={res.college()}
                    onChange={res.setCollege}
                    options={[
                        {
                            value: "",
                            label: "All Colleges",
                        },
                        ...indexedData.filters.college.map((college) => ({
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
                    value={res.branch()}
                    onChange={res.setBranch}
                    options={[
                        {
                            value: "",
                            label: "All Branches",
                        },
                        ...indexedData.filters.branch.map((branch) => ({
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
                    value={res.semester()}
                    onChange={res.setSemester}
                    options={[
                        {
                            value: "",
                            label: "All Semesters",
                        },
                        ...indexedData.filters.semester.map((sem) => ({
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
                    value={res.session()}
                    onChange={res.setSession}
                    options={[
                        {
                            value: "",
                            label: "All Sessions",
                        },
                        ...indexedData.filters.admissionYear.map((year) => ({
                            value: year,
                            label: `20${year}`,
                        })),
                    ]}
                />
            </div>

            <div class={props.alwaysShowSort ? "" : "xl:hidden"}>
                <div>
                    <label for="mb-sort">Sort By</label>
                    <div class="grid gap-y-3 grid-cols-1 xs:grid-cols-[3fr_max-content]">
                        <Select
                            id="mb-sort"
                            value={res.sortBy()}
                            onChange={(v) => res.setSortFilter(v as SortBy, res.sortOrder())}
                            options={Object.values(SortBy).map((sortBy) => ({
                                value: sortBy,
                                label: sortBy,
                            }))}
                            class="xs:rounded-e-none"
                        />

                        <Select
                            id="mb-order"
                            value={res.sortOrder()}
                            onChange={(v) => res.setSortFilter(res.sortBy(), v as SortOrder)}
                            options={[
                                { value: SortOrder.Descending, label: SortOrder.Descending },
                                { value: SortOrder.Ascending, label: SortOrder.Ascending },
                            ]}
                            class="xs:rounded-s-none xs:border-s-0"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

function SemesterLabel(sem: string) {
    const suffix = OrdinalSuffix(sem);
    return `${sem}${suffix} Semester`;
}
