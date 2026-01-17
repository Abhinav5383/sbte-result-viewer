export type BranchConfig = {
    branchName: BRANCH_NAME;
    semester: number;
    collegeCode: number;
    branchCode: number;
    admissionYear: number;
    rollList: number[];
};

export enum BRANCH_NAME {
    CIVIL = "CIVIL",
    CSE = "CSE",
    ELECTRICAL = "ELECTRICAL",
    ELECTRONICS = "ELECTRONICS",
    MECHANICAL = "MECHANICAL",
    AUTOMOBILE = "AUTOMOBILE",
    UNKNOWN = "-_-",
}

export interface ParsedResult {
    student: {
        name: string;
        roll: string;
        branch: BRANCH_NAME;
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
