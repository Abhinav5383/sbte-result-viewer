import type { BRANCH } from "./branch";
import type { COLLEGE } from "./college";
import type { PAPER_TYPE } from "./subject";

export * from "./branch";
export * from "./college";
export * from "./subject";

export interface ParsedResult {
    student: {
        name: string;
        roll: string;
        branch: BRANCH;
        college: COLLEGE;
    };
    grandTotal: {
        maximum: number;
        passing: number;
        obtained: number;
    };
    subjects: SubjectResult[];
    sgpa: number;
    /*
     * Only available on 6th sem results
     */
    cgpa: number | null;
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
