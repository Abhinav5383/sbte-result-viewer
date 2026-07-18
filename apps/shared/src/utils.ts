import { BRANCH, COLLEGE } from "./types";

export function getCollegeFromRoll(code: string): COLLEGE {
    const collegeCode = Number.parseInt(code.substring(2, 5), 10);

    for (const ccode of Object.values(COLLEGE)) {
        if (ccode === collegeCode) {
            return ccode;
        }
    }

    return COLLEGE.UNKNOWN;
}

export function getBranchFromRoll(code: string): BRANCH {
    const branchCode = Number.parseInt(code.substring(5, 7), 10);

    for (const bcode of Object.values(BRANCH)) {
        if (bcode === branchCode) {
            return bcode;
        }
    }

    return BRANCH.UNKNOWN;
}

export function getSessionFromRoll(code: string): string {
    return code.substring(7, 9);
}

export function getRegNoFromRoll(roll: string) {
    return roll.slice(2);
}
