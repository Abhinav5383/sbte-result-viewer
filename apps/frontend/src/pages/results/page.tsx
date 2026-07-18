import type { ParsedResult } from "@app/shared/types";
import { ResultsFilter } from "~/components/misc/results-filter/component";
import { useResultsFilter } from "~/components/misc/results-filter/hook";
import { useIndexedResults } from "~/lib/hooks/index-results";
import { ResultsListTable } from "./components/results-table";

interface ResultListPageProps {
    studentResultList: ParsedResult[];
}

export function ResultListPage(props: ResultListPageProps) {
    const indexedData = useIndexedResults(props.studentResultList);
    const res = useResultsFilter(props.studentResultList);

    return (
        <div id="results">
            <div class="grid grid-cols-1 xl:grid-cols-[4fr_3fr_2fr_2fr_2fr] gap-x-2.5 gap-y-4 py-4 px-6">
                <ResultsFilter hook={res} indexedData={indexedData()} />
            </div>

            <ResultsListTable
                setSortFilter={res.setSortFilter}
                clearFilters={res.clearFilters}
                anyFilterActive={res.anyFilterActive()}
                sortedResults={res.sortedResults()}
                allResults={props.studentResultList}
                maxStrSizes={indexedData().maxStrSizes}
                showCollegeColumn={!res.college()}
            />
        </div>
    );
}
