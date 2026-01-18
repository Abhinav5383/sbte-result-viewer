export interface ParsedResult {
    student: {
        name: string;
        roll: string;
        branch: BRANCH_NAME;
        college: COLLEGE_NAME;
    };
    grandTotal: {
        maximum: number;
        passing: number;
        obtained: number;
    };
    subjects: SubjectResult[];
    sgpa: number;
    remarks: string;
}

export interface SubjectResult {
    name: string;
    type: PAPER_TYPE;
    credits: number;
    internal: {
        max: number;
        obtained: number;
    };
    external: {
        max: number;
        passing: number;
        obtained: number;
    };
    total: {
        max: number;
        passing: number;
        obtained: number;
    };
    grade: string;
}

export enum PAPER_TYPE {
    THEORY = "THEORY",
    PRACTICAL = "PRACTICAL",
    TERM_WORK = "TERM_WORK",
}

export type BranchConfig = {
    branchName: BRANCH_NAME;
    semester: number;
    collegeCode: number;
    branchCode: number;
    admissionYear: number;
    rollList: number[];
};

export enum COLLEGE_NAME {
    NGP13 = "New Government Polytechnic Patna-13",
    UNKNOWN = "Unknown College",
}

export const COLLEGE_CODES = {
    [COLLEGE_NAME.NGP13]: 121,
};

export enum BRANCH_NAME {
    CIVIL = "Civil",
    CSE = "CSE",
    ELECTRICAL = "Electrical",
    ELECTRONICS = "Electronics",
    MECHANICAL = "Mechanical",
    AUTOMOBILE = "Automobile",
    ECE = "ECE",
    UNKNOWN = "Unknown",
}

export const BRANCH_CODES = {
    [BRANCH_NAME.CIVIL]: 15,
    [BRANCH_NAME.CSE]: 18,
    [BRANCH_NAME.ELECTRICAL]: 20,
    [BRANCH_NAME.ELECTRONICS]: 21,
    [BRANCH_NAME.MECHANICAL]: 25,
    [BRANCH_NAME.AUTOMOBILE]: 33,
    [BRANCH_NAME.ECE]: 38,
};
