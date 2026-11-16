import type { ParsedResult } from "@app/shared/types";
import {
	getBranchCodeFromRoll,
	getCollegeCodeFromRoll,
	getRegNoFromRoll,
	getSemesterFromRoll,
	getSessionFromRoll,
} from "@app/shared/utils";
import { db } from "./index";

function toHundredths(value: number | null | undefined): number | null {
	if (value == null) return null;
	return Math.round(value * 100);
}

const remarkCache = new Map<string, number>(); // text → id
const subjectCache = new Map<string, number>(); // name → id
const studentCache = new Map<string, number>(); // reg_no → id
const collegeCodeCache = new Set<number>();
const branchCodeCache = new Set<number>();

export async function loadCaches() {
	const [remarks, subjects, students, colleges, branches] = await Promise.all([
		db.selectFrom("remark").select(["id", "text"]).execute(),
		db.selectFrom("subject").select(["id", "name"]).execute(),
		db.selectFrom("student").select(["id", "reg_no"]).execute(),
		db.selectFrom("college").select("code").execute(),
		db.selectFrom("branch").select("code").execute(),
	]);

	for (const r of remarks) remarkCache.set(r.text, r.id);
	for (const s of subjects) subjectCache.set(s.name, s.id);
	for (const s of students) studentCache.set(s.reg_no, s.id);
	for (const c of colleges) collegeCodeCache.add(c.code);
	for (const b of branches) branchCodeCache.add(b.code);

	console.log(
		`Cache loaded: ${remarkCache.size} remarks, ${subjectCache.size} subjects, ${studentCache.size} students, ${collegeCodeCache.size} colleges, ${branchCodeCache.size} branches`,
	);
}

async function getOrCreateRemark(
	text: string,
	trx: typeof db,
	newRemarks: Map<string, number>,
): Promise<number> {
	const cached = remarkCache.get(text) ?? newRemarks.get(text);
	if (cached !== undefined) return cached;

	const { id } = await trx
		.insertInto("remark")
		.values({ text })
		.onConflict((oc) => oc.column("text").doUpdateSet({ text })) // DO UPDATE to get RETURNING on conflict
		.returning("id")
		.executeTakeFirstOrThrow();

	newRemarks.set(text, id);
	return id;
}

async function getOrCreateSubject(
	name: string,
	trx: typeof db,
	newSubjects: Map<string, number>,
): Promise<number> {
	const cached = subjectCache.get(name) ?? newSubjects.get(name);
	if (cached !== undefined) return cached;

	const { id } = await trx
		.insertInto("subject")
		.values({ name })
		.onConflict((oc) => oc.column("name").doUpdateSet({ name }))
		.returning("id")
		.executeTakeFirstOrThrow();

	newSubjects.set(name, id);
	return id;
}

async function getOrCreateStudent(
	regNo: string,
	result: ParsedResult,
	trx: typeof db,
	onNewStudent: (s: { regNo: string; id: number }) => void,
): Promise<number> {
	const cached = studentCache.get(regNo);
	if (cached !== undefined) return cached;

	const roll = result.student.roll;
	const collegeCode = getCollegeCodeFromRoll(roll);
	const branchCode = getBranchCodeFromRoll(roll);

	// On conflict (reg_no already exists): update name in case it changed
	const { id } = await trx
		.insertInto("student")
		.values({
			reg_no: regNo,
			name: result.student.name,
			college_code: collegeCode,
			branch_code: branchCode,
			session: getSessionFromRoll(roll),
		})
		.onConflict((oc) => oc.column("reg_no").doUpdateSet({ name: result.student.name }))
		.returning("id")
		.executeTakeFirstOrThrow();

	onNewStudent({ regNo, id });
	return id;
}

export type UpsertOutcome = "inserted" | "updated" | "skipped";

export async function upsertResult(parsed: ParsedResult): Promise<UpsertOutcome> {
	const roll = parsed.student.roll;
	const regNo = getRegNoFromRoll(roll);
	const collegeCode = getCollegeCodeFromRoll(roll);
	const branchCode = getBranchCodeFromRoll(roll);

	if (!collegeCodeCache.has(collegeCode) || !branchCodeCache.has(branchCode)) {
		return "skipped";
	}

	const semester = getSemesterFromRoll(roll);
	const session = getSessionFromRoll(roll);

	const newRemarks = new Map<string, number>();
	const newSubjects = new Map<string, number>();
	let newStudent: { regNo: string; id: number } | null = null;

	await db.transaction().execute(async (trx) => {
		const remarkId = await getOrCreateRemark(parsed.remarks, trx, newRemarks);
		const studentId = await getOrCreateStudent(regNo, parsed, trx, (s) => {
			newStudent = s;
		});

		const resultRow = await trx
			.insertInto("result")
			.values({
				roll,
				student_id: studentId,
				name: parsed.student.name,
				semester,
				college_code: collegeCode,
				branch_code: branchCode,
				session,
				total_max: parsed.grandTotal.maximum,
				total_passing: parsed.grandTotal.passing,
				total_obtained: parsed.grandTotal.obtained,
				sgpa_x100: toHundredths(parsed.sgpa) ?? 0,
				cgpa_x100: toHundredths(parsed.cgpa),
				remark_id: remarkId,
			})
			.onConflict((oc) =>
				oc.column("roll").doUpdateSet({
					student_id: studentId,
					name: parsed.student.name,
					semester,
					college_code: collegeCode,
					branch_code: branchCode,
					session,
					total_max: parsed.grandTotal.maximum,
					total_passing: parsed.grandTotal.passing,
					total_obtained: parsed.grandTotal.obtained,
					sgpa_x100: toHundredths(parsed.sgpa) ?? 0,
					cgpa_x100: toHundredths(parsed.cgpa),
					remark_id: remarkId,
				}),
			)
			.returning("id")
			.executeTakeFirstOrThrow();

		// Overwrite subject marks for this result (DELETE + INSERT avoids partial updates)
		await trx.deleteFrom("result_subject").where("result_id", "=", resultRow.id).execute();

		for (const sub of parsed.subjects) {
			const subjectId = await getOrCreateSubject(sub.name, trx, newSubjects);

			await trx
				.insertInto("result_subject")
				.values({
					result_id: resultRow.id,
					subject_id: subjectId,
					type: sub.type,
					credits: sub.credits != null && !Number.isNaN(sub.credits) ? sub.credits : null,
					internal_max: sub.internal.max,
					internal_obtained: sub.internal.obtained,
					external_max: sub.external.max,
					external_passing: sub.external.passing,
					external_obtained: sub.external.obtained,
					total_max: sub.total.max,
					total_passing: sub.total.passing,
					total_obtained: sub.total.obtained,
					grade: sub.grade,
				})
				.execute();
		}
	});

	// Only commit to memory cache after the transaction is committed
	for (const [text, id] of newRemarks) remarkCache.set(text, id);
	for (const [name, id] of newSubjects) subjectCache.set(name, id);
	if (newStudent) {
		const s: { regNo: string; id: number } = newStudent;
		studentCache.set(s.regNo, s.id);
	}

	return "inserted" as UpsertOutcome;
}

export async function upsertInvalidRolls(rolls: string[]): Promise<void> {
	if (rolls.length === 0) return;

	await db
		.insertInto("invalid_roll")
		.values(rolls.map((roll) => ({ roll })))
		.onConflict((oc) => oc.column("roll").doNothing())
		.execute();
}

export async function bumpDataVersion(): Promise<number> {
	const res = await db
		.insertInto("data_version")
		.values({ id: 1, version: 1 })
		.onConflict((oc) =>
			oc.column("id").doUpdateSet((eb) => ({
				version: eb("data_version.version", "+", 1),
				updated_at: new Date(),
			})),
		)
		.returning("version")
		.executeTakeFirstOrThrow();

	return Number(res.version);
}
