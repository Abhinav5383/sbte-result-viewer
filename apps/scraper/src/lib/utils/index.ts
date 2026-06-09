import type { BranchConfig } from "@app/shared/types";

export function numRange(start: number, end: number) {
    const arr = [];
    for (let i = start; i <= end; i++) {
        arr.push(i);
    }
    return arr;
}

export function formatRollList(rollList: number[], cfg: BranchConfig) {
    return rollList.map((rollNumber) => formatRollNumber(rollNumber, cfg));
}

export function formatRollNumber(roll: number, cfg: BranchConfig) {
    const collegeCode = cfg.collegeCode.toString().padStart(3, "0");
    const branchCode = cfg.branchCode.toString().padStart(2, "0");
    const classRoll = roll.toString().padStart(3, "0");
    const admissionYear = cfg.admissionYear.toString().slice(-2);

    return `${cfg.semester}1${collegeCode}${branchCode}${admissionYear}${classRoll}`;
}

export function tryJsonParse<T>(str: string): T | null {
    try {
        return JSON.parse(str) as T;
    } catch {
        return null;
    }
}
