import type { EncodedResultT } from "@app/shared/encoder";
import { getVal } from "@app/shared/encoder/helpers";
import { type BRANCH, BRANCH_NAME, type COLLEGE, COLLEGE_NAME } from "@app/shared/types";
import { getBranchFromRoll, getCollegeFromRoll, getSessionFromRoll } from "@app/shared/utils";
import { SearchBy, SortBy, SortOrder } from "~/lib/types";
import type { LeaderboardEntry, LeaderboardStudent } from "./types";

export function groupStudentsByRegistration(results: EncodedResultT[]): LeaderboardStudent[] {
    const studentMap = new Map<string, LeaderboardStudent>();

    for (let i = 0; i < results.length; i++) {
        const res = results[i];
        const roll = getVal(res, "roll");
        // A result is considered same if the roll is same (the first two digits don't count because that changes each semester/year)
        const id = roll.length > 2 ? roll.slice(2) : roll;

        let student = studentMap.get(id);
        if (!student) {
            student = {
                id,
                results: [],
            };
            studentMap.set(id, student);
        }
        student.results.push(res);
    }

    // Sort each student's results in semester order
    for (const student of studentMap.values()) {
        student.results.sort((a, b) => getVal(a, "roll").localeCompare(getVal(b, "roll")));
    }

    return Array.from(studentMap.values());
}

export function getStudentName(student: LeaderboardStudent): string {
    return getVal(student.results[0], "name");
}

export function getStudentRoll(student: LeaderboardStudent): string {
    return getVal(student.results[0], "roll");
}

export function getStudentCollege(student: LeaderboardStudent): COLLEGE {
    return getCollegeFromRoll(getVal(student.results[0], "roll"));
}

export function getStudentBranch(student: LeaderboardStudent): BRANCH {
    return getBranchFromRoll(getVal(student.results[0], "roll"));
}

export function getStudentSession(student: LeaderboardStudent): string {
    return getSessionFromRoll(getVal(student.results[0], "roll"));
}

export interface FilterOptionsCriteria {
    colleges: string[];
    branches: string[];
    semesters: string[];
    sessions: string[];
    searchQuery: string;
    searchBy: SearchBy;
}

export function filterAndAverageLeaderboard(
    students: LeaderboardStudent[],
    criteria: FilterOptionsCriteria,
): LeaderboardEntry[] {
    const college = criteria.colleges;
    const branch = criteria.branches;
    const sem = criteria.semesters;
    const session = criteria.sessions;
    const query = criteria.searchQuery.trim();
    const searchBy = criteria.searchBy;
    const qLower = query.toLowerCase();

    const hasClg = college.length > 0;
    const hasBranch = branch.length > 0;
    const hasSem = sem.length > 0;
    const hasSession = session.length > 0;
    const hasQuery = query.length > 0;

    const entries: LeaderboardEntry[] = [];

    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const firstRoll = getVal(student.results[0], "roll");

        if (hasClg && !college.includes(COLLEGE_NAME[getCollegeFromRoll(firstRoll)])) continue;
        if (hasBranch && !branch.includes(BRANCH_NAME[getBranchFromRoll(firstRoll)])) continue;
        if (hasSession && !session.includes(getSessionFromRoll(firstRoll))) continue;

        const matchedResults = hasSem
            ? student.results.filter((r) => sem.includes(getVal(r, "roll").charAt(0)))
            : student.results;

        if (matchedResults.length === 0) continue;

        if (hasQuery) {
            if (searchBy === SearchBy.Roll) {
                const matchRoll =
                    student.id.includes(query) || matchedResults.some((r) => getVal(r, "roll").includes(query));
                if (!matchRoll) continue;
            } else {
                const name = getVal(student.results[0], "name");
                if (!name.toLowerCase().includes(qLower)) continue;
            }
        }

        let totalObtained = 0;
        let totalMax = 0;
        let totalSgpa = 0;

        for (let j = 0; j < matchedResults.length; j++) {
            const r = matchedResults[j];
            totalObtained += getVal(r, "grandTotalObtained");
            totalMax += getVal(r, "grandTotalMax");
            totalSgpa += getVal(r, "sgpa");
        }

        const count = matchedResults.length;
        const avgSgpa = count > 0 ? totalSgpa / count : 0;
        const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

        entries.push({
            student,
            matchedResults,
            totalObtained,
            totalMax,
            percentage,
            avgSgpa,
        });
    }

    return entries;
}

export function sortLeaderboardEntries(
    entries: LeaderboardEntry[],
    sortBy: SortBy,
    sortOrder: SortOrder,
): LeaderboardEntry[] {
    const list = entries.slice();
    const asc = sortOrder === SortOrder.Ascending;

    list.sort((a, b) => {
        switch (sortBy) {
            case SortBy.Marks:
                return asc ? a.percentage - b.percentage : b.percentage - a.percentage;
            case SortBy.sgpa:
                return asc ? a.avgSgpa - b.avgSgpa : b.avgSgpa - a.avgSgpa;
            case SortBy.Name: {
                const nameA = getVal(a.student.results[0], "name");
                const nameB = getVal(b.student.results[0], "name");
                return asc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            }
            case SortBy.Roll:
            case SortBy.RegNo:
                return asc ? a.student.id.localeCompare(b.student.id) : b.student.id.localeCompare(a.student.id);
            default:
                return 0;
        }
    });

    return list;
}
