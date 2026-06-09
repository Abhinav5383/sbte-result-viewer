import { PAPER_TYPE, type ParsedResult, type SubjectResult } from "./types";
import { getBranchFromRoll, getCollegeFromRoll } from "./utils";

export type EncodedResult = [
    string, // name
    string, // roll
    [number, number, number], // [grandTotalMax, grandTotalPassing, grandTotalObtained]
    EncodedSubject[],
    number, // sgpa
    string, // remarks
];

export function encodeResult(data: ParsedResult): EncodedResult {
    return [
        data.student.name,
        data.student.roll,
        [data.grandTotal.maximum, data.grandTotal.passing, data.grandTotal.obtained],
        data.subjects.map(encodeSubject),
        data.sgpa,
        data.remarks,
    ];
}

export type EncodedSubject = [
    string, // name
    PAPER_TYPE, // type
    number, // credits
    [number, number], // [internalMax, internalObtained]
    [number, number, number], // [externalMax, externalPassing, externalObtained]
    [number, number, number], // [totalMax, totalPassing, totalObtained]
    string, // grade
];

function encodeSubject(subject: SubjectResult): EncodedSubject {
    return [
        subject.name,
        subject.type,
        subject.credits,
        [subject.internal.max, subject.internal.obtained],
        [subject.external.max, subject.external.passing, subject.external.obtained],
        [subject.total.max, subject.total.passing, subject.total.obtained],
        subject.grade,
    ];
}

export function decodeResult(arr: EncodedResult): ParsedResult {
    const roll = arr[1];
    return {
        student: {
            name: arr[0],
            roll: roll,
            branch: getBranchFromRoll(roll),
            college: getCollegeFromRoll(roll),
        },
        grandTotal: {
            maximum: arr[2][0],
            passing: arr[2][1],
            obtained: arr[2][2],
        },
        subjects: arr[3].map(decodeSubject),
        sgpa: arr[4],
        remarks: arr[5],
    };
}

function decodeSubject(arr: EncodedSubject): SubjectResult {
    return {
        name: arr[0],
        type: arr[1],
        credits: arr[2],
        internal: { max: arr[3][0], obtained: arr[3][1] },
        external: { max: arr[4][0], passing: arr[4][1], obtained: arr[4][2] },
        total: { max: arr[5][0], passing: arr[5][1], obtained: arr[5][2] },
        grade: arr[6],
    };
}
