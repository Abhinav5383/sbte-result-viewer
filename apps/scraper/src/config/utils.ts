import { db } from "~/db/index";
import { numRange } from "~/lib/utils";
import { CURRENT_EXAM_CONFIG, type ExamConfig } from "./exam";

export const ROLL_LIST = [
	...numRange(1, 120),
	...numRange(301, 310),
	...numRange(351, 360),
	...numRange(601, 610),
];

export interface ScrapeTarget {
	collegeCode: number;
	collegeName: string;
	branchCode: number;
	branchName: string;
	semester: number;
	admissionYear: number;
	rollList: number[];
}

export async function getScrapeTargets(
	examConfig: ExamConfig = CURRENT_EXAM_CONFIG,
): Promise<ScrapeTarget[]> {
	const [colleges, branches] = await Promise.all([
		db.selectFrom("college").select(["code", "short_name"]).orderBy("code", "asc").execute(),
		db.selectFrom("branch").select(["code", "name"]).orderBy("code", "asc").execute(),
	]);

	const targets: ScrapeTarget[] = [];

	for (const college of colleges) {
		for (const branch of branches) {
			for (const sem of examConfig.semesters) {
				targets.push({
					collegeCode: college.code,
					collegeName: college.short_name,
					branchCode: branch.code,
					branchName: branch.name,
					semester: sem.semester,
					admissionYear: sem.admissionYear,
					rollList: ROLL_LIST,
				});
			}
		}
	}

	return targets;
}
