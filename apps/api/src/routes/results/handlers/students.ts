import type { StudentRow, StudentsData } from "@app/shared/dto";
import type { StudentsQuery } from "@app/shared/schemas";
import { db } from "~/db/index";
import { type ApiSuccess, okResponseData } from "~/utils/http";

export async function getStudentsHandler(query: StudentsQuery): Promise<ApiSuccess<StudentsData>> {
	let qb = db
		.selectFrom("student")
		.select(["reg_no", "name", "college_code", "branch_code", "session"]);

	if (query.college !== undefined) {
		qb = qb.where("college_code", "=", query.college);
	}
	if (query.branch !== undefined) {
		qb = qb.where("branch_code", "=", query.branch);
	}
	if (query.session !== undefined) {
		qb = qb.where("session", "=", query.session);
	}
	if (query.q) {
		const pattern = `%${query.q}%`;
		qb = qb.where((eb) => eb.or([eb("name", "ilike", pattern), eb("reg_no", "like", pattern)]));
	}

	qb = qb.orderBy("reg_no", "asc");

	const students: StudentRow[] = await qb.execute();
	return okResponseData({ students });
}
