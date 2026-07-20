import type { EncodedResultT } from "@app/shared/encoder";
import { getVal } from "@app/shared/encoder/helpers";
import { BRANCH, BRANCH_NAME, COLLEGE, COLLEGE_NAME } from "@app/shared/types";
import { getBranchFromRoll, getCollegeFromRoll, getRegNoFromRoll, getSessionFromRoll } from "@app/shared/utils";

export type PoolStudent = {
    id: string;
    name: string;
    roll: string;
    regNo: string;
    branch: BRANCH;
    college: COLLEGE;
    session: string;
    source: "result" | "custom";
};

export type GeneratedGroup = {
    groupNumber: number;
    students: PoolStudent[];
};

export type DynamicField = {
    key: "branch" | "college" | "session";
    label: string;
};

export function makePoolStudentFromResult(result: EncodedResultT): PoolStudent {
    const roll = getVal(result, "roll");

    return {
        id: roll,
        name: getVal(result, "name"),
        roll,
        regNo: getRegNoFromRoll(roll),
        branch: getBranchFromRoll(roll) ?? BRANCH.UNKNOWN,
        college: getCollegeFromRoll(roll) ?? COLLEGE.UNKNOWN,
        session: `20${getSessionFromRoll(roll)}`,
        source: "result",
    };
}

export function makeCustomPoolStudent(name: string, roll: string): PoolStudent {
    const normalizedRoll = roll.trim();

    return {
        id: normalizedRoll,
        name: name.trim(),
        roll: normalizedRoll,
        regNo: getRegNoFromRoll(normalizedRoll),
        branch: getBranchFromRoll(normalizedRoll) ?? BRANCH.UNKNOWN,
        college: getCollegeFromRoll(normalizedRoll) ?? COLLEGE.UNKNOWN,
        session: `20${getSessionFromRoll(normalizedRoll)}`,
        source: "custom",
    };
}

export function dedupeResultsByRegNo(results: EncodedResultT[]) {
    const seen = new Set<string>();
    const list: EncodedResultT[] = [];

    for (const result of results) {
        const regNo = getRegNoFromRoll(getVal(result, "roll"));
        if (seen.has(regNo)) continue;

        seen.add(regNo);
        list.push(result);
    }

    return list;
}

export function mergeStudents(current: PoolStudent[], incoming: PoolStudent[]) {
    const next = current.slice();
    const seen = new Set(current.map((student) => student.roll));

    for (const student of incoming) {
        if (seen.has(student.roll)) continue;
        seen.add(student.roll);
        next.push(student);
    }

    return next;
}

export function shuffleStudents(students: PoolStudent[]) {
    const shuffled = students.slice();

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

export function getDynamicCsvFields(students: PoolStudent[]): DynamicField[] {
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

function hasVariation<T, K extends keyof T>(items: T[], key: K) {
    if (items.length === 0) return false;

    const values = new Set<T[K]>();
    for (const item of items) {
        values.add(item[key]);
        if (values.size > 1) return true;
    }

    return false;
}
