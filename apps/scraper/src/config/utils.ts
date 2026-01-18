import { BRANCH_CODES, BRANCH_NAME, type BranchConfig, COLLEGE_CODES } from "@app/shared/types";
import { numRange } from "~/lib/utils";

export const ROLL_LIST = [...numRange(1, 120), ...numRange(301, 310), ...numRange(351, 360)];

const defaultSemesters = [
    { sem: 1, admissionYear: 2025 },
    { sem: 3, admissionYear: 2024 },
    { sem: 5, admissionYear: 2023 },
];

export function getAllCollegeBranches() {
    const allBranches: BranchConfig[] = [];

    for (const collegeCode of Object.values(COLLEGE_CODES)) {
        const collegeBranches = getCollegeBranches(collegeCode, defaultSemesters);
        allBranches.push(...collegeBranches);
    }

    return allBranches;
}

export function getCollegeBranches(collegeCode: number, semesters = defaultSemesters) {
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
            branchName: BRANCH_NAME[branch as keyof typeof BRANCH_NAME],
            semester: semester,
            collegeCode: collegeCode,
            branchCode: branchCode,
            admissionYear: admissionYear,
            rollList: ROLL_LIST,
        });
    }

    return branchConfigs;
}
