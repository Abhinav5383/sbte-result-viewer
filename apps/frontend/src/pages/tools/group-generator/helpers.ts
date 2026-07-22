import type { EncodedResultT } from "@app/shared/encoder";
import { getVal } from "@app/shared/encoder/helpers";
import {
    getBranchCodeStrFromRoll,
    getCollegeCodeStrFromRoll,
    getRegNoFromRoll,
    getSessionFromRoll,
} from "@app/shared/utils";
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
    const shuffled = shuffleStudents(students);
    const numGroups = Math.ceil(shuffled.length / groupSize);

    const groups: GeneratedGroup[] = [];
    for (let i = 0; i < numGroups; i++) {
        groups.push({
            groupId: i + 1,
            students: [],
        });
    }

    for (let i = 0; i < shuffled.length; i++) {
        groups[i % numGroups].students.push(shuffled[i]);
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
    const branches = new Set<string>();
    const colleges = new Set<string>();
    const sessions = new Set<string>();

    for (const result of students) {
        const roll = result.roll;

        if (branches.size <= 1) {
            branches.add(getBranchCodeStrFromRoll(roll));
        }

        if (colleges.size <= 1) {
            colleges.add(getCollegeCodeStrFromRoll(roll));
        }

        if (sessions.size <= 1) {
            sessions.add(getSessionFromRoll(roll));
        }

        if (branches.size > 1 && colleges.size > 1 && sessions.size > 1) {
            break;
        }
    }

    const fields: DynamicField[] = [];
    if (branches.size > 1) {
        fields.push({
            key: "branch",
            label: "Branch",
        });
    }
    if (colleges.size > 1) {
        fields.push({
            key: "college",
            label: "College",
        });
    }
    if (sessions.size > 1) {
        fields.push({
            key: "session",
            label: "Session",
        });
    }

    return fields;
}

export function getStudentId(result: EncodedResultT) {
    const roll = getVal(result, "roll");
    return getRegNoFromRoll(roll);
}
