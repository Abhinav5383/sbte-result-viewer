import { COLLEGE, COLLEGE_NAME } from "@app/shared/types";
import SearchIcon from "lucide-solid/icons/search";
import MultiSelect from "~/components/ui/multi-select";
import { Select } from "~/components/ui/select";
import { OrdinalSuffix } from "~/components/utils";
import type { IndexedResultsData } from "~/lib/hooks/index-results";
import { SearchBy, SortBy, SortOrder } from "~/lib/types";
import type { ResultsFilterHook } from "./hook";
import { FilterParams } from "./types";
import { Button } from "~/components/ui/button";

interface Props {
    hook: ResultsFilterHook;
    indexedData: IndexedResultsData;
    alwaysShowSort?: boolean;
    hideFilters?: FilterParams[];
}

export function ResultsFilter(props: Props) {
    const res = props.hook;
    const indexedData = props.indexedData;

    const collegeOptions = () => {
        const ngp = COLLEGE_NAME[COLLEGE.NGP_PATNA_13];
        const all = indexedData.filters.college
            .filter((c) => c !== ngp)
            .map((college) => ({
                value: college,
                label: college,
            }));

        return [
            {
                value: ngp,
                label: ngp,
            },
            ...all,
        ];
    };

    return (
        <>
            <div hidden={props.hideFilters?.includes(FilterParams.QUERY)}>
                <label for="searchBy" class="w-fit">
                    Search
                </label>
                <div class="grid gap-y-3 grid-cols-1 @min-extra-sm:grid-cols-[12ch_1fr] gap-0">
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
                        class="@min-extra-sm:rounded-e-none @min-extra-sm:border-e-0 min-w-[10ch] border-border focus:border-accent-bg"
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
                            class="no-focus-ring @min-extra-sm:rounded-s-none border-border focus:border-accent-bg w-full"
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

                        <Button
                            variant="primary-alt"
                            size="icon-sm"
                            class="grid place-content-center absolute rounded aspect-square inset-y-1 inset-e-1"
                        >
                            <SearchIcon />
                        </Button>
                    </div>
                </div>
            </div>

            <div hidden={props.hideFilters?.includes(FilterParams.COLLEGE)}>
                <label for="college-filter">College</label>
                <MultiSelect
                    id="college-filter"
                    selected={res.college()}
                    onChange={res.setCollege}
                    options={collegeOptions()}
                    placeholder="All Colleges"
                />
            </div>

            <div hidden={props.hideFilters?.includes(FilterParams.BRANCH)}>
                <label for="branch-filter">Branch</label>
                <MultiSelect
                    id="branch-filter"
                    selected={res.branch()}
                    onChange={res.setBranch}
                    options={indexedData.filters.branch.map((branch) => ({
                        value: branch,
                        label: branch,
                    }))}
                    placeholder="All Branches"
                />
            </div>

            <div hidden={props.hideFilters?.includes(FilterParams.SEMESTER)}>
                <label for="semester-filter">Semester</label>
                <MultiSelect
                    id="semester-filter"
                    selected={res.semester()}
                    onChange={res.setSemester}
                    options={indexedData.filters.semester.map((sem) => ({
                        value: sem,
                        label: SemesterLabel(sem),
                    }))}
                    placeholder="All Semesters"
                />
            </div>

            <div hidden={props.hideFilters?.includes(FilterParams.SESSION)}>
                <label for="session-filter">Session</label>
                <MultiSelect
                    id="session-filter"
                    selected={res.session()}
                    onChange={res.setSession}
                    options={indexedData.filters.admissionYear.map((year) => ({
                        value: year,
                        label: `20${year}`,
                    }))}
                    placeholder="All Sessions"
                />
            </div>

            <div class={props.alwaysShowSort ? "" : "@min-desktop:hidden"}>
                <label for="mb-sort">Sort By</label>
                <div class="grid gap-y-3 grid-cols-1 @min-mobile:grid-cols-[3fr_max-content]">
                    <Select
                        id="mb-sort"
                        value={res.sortBy()}
                        onChange={(v) => res.setSortFilter(v as SortBy, res.sortOrder())}
                        options={Object.values(SortBy).map((sortBy) => ({
                            value: sortBy,
                            label: sortBy,
                        }))}
                        class="@min-mobile:rounded-e-none"
                    />

                    <Select
                        id="mb-order"
                        value={res.sortOrder()}
                        onChange={(v) => res.setSortFilter(res.sortBy(), v as SortOrder)}
                        options={[
                            { value: SortOrder.Descending, label: SortOrder.Descending },
                            { value: SortOrder.Ascending, label: SortOrder.Ascending },
                        ]}
                        class="@min-mobile:rounded-s-none @min-mobile:border-s-0"
                    />
                </div>
            </div>
        </>
    );
}

function SemesterLabel(sem: string) {
    const suffix = OrdinalSuffix(sem);
    return `${sem}${suffix} Semester`;
}
