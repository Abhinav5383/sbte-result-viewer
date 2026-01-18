import { BRANCH_CODES, BRANCH_NAME, COLLEGE_CODES, COLLEGE_NAME } from "./types";

export function getCollegeFromCode(code: string): COLLEGE_NAME {
    for (const [name, ccode] of Object.entries(COLLEGE_CODES)) {
        if (ccode.toString() === code) {
            return name as COLLEGE_NAME;
        }
    }

    return COLLEGE_NAME.UNKNOWN;
}

export function getBranchFromCode(code: string): BRANCH_NAME {
    for (const [name, bcode] of Object.entries(BRANCH_CODES)) {
        if (bcode.toString() === code) {
            return name as BRANCH_NAME;
        }
    }

    return BRANCH_NAME.UNKNOWN;
}
