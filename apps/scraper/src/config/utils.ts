import { BRANCH_NAME } from "@app/shared/types";
import { numRange } from "~/lib/utils";

export const ROLL_LIST = [...numRange(1, 120), ...numRange(301, 310), ...numRange(351, 360)];

export function generateBranchConfig(
    collegeCode: number,
    semesters = [
        {
            sem: 1,
            admissionYear: 2025,
        },
    ],
) {
    const branches = [];

    for (const semObj of semesters) {
        const semBranches = generateSemesterBranchConfig(
            collegeCode,
            semObj.sem,
            semObj.admissionYear,
        );
        branches.push(...semBranches);
    }

    return branches;
}

function generateSemesterBranchConfig(
    collegeCode: number,
    semester: number,
    admissionYear: number,
) {
    return [
        {
            branchName: BRANCH_NAME.CIVIL,
            semester: semester,
            collegeCode: collegeCode,
            branchCode: 15,
            admissionYear: admissionYear,
            rollList: ROLL_LIST,
        },
        {
            branchName: BRANCH_NAME.CSE,
            semester: semester,
            collegeCode: collegeCode,
            branchCode: 18,
            admissionYear: admissionYear,
            rollList: ROLL_LIST,
        },
        {
            branchName: BRANCH_NAME.ELECTRICAL,
            semester: semester,
            collegeCode: collegeCode,
            branchCode: 20,
            admissionYear: admissionYear,
            rollList: ROLL_LIST,
        },
        {
            branchName: BRANCH_NAME.ELECTRONICS,
            semester: semester,
            collegeCode: collegeCode,
            branchCode: 21,
            admissionYear: admissionYear,
            rollList: ROLL_LIST,
        },
        {
            branchName: BRANCH_NAME.MECHANICAL,
            semester: semester,
            collegeCode: collegeCode,
            branchCode: 25,
            admissionYear: admissionYear,
            rollList: ROLL_LIST,
        },
        {
            branchName: BRANCH_NAME.AUTOMOBILE,
            semester: semester,
            collegeCode: collegeCode,
            branchCode: 33,
            admissionYear: admissionYear,
            rollList: ROLL_LIST,
        },
    ];
}
