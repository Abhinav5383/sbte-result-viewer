import type { ParsedResult, SubjectResult } from "../types";
import { getBranchFromRoll, getCollegeFromRoll } from "../utils";
import { getVal, getValSub, mapToArray } from "./helpers";
import { type EncodedResultT, EncodedSubject, type EncodedSubjectT } from "./schema";

export * from "./schema";

export type EncodedData = ReturnType<typeof encodeResults>;

export function encodeResults(results: ParsedResult[]) {
    const encoded: EncodedResultT[] = [];
    const subNames: EncodeDict = {
        strToIdx: new Map(),
        idxToStr: new Map(),
        index: 0,
    };
    const remarksTables: EncodeDict = {
        strToIdx: new Map(),
        idxToStr: new Map(),
        index: 0,
    };

    for (const result of results) {
        let currRemarkId = remarksTables.strToIdx.get(result.remarks);
        if (currRemarkId === undefined) {
            currRemarkId = remarksTables.index;

            remarksTables.strToIdx.set(result.remarks, remarksTables.index);
            remarksTables.idxToStr.set(remarksTables.index, result.remarks);
            remarksTables.index++;
        }

        encoded.push([
            result.student.name,
            result.student.roll,
            result.grandTotal.maximum,
            result.grandTotal.passing,
            result.grandTotal.obtained,
            encodeSubjects(result.subjects, subNames),
            result.sgpa,
            result.cgpa,
            currRemarkId,
        ]);
    }

    return {
        results: encoded,
        subjects: mapToArray(subNames.idxToStr),
        remarks: mapToArray(remarksTables.idxToStr),
    };
}

interface EncodeDict {
    strToIdx: Map<string, number>;
    idxToStr: Map<number, string>;
    index: number;
}

function encodeSubjects(subjects: SubjectResult[], tables: EncodeDict): EncodedSubjectT[] {
    const encoded: EncodedSubjectT[] = [];

    for (const subject of subjects) {
        let currSubId = tables.strToIdx.get(subject.name);
        if (currSubId === undefined) {
            currSubId = tables.index;

            tables.strToIdx.set(subject.name, tables.index);
            tables.idxToStr.set(tables.index, subject.name);
            tables.index++;
        }

        encoded.push([
            currSubId,
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

export function decodeResults(data: EncodedData) {
    const decoded: ParsedResult[] = [];

    for (const res of data.results) {
        const roll = getVal(res, "roll");

        decoded.push({
            student: {
                name: getVal(res, "name"),
                roll: roll,
                branch: getBranchFromRoll(roll),
                college: getCollegeFromRoll(roll),
            },
            grandTotal: {
                maximum: getVal(res, "grandTotalMax"),
                passing: getVal(res, "grandTotalPassing"),
                obtained: getVal(res, "grandTotalObtained"),
            },
            subjects: decodeSubjects(getVal(res, "subjects"), data.subjects),
            sgpa: getVal(res, "sgpa"),
            cgpa: getVal(res, "cgpa"),
            remarks: data.remarks[getVal(res, "remarks")] ?? "Unknown Remark",
        });
    }

    return decoded;
}

export function decodeResult(
    encodedResult: EncodedResultT,
    dicts: { subjects: EncodedData["subjects"]; remarks: EncodedData["remarks"] },
): ParsedResult {
    return decodeResults({
        ...dicts,
        results: [encodedResult],
    })[0];
}

function decodeSubjects(subjects: EncodedSubjectT[], subNames: EncodedData["subjects"]): SubjectResult[] {
    const decoded: SubjectResult[] = [];
    const schema = EncodedSubject;

    for (const sub of subjects) {
        decoded.push({
            name: subNames[getValSub(sub, "name")] ?? "Unknown Subject",
            type: getValSub(sub, "type"),
            credits: getValSub(sub, "credits"),
            internal: {
                max: getValSub(sub, "internalMax"),
                obtained: getValSub(sub, "internalObtained"),
            },
            external: {
                max: getValSub(sub, "externalMax"),
                passing: getValSub(sub, "externalPassing"),
                obtained: getValSub(sub, "externalObtained"),
            },
            total: {
                max: getValSub(sub, "totalMax"),
                passing: getValSub(sub, "totalPassing"),
                obtained: getValSub(sub, "totalObtained"),
            },
            grade: getValSub(sub, "grade"),
        });
    }

    return decoded;
}
