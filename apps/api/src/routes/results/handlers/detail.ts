import type {
	ResultDetail,
	ResultDetailData,
	SemesterSummary,
	StudentInfo,
	SubjectDetail,
} from "@app/shared/dto";
import { db } from "~/db/index";
import { type HandlerResult, notFoundResponseData, okResponseData } from "~/utils/http";

export async function getResultDetailHandler(
	roll: string,
): Promise<HandlerResult<ResultDetailData>> {
	const initialRow = await db
		.selectFrom("result")
		.select(["id", "student_id", "roll", "semester"])
		.where((eb) =>
			eb.or([
				eb("result.roll", "=", roll),
				eb(
					"result.student_id",
					"=",
					eb.selectFrom("student").select("id").where("reg_no", "=", roll).limit(1),
				),
			]),
		)
		.orderBy("result.semester", "desc")
		.executeTakeFirst();

	if (!initialRow) {
		return notFoundResponseData(`No result found for roll: ${roll}`);
	}

	const studentRow = await db
		.selectFrom("student")
		.select(["id", "reg_no", "name", "college_code", "branch_code", "session"])
		.where("student.id", "=", initialRow.student_id)
		.executeTakeFirstOrThrow();

	const resultRows = await db
		.selectFrom("result")
		.innerJoin("remark", "remark.id", "result.remark_id")
		.select([
			"result.id",
			"result.roll",
			"result.name",
			"result.semester",
			"result.college_code",
			"result.branch_code",
			"result.session",
			"result.total_max",
			"result.total_passing",
			"result.total_obtained",
			"result.sgpa_x100",
			"result.cgpa_x100",
			"remark.text as remark",
		])
		.where("result.student_id", "=", initialRow.student_id)
		.orderBy("result.semester", "asc")
		.execute();

	const resultIds = resultRows.map((r) => r.id);
	const subjectRows =
		resultIds.length > 0
			? await db
					.selectFrom("result_subject")
					.innerJoin("subject", "subject.id", "result_subject.subject_id")
					.select([
						"result_subject.result_id",
						"subject.name",
						"result_subject.type",
						"result_subject.credits",
						"result_subject.internal_max",
						"result_subject.internal_obtained",
						"result_subject.external_max",
						"result_subject.external_passing",
						"result_subject.external_obtained",
						"result_subject.total_max",
						"result_subject.total_passing",
						"result_subject.total_obtained",
						"result_subject.grade",
					])
					.where("result_subject.result_id", "in", resultIds)
					.orderBy("result_subject.type", "asc")
					.execute()
			: [];

	const subjectsByResultId = new Map<number, SubjectDetail[]>();
	for (const s of subjectRows) {
		let list = subjectsByResultId.get(s.result_id);
		if (!list) {
			list = [];
			subjectsByResultId.set(s.result_id, list);
		}
		list.push({
			name: s.name,
			type: s.type,
			credits: s.credits,
			internal: { max: s.internal_max, obtained: s.internal_obtained },
			external: {
				max: s.external_max,
				passing: s.external_passing,
				obtained: s.external_obtained,
			},
			total: {
				max: s.total_max,
				passing: s.total_passing,
				obtained: s.total_obtained,
			},
			grade: s.grade,
		});
	}

	const allResults: ResultDetail[] = resultRows.map((r) => ({
		roll: r.roll,
		name: r.name,
		semester: r.semester,
		college_code: r.college_code,
		branch_code: r.branch_code,
		session: r.session,
		total_max: r.total_max,
		total_passing: r.total_passing,
		total_obtained: r.total_obtained,
		sgpa_x100: r.sgpa_x100,
		cgpa_x100: r.cgpa_x100,
		remark: r.remark,
		subjects: subjectsByResultId.get(r.id) ?? [],
	}));

	const primaryResult =
		allResults.find((r) => r.roll === roll) ??
		allResults.find((r) => r.roll === initialRow.roll) ??
		allResults[allResults.length - 1] ??
		allResults[0];

	const semesterSummaries: SemesterSummary[] = allResults.map((r) => ({
		roll: r.roll,
		semester: r.semester,
		total_obtained: r.total_obtained,
		total_max: r.total_max,
		sgpa_x100: r.sgpa_x100,
		cgpa_x100: r.cgpa_x100,
		remark: r.remark,
	}));

	const student: StudentInfo = {
		reg_no: studentRow.reg_no,
		name: studentRow.name,
		college_code: studentRow.college_code,
		branch_code: studentRow.branch_code,
		session: studentRow.session,
		results: semesterSummaries,
	};

	return okResponseData({
		result: primaryResult,
		student,
		results: allResults,
	});
}
