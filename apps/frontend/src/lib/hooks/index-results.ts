import type { EncodedData } from "@app/shared/encoder";
import { getVal } from "@app/shared/encoder/helpers";
import { branchNamesList, collegeNamesList } from "@app/shared/types";
import { getSessionFromRoll } from "@app/shared/utils";
import { createMemo } from "solid-js";
import type { FilterOptions } from "~/components/misc/results-filter/types";

export function useIndexedResults(data: EncodedData) {
    const indexedData = createMemo(() => {
        const results = data.results;

        const semesters = new Set<string>();
        const admissionYear = new Set<string>();

        for (let i = 0; i < results.length; i++) {
            const item = results[i];
            const roll = getVal(item, "roll");
            const semester = roll.charAt(0);

            semesters.add(semester);
            admissionYear.add(getSessionFromRoll(roll));
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
