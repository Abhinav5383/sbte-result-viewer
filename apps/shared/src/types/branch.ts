import type { Enumify } from "./helpers";

export type BranchConfig = {
    branchCode: BRANCH;
    semester: number;
    collegeCode: number;
    admissionYear: number;
    rollList: number[];
};

export type BRANCH = Enumify<typeof BRANCH>;
export const BRANCH = {
    CIVIL: 15,
    CSE: 18,
    ELECTRICAL: 20,
    ELECTRONICS: 21,
    MECHANICAL: 25,
    AUTOMOBILE: 33,
    ECE: 38,
    UNKNOWN: -1,
} as const;

export type BRANCH_NAME = Enumify<typeof BRANCH_NAME>;
export const BRANCH_NAME = {
    [BRANCH.CIVIL]: "Civil",
    [BRANCH.CSE]: "CSE",
    [BRANCH.ELECTRICAL]: "Electrical",
    [BRANCH.ELECTRONICS]: "Electronics",
    [BRANCH.MECHANICAL]: "Mechanical",
    [BRANCH.AUTOMOBILE]: "Automobile",
    [BRANCH.ECE]: "ECE",
    [BRANCH.UNKNOWN]: "Unknown",
} as const satisfies Record<BRANCH, string>;
export const branchNamesList = Object.values(BRANCH_NAME)
    .filter((name) => name !== BRANCH_NAME[BRANCH.UNKNOWN])
    .sort();
