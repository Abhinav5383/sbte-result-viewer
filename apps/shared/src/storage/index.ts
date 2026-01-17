import { BRANCH_NAME, PAPER_TYPE, ParsedResult, SubjectResult } from "~/types";

export type EncodedResultsDB = Record<string, EncodedResult>;
export function encodeResultsDB(results: Record<string, ParsedResult>): EncodedResultsDB {
    const encoded: EncodedResultsDB = {};
    for (const [roll, data] of Object.entries(results)) {
        encoded[roll] = encodeResultData(data);
    }
    return encoded;
}

export function decodeResultsDB(encoded: EncodedResultsDB): Record<string, ParsedResult> {
    const results: Record<string, ParsedResult> = {};
    for (const [roll, data] of Object.entries(encoded)) {
        results[roll] = decodeResultData(roll, data);
    }
    return results;
}

// Note: roll is used as the key in the object, so not duplicated in the array
type EncodedResult = [
    string, // name
    BRANCH_NAME, // branch
    [number, number, number], // [grandTotalMax, grandTotalPassing, grandTotalObtained]
    EncodedSubject[],
    number, // sgpa
    string, // remarks
];
export function encodeResultData(data: ParsedResult): EncodedResult {
    return [
        data.student.name,
        data.student.branch,
        [data.grandTotal.maximum, data.grandTotal.passing, data.grandTotal.obtained],
        data.subjects.map(encodeSubject),
        data.sgpa,
        data.remarks,
    ];
}

export function decodeResultData(roll: string, arr: EncodedResult): ParsedResult {
    return {
        student: {
            name: arr[0],
            roll,
            branch: arr[1],
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

type EncodedSubject = [
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
