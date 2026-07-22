import type { EncodedData } from "@app/shared/encoder";
import { ResultsFilter } from "~/components/misc/results-filter/component";
import { useResultsFilter } from "~/components/misc/results-filter/hook";
import { useIndexedResults } from "~/lib/hooks/index-results";
import { ResultsListTable } from "./components/results-table";

interface ResultListPageProps {
    encodedData: EncodedData;
}

export function ResultListPage(props: ResultListPageProps) {
    const indexedData = useIndexedResults(props.encodedData);
    const res = useResultsFilter(props.encodedData);

    return (
        <div id="results" class="@container">
            <div class="grid grid-cols-1 @min-desktop:grid-cols-[4fr_3fr_2fr_2fr_2fr] gap-x-2.5 gap-y-4 py-4 px-6">
                <ResultsFilter hook={res} indexedData={indexedData()} />
            </div>

            <ResultsListTable
                setSortFilter={res.setSortFilter}
                clearFilters={res.clearFilters}
                anyFilterActive={res.anyFilterActive()}
                sortedResults={res.sortedResults()}
                resultsData={props.encodedData}
                maxStrSizes={indexedData().maxStrSizes}
                showCollegeColumn={!res.college()}
            />
        </div>
    );
}
