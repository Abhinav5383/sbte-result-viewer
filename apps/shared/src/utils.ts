import { BRANCH, COLLEGE } from "./types";

export function getCollegeFromRoll(roll: string): COLLEGE {
    const collegeCode = Number.parseInt(getCollegeCodeStrFromRoll(roll), 10);

    for (const ccode of Object.values(COLLEGE)) {
        if (ccode === collegeCode) {
            return ccode;
        }
    }

    return COLLEGE.UNKNOWN;
}

export function getCollegeCodeStrFromRoll(roll: string): string {
    return roll.substring(2, 5);
}

export function getBranchFromRoll(roll: string): BRANCH {
    const branchCode = Number.parseInt(getBranchCodeStrFromRoll(roll), 10);

    for (const bcode of Object.values(BRANCH)) {
        if (bcode === branchCode) {
            return bcode;
        }
    }

    return BRANCH.UNKNOWN;
}

export function getBranchCodeStrFromRoll(roll: string): string {
    return roll.substring(5, 7);
}

export function getSessionFromRoll(roll: string): string {
    return roll.substring(7, 9);
}

export function getRegNoFromRoll(roll: string) {
    return roll.slice(2);
}
