import { db } from "~/db/index";
import { numRange } from "~/lib/utils";
import { CURRENT_EXAM_CONFIG, type ExamConfig } from "./exam";

const SPECIAL_ROLLS = [
	...numRange(301, 310), // Extra spots
	...numRange(351, 360),
	...numRange(601, 610), // Lateral entry students
];

export function buildRollList(totalSeats: number): number[] {
	return [...numRange(1, totalSeats), ...SPECIAL_ROLLS];
}

export interface ScrapeTarget {
	collegeCode: number;
	collegeName: string;
	branchCode: number;
	branchName: string;
	semester: number;
	admissionYear: number;
	getRolls: () => number[];
}

export async function getScrapeTargets(
	examConfig: ExamConfig = CURRENT_EXAM_CONFIG,
): Promise<ScrapeTarget[]> {
	const offerings = await db
		.selectFrom("college_branch as cb")
		.innerJoin("college as c", "c.code", "cb.college_code")
		.innerJoin("branch as b", "b.code", "cb.branch_code")
		.select([
			"c.code as college_code",
			"c.short_name as college_name",
			"b.code as branch_code",
			"b.name as branch_name",
			"cb.seats",
			"cb.extra_seats",
		])
		.orderBy("c.code", "asc")
		.orderBy("b.code", "asc")
		.execute();

	const targets: ScrapeTarget[] = [];

	for (const o of offerings) {
		for (const sem of examConfig.semesters) {
			targets.push({
				collegeCode: o.college_code,
				collegeName: o.college_name,
				branchCode: o.branch_code,
				branchName: o.branch_name,
				semester: sem.semester,
				admissionYear: sem.admissionYear,
				getRolls: () => buildRollList(o.seats + o.extra_seats),
			});
		}
	}

	return targets;
}
