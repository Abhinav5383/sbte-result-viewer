import { BRANCH_CODES, type BRANCH_NAME, type BranchConfig, COLLEGE_CODES } from "@app/shared/types";
import { numRange } from "~/lib/utils";

export const ROLL_LIST = [...numRange(1, 120), ...numRange(301, 310), ...numRange(351, 360)];

const semestersList = [
    // December 2026 exam
    // { sem: 1, admissionYear: 2026 },
    // { sem: 3, admissionYear: 2025 },
    // { sem: 5, admissionYear: 2024 },

    // May 2026 exam
    { sem: 2, admissionYear: 2025 },
    { sem: 4, admissionYear: 2024 },
    { sem: 6, admissionYear: 2023 },

    // December 2025 exam
    { sem: 1, admissionYear: 2025 },
    { sem: 3, admissionYear: 2024 },
    { sem: 5, admissionYear: 2023 },
];

export function getAllCollegeBranches() {
    const allBranches: BranchConfig[] = [];

    for (const collegeCode of Object.values(COLLEGE_CODES)) {
        if (!collegeCode) continue;

        const collegeBranches = getCollegeBranches(collegeCode, semestersList);
        allBranches.push(...collegeBranches);
    }

    return allBranches;
}

export function getCollegeBranches(collegeCode: number, semesters = semestersList) {
    const branches = [];

    for (const semObj of semesters) {
        const semBranches = getBranches_ForSemester(collegeCode, semObj.sem, semObj.admissionYear);
        branches.push(...semBranches);
    }

    return branches;
}

function getBranches_ForSemester(collegeCode: number, semester: number, admissionYear: number) {
    const branchConfigs: BranchConfig[] = [];

    for (const [branch, branchCode] of Object.entries(BRANCH_CODES)) {
        branchConfigs.push({
            branchName: branch as BRANCH_NAME,
            semester: semester,
            collegeCode: collegeCode,
            branchCode: branchCode,
            admissionYear: admissionYear,
            rollList: ROLL_LIST,
        });
    }

    return branchConfigs;
}
