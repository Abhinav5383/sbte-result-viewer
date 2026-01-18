import { BRANCH_CODES, BRANCH_NAME, COLLEGE_CODES, COLLEGE_NAME } from "./types";

export function getCollegeFromRoll(code: string): COLLEGE_NAME {
    const collegeCode = code.substring(2, 5);

    for (const [name, ccode] of Object.entries(COLLEGE_CODES)) {
        if (ccode.toString() === collegeCode) {
            return name as COLLEGE_NAME;
        }
    }

    return COLLEGE_NAME.UNKNOWN;
}

export function getBranchFromRoll(code: string): BRANCH_NAME {
    const branchCode = code.substring(5, 7);

    for (const [name, bcode] of Object.entries(BRANCH_CODES)) {
        if (bcode.toString() === branchCode) {
            return name as BRANCH_NAME;
        }
    }

    return BRANCH_NAME.UNKNOWN;
}
