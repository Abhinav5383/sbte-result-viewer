import type { BRANCH_NAME, COLLEGE_NAME, ParsedResult } from "@app/shared/types";
import { getSessionFromRoll } from "@app/shared/utils";
import { createMemo } from "solid-js";
import type { FilterOptions } from "~/components/misc/results-filter/types";

export function useIndexedResults(results: ParsedResult[]) {
    const indexedData = createMemo(() => {
        const semesters = new Set<string>();
        const branches = new Set<BRANCH_NAME>();
        const colleges = new Set<COLLEGE_NAME>();
        const admissionYear = new Set<string>();

        // let maxNameLen = 0;
        // let maxCollegeLen = 0;
        let maxBranchLen = 0;

        for (let i = 0; i < results.length; i++) {
            const item = results[i];
            const semester = item.student.roll.charAt(0);

            semesters.add(semester);
            branches.add(item.student.branch);
            colleges.add(item.student.college);
            admissionYear.add(getSessionFromRoll(item.student.roll));

            // if (item.student.name.length > maxNameLen) {
            //     maxNameLen = item.student.name.length;
            // }
            // if (item.student.college.length > maxCollegeLen) {
            //     maxCollegeLen = item.student.college.length;
            // }
            if (item.student.branch.length > maxBranchLen) {
                maxBranchLen = item.student.branch.length;
            }
        }

        return {
            filters: {
                semester: Array.from(semesters).sort(),
                branch: Array.from(branches).sort(),
                college: Array.from(colleges).sort(),
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
