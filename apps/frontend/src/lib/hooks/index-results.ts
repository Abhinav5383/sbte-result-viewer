import { branchNamesList, collegeNamesList, type ParsedResult } from "@app/shared/types";
import { getSessionFromRoll } from "@app/shared/utils";
import { createMemo } from "solid-js";
import type { FilterOptions } from "~/components/misc/results-filter/types";

export function useIndexedResults(results: ParsedResult[]) {
    const indexedData = createMemo(() => {
        const semesters = new Set<string>();
        const admissionYear = new Set<string>();

        for (let i = 0; i < results.length; i++) {
            const item = results[i];
            const semester = item.student.roll.charAt(0);

            semesters.add(semester);
            admissionYear.add(getSessionFromRoll(item.student.roll));
        }

        let maxBranchLen = 0;
        for (const bName of branchNamesList) {
            if (bName.length > maxBranchLen) {
                maxBranchLen = bName.length;
            }
        }

        return {
            filters: {
                semester: Array.from(semesters).sort(),
                branch: branchNamesList,
                college: collegeNamesList,
                admissionYear: Array.from(admissionYear).sort().reverse(),
            } satisfies FilterOptions,
            maxStrSizes: {
                // name: maxNameLen,
                // college: maxCollegeLen,
                branch: maxBranchLen,
            },
        };
    });

    return indexedData;
}

export type IndexedResultsData = ReturnType<ReturnType<typeof useIndexedResults>>;
