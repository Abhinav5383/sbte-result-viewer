import type { EncodedData } from "@app/shared/encoder";
import { Show } from "solid-js";
import { ResultsFilter } from "~/components/misc/results-filter/component";
import BouncingDotsLoader from "~/components/ui/loaders/bouncing-dots";
import { useIndexedResults } from "~/lib/hooks/index-results";
import { useResults } from "~/providers/results";
import { LeaderboardTable } from "./components/leaderboard-table";
import { useLeaderboardFilter } from "./hook";

export default function LeaderboardPage() {
    const ctx = useResults();

    return (
        <Show
            when={!ctx.data.loading && !ctx.data.error && ctx.data()}
            fallback={
                <div class="grid place-content-center py-24">
                    <Show when={ctx.data.loading}>
                        <div class="grid items-center justify-items-center gap-12">
                            <BouncingDotsLoader class="w-32 text-dim-fg" />
                            <span class="text-xl italic text-dim-fg font-semibold">Loading results...</span>
                        </div>
                    </Show>

                    <Show when={ctx.data.error}>
                        <div class="grid items-center justify-items-center gap-4">
                            <span class="text-2xl italic text-rose-500 font-semibold">Oops! Something went wrong</span>
                            <span class="text-dim-fg">{ctx.data.error.message}</span>
                        </div>
                    </Show>
                </div>
            }
        >
            {(data) => <LeaderboardContent encodedData={data()} />}
        </Show>
    );
}

function LeaderboardContent(props: { encodedData: EncodedData }) {
    const indexedData = useIndexedResults(props.encodedData);
    const res = useLeaderboardFilter(props.encodedData);

    return (
        <main class="@container grid content-start">
            <div class="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div class="grid gap-1">
                    <h1 class="text-3xl font-bold text-normal-fg">Leaderboard</h1>
                    <p class="text-dim-fg text-sm">Student rankings averaged across all available results.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 @min-desktop:grid-cols-[4fr_3fr_2fr_2fr_2fr] gap-x-2.5 gap-y-4 py-4 px-6">
                <ResultsFilter hook={res} indexedData={indexedData()} />
            </div>

            <LeaderboardTable
                resultsData={props.encodedData}
                sortedResults={res.sortedResults()}
                allStudents={res.allStudents()}
                setSortFilter={res.setSortFilter}
                clearFilters={res.clearFilters}
                anyFilterActive={res.anyFilterActive()}
                maxStrSizes={indexedData().maxStrSizes}
                showCollegeColumn={res.college().length !== 1}
                totalStudents={res.allStudents().length}
            />
        </main>
    );
}
