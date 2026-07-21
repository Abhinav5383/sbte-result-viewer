import type { EncodedResultT } from "@app/shared/encoder";
import { getVal } from "@app/shared/encoder/helpers";
import type { ParsedResult } from "@app/shared/types";
import { getBranchFromRoll, getCollegeFromRoll, getRegNoFromRoll, getSessionFromRoll } from "@app/shared/utils";
import type { GeneratedGroup, GroupStudent } from "./types";

export function getUniqueResults(results: EncodedResultT[]) {
    const seen = new Set<string>();
    const unique: EncodedResultT[] = [];

    for (const result of results) {
        const studentId = getStudentId(result);
        if (seen.has(studentId)) continue;

        unique.push(result);
        seen.add(studentId);
    }

    return unique;
}

export function makeGroupStudents(results: EncodedResultT[]): GroupStudent[] {
    const students: GroupStudent[] = [];

    for (const result of results) {
        const roll = getVal(result, "roll");

        students.push({
            id: getStudentId(result),
            name: getVal(result, "name"),
            roll: roll,
        });
    }

    return students;
}

export function mergeResults(current: EncodedResultT[], incoming: EncodedResultT[]) {
    const merged = current.slice();

    const seen = new Set<string>();
    for (const result of current) {
        seen.add(getStudentId(result));
    }

    for (const newResult of incoming) {
        const id = getStudentId(newResult);
        if (seen.has(id)) continue;
        seen.add(id);
        merged.push(newResult);
    }

    return merged;
}

export function generateGroups(students: GroupStudent[], groupSize: number) {
    const groups: GeneratedGroup[] = [];
    const shuffled = shuffleStudents(students);

    for (let i = 0; i < shuffled.length; i += groupSize) {
        groups.push({
            groupId: groups.length + 1,
            students: shuffled.slice(i, i + groupSize),
        });
    }

    return groups;
}

export function shuffleStudents(students: GroupStudent[]) {
    const shuffled = students.slice();

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i];

        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }

    return shuffled;
}

export interface DynamicField {
    key: "branch" | "college" | "session";
    label: string;
}

export function getDynamicCsvFields(students: GroupStudent[]): DynamicField[] {
    const fields: DynamicField[] = [];

    if (hasVariation(students, "branch")) {
        fields.push({
            key: "branch",
            label: "Branch",
        });
    }

    if (hasVariation(students, "college")) {
        fields.push({
            key: "college",
            label: "College",
        });
    }

    if (hasVariation(students, "session")) {
        fields.push({
            key: "session",
            label: "Session",
        });
    }

    return fields;
}

function hasVariation<T extends GroupStudent, K extends DynamicField["key"]>(items: T[], key: K) {
    if (items.length === 0) return false;

    const values = new Set<ReturnType<typeof getDynamicFieldVal<K>>>();
    for (const item of items) {
        values.add(getDynamicFieldVal(item, key));
        if (values.size > 1) return true;
    }

    return false;
}

type _ReturnType<T> = T extends keyof ParsedResult["student"] ? ParsedResult["student"][T] : string;
export function getDynamicFieldVal<T extends DynamicField["key"]>(student: GroupStudent, key: T) {
    switch (key) {
        case "branch":
            return getBranchFromRoll(student.roll) as _ReturnType<T>;

        case "college":
            return getCollegeFromRoll(student.roll) as _ReturnType<T>;

        case "session":
            return getSessionFromRoll(student.roll) as _ReturnType<T>;

        default:
            throw new Error(`Invalid dynamic field key: ${key}`);
    }
}

export function getStudentId(result: EncodedResultT) {
    const roll = getVal(result, "roll");
    return getRegNoFromRoll(roll);
}
