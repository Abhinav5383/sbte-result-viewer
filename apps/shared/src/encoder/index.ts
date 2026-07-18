import type { PAPER_TYPE, ParsedResult, SubjectResult } from "../types";
import { getBranchFromRoll, getCollegeFromRoll } from "../utils";
import type { SchemaToTuple } from "./helpers";

export type EncodedResult = SchemaToTuple<typeof EncodedResult>;
export const EncodedResult = {
    name: { loc: 0, _type: 0 as unknown as string },
    roll: { loc: 1, _type: 0 as unknown as string },
    grandTotalMax: { loc: 2, _type: 0 as unknown as number },
    grandTotalPassing: { loc: 3, _type: 0 as unknown as number },
    grandTotalObtained: { loc: 4, _type: 0 as unknown as number },
    subjects: { loc: 5, _type: 0 as unknown as EncodedSubject[] },
    sgpa: { loc: 6, _type: 0 as unknown as number },
    cgpa: { loc: 7, _type: 0 as unknown as null | number },
    remarks: { loc: 8, _type: 0 as unknown as string },
} as const;

export function encodeResults(results: ParsedResult[]): EncodedResult[] {
    const encoded: EncodedResult[] = [];

    for (const result of results) {
        encoded.push([
            result.student.name,
            result.student.roll,
            result.grandTotal.maximum,
            result.grandTotal.passing,
            result.grandTotal.obtained,
            encodeSubjects(result.subjects),
            result.sgpa,
            result.cgpa,
            result.remarks,
        ]);
    }

    return encoded;
}

export type EncodedSubject = SchemaToTuple<typeof EncodedSubject>;
export const EncodedSubject = {
    name: { loc: 0, _type: 0 as unknown as string },
    type: { loc: 1, _type: 0 as unknown as PAPER_TYPE },
    credits: { loc: 2, _type: 0 as unknown as number },

    internalMax: { loc: 3, _type: 0 as unknown as number },
    internalObtained: { loc: 4, _type: 0 as unknown as number },

    externalMax: { loc: 5, _type: 0 as unknown as number },
    externalPassing: { loc: 6, _type: 0 as unknown as number },
    externalObtained: { loc: 7, _type: 0 as unknown as number },

    totalMax: { loc: 8, _type: 0 as unknown as number },
    totalPassing: { loc: 9, _type: 0 as unknown as number },
    totalObtained: { loc: 10, _type: 0 as unknown as number },

    grade: { loc: 11, _type: 0 as unknown as string },
} as const;

export interface SubjectDataDicts {
    subName: Map<number, string>;
    subType: Map<number, PAPER_TYPE>;
}

function encodeSubjects(subjects: SubjectResult[]): EncodedSubject[] {
    const encoded: EncodedSubject[] = [];

    for (const subject of subjects) {
        encoded.push([
            subject.name,
            subject.type,
            subject.credits,

            subject.internal.max,
            subject.internal.obtained,

            subject.external.max,
            subject.external.passing,
            subject.external.obtained,

            subject.total.max,
            subject.total.passing,
            subject.total.obtained,

            subject.grade,
        ]);
    }

    return encoded;
}

// ================ DECODERS ================

export function decodeResults(results: EncodedResult[]) {
    const decoded: ParsedResult[] = [];
    const schema = EncodedResult;

    for (const res of results) {
        const roll = res[schema.roll.loc];
        decoded.push({
            student: {
                name: res[schema.name.loc],
                roll: roll,
                branch: getBranchFromRoll(roll),
                college: getCollegeFromRoll(roll),
            },
            grandTotal: {
                maximum: res[schema.grandTotalMax.loc],
                passing: res[schema.grandTotalPassing.loc],
                obtained: res[schema.grandTotalObtained.loc],
            },
            subjects: decodeSubjects(res[schema.subjects.loc]),
            sgpa: res[schema.sgpa.loc],
            cgpa: res[schema.cgpa.loc],
            remarks: res[schema.remarks.loc],
        });
    }

    return decoded;
}

function decodeSubjects(subjects: EncodedSubject[]): SubjectResult[] {
    const decoded: SubjectResult[] = [];
    const schema = EncodedSubject;

    for (const sub of subjects) {
        decoded.push({
            name: sub[schema.name.loc],
            type: sub[schema.type.loc],
            credits: sub[schema.credits.loc],
            internal: {
                max: sub[schema.internalMax.loc],
                obtained: sub[schema.internalObtained.loc],
            },
            external: {
                max: sub[schema.externalMax.loc],
                passing: sub[schema.externalPassing.loc],
                obtained: sub[schema.externalObtained.loc],
            },
            total: {
                max: sub[schema.totalMax.loc],
                passing: sub[schema.totalPassing.loc],
                obtained: sub[schema.totalObtained.loc],
            },
            grade: sub[schema.grade.loc],
        });
    }

    return decoded;
}
