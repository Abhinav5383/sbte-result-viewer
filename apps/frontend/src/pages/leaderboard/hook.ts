import type { EncodedData } from "@app/shared/encoder";
import { createMemo } from "solid-js";
import { type defaultFilterOptions, useFilterControls } from "~/components/misc/results-filter/hook";
import { filterAndAverageLeaderboard, groupStudentsByRegistration, sortLeaderboardEntries } from "./helpers";
import type { LeaderboardEntry, SortedLeaderboard } from "./types";

export function useLeaderboardFilter(data: EncodedData, defaultOps?: Partial<typeof defaultFilterOptions>) {
    const controls = useFilterControls(defaultOps);

    const allStudents = createMemo(() => {
        return groupStudentsByRegistration(data.results);
    });

    const filteredResults = createMemo<LeaderboardEntry[]>(() => {
        return filterAndAverageLeaderboard(allStudents(), {
            colleges: controls.college(),
            branches: controls.branch(),
            semesters: controls.semester(),
            sessions: controls.session(),
            searchQuery: controls.searchQuery(),
            searchBy: controls.searchBy(),
        });
    });

    const sortedResults = createMemo<SortedLeaderboard>(() => {
        const _sortBy = controls.sortBy();
        const _sortOrder = controls.sortOrder();
        const list = sortLeaderboardEntries(filteredResults(), _sortBy, _sortOrder);

        return {
            results: list,
            sortedBy: _sortBy,
            sortOrder: _sortOrder,
        };
    });

    return {
        ...controls,
        allStudents,
        filteredResults,
        sortedResults,
    };
}

export type LeaderboardFilterHook = ReturnType<typeof useLeaderboardFilter>;
