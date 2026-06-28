import type { PAPER_TYPE, ParsedResult, SubjectResult } from "./types";
import { getBranchFromRoll, getCollegeFromRoll } from "./utils";

export type EncodedResult = [
    string, // name
    string, // roll
    [number, number, number], // [grandTotalMax, grandTotalPassing, grandTotalObtained]
    EncodedSubject[],
    number, // sgpa
    null | number, // cgpa
    string, // remarks
];

export function encodeResults(results: ParsedResult[]): EncodedResult[] {
    const encoded: EncodedResult[] = [];

    for (const result of results) {
        encoded.push([
            result.student.name,
            result.student.roll,
            [result.grandTotal.maximum, result.grandTotal.passing, result.grandTotal.obtained],
            encodeSubjects(result.subjects),
            result.sgpa,
            result.cgpa,
            result.remarks,
        ]);
    }

    return encoded;
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

function encodeSubjects(subjects: SubjectResult[]): EncodedSubject[] {
    const encoded: EncodedSubject[] = [];

    for (const subject of subjects) {
        encoded.push([
            subject.name,
            subject.type,
            subject.credits,
            [subject.internal.max, subject.internal.obtained],
            [subject.external.max, subject.external.passing, subject.external.obtained],
            [subject.total.max, subject.total.passing, subject.total.obtained],
            subject.grade,
        ]);
    }

    return encoded;
}

// ================ DECODERS ================

export function decodeResults(results: EncodedResult[]) {
    const decoded: ParsedResult[] = [];

    for (const res of results) {
        const roll = res[1];
        decoded.push({
            student: {
                name: res[0],
                roll: roll,
                branch: getBranchFromRoll(roll),
                college: getCollegeFromRoll(roll),
            },
            grandTotal: {
                maximum: res[2][0],
                passing: res[2][1],
                obtained: res[2][2],
            },
            subjects: decodeSubjects(res[3]),
            sgpa: res[4],
            cgpa: res[5],
            remarks: res[6],
        });
    }

    return decoded;
}

function decodeSubjects(subjects: EncodedSubject[]): SubjectResult[] {
    const decoded: SubjectResult[] = [];

    for (const sub of subjects) {
        decoded.push({
            name: sub[0],
            type: sub[1],
            credits: sub[2],
            internal: { max: sub[3][0], obtained: sub[3][1] },
            external: { max: sub[4][0], passing: sub[4][1], obtained: sub[4][2] },
            total: { max: sub[5][0], passing: sub[5][1], obtained: sub[5][2] },
            grade: sub[6],
        });
    }

    return decoded;
}
