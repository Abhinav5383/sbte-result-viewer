import type { ResultListData, ResultRow } from "@app/shared/dto";
import type { ResultQuery } from "@app/shared/schemas";
import { sql } from "kysely";
import { db } from "~/db/index";
import { decodeCursor, encodeCursor } from "~/lib/cursor";
import {
	conflictResponseData,
	type HandlerResult,
	invalidRequestResponseData,
	okResponseData,
} from "~/utils/http";

export async function listResultsHandler(
	query: ResultQuery,
	dataVersion: number,
): Promise<HandlerResult<ResultListData>> {
	let cursor = null;
	if (query.cursor) {
		cursor = decodeCursor(query.cursor);
		if (!cursor) {
			return invalidRequestResponseData("Invalid cursor format");
		}
		if (cursor.version !== dataVersion) {
			return conflictResponseData("Data version mismatch, please restart pagination");
		}
	}

	let qb = db.selectFrom("result").innerJoin("remark", "remark.id", "result.remark_id");

	if (query.by === "reg_no") {
		qb = qb.innerJoin("student", "student.id", "result.student_id");
	}

	if (query.college && query.college.length > 0) {
		qb =
			query.college.length === 1
				? qb.where("result.college_code", "=", query.college[0])
				: qb.where("result.college_code", "in", query.college);
	}
	if (query.branch && query.branch.length > 0) {
		qb =
			query.branch.length === 1
				? qb.where("result.branch_code", "=", query.branch[0])
				: qb.where("result.branch_code", "in", query.branch);
	}
	if (query.sem && query.sem.length > 0) {
		qb =
			query.sem.length === 1
				? qb.where("result.semester", "=", query.sem[0])
				: qb.where("result.semester", "in", query.sem);
	}
	if (query.session && query.session.length > 0) {
		qb =
			query.session.length === 1
				? qb.where("result.session", "=", query.session[0])
				: qb.where("result.session", "in", query.session);
	}
	if (query.q) {
		const searchPattern = `%${query.q}%`;
		qb = qb.where((eb) =>
			eb.or([
				eb("result.name", "ilike", searchPattern),
				eb("result.roll", "like", searchPattern),
			]),
		);
	}

	let total: number | undefined;
	if (!cursor) {
		const countRes = await qb.select(sql<number>`count(*)::int`.as("total")).executeTakeFirst();
		total = countRes?.total ?? 0;
	}

	const sortColRef =
		query.by === "marks"
			? "result.total_obtained"
			: query.by === "sgpa"
				? "result.sgpa_x100"
				: query.by === "name"
					? "result.name"
					: query.by === "reg_no"
						? "student.reg_no"
						: "result.roll";

	if (cursor) {
		if (query.by === "roll") {
			const op = query.order === "desc" ? sql`<` : sql`>`;
			qb = qb.where(sql<boolean>`result.roll ${op} ${cursor.tieBreaker}`);
		} else {
			const op = query.order === "desc" ? sql`<` : sql`>`;
			qb = qb.where(
				sql<boolean>`(${sql.ref(sortColRef)}, result.roll) ${op} (${cursor.sortVal}, ${cursor.tieBreaker})`,
			);
		}
	}

	if (query.by !== "roll") {
		qb = qb.orderBy(sql.ref(sortColRef), query.order);
	}
	qb = qb.orderBy("result.roll", query.order);
	qb = qb.limit(query.limit + 1);

	const rows = await qb
		.select([
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
			...(query.by === "reg_no" ? [sql<string>`student.reg_no`.as("reg_no")] : []),
		])
		.execute();

	const hasMore = rows.length > query.limit;
	const pageRows = hasMore ? rows.slice(0, query.limit) : rows;

	let nextCursor: string | undefined;
	if (hasMore && pageRows.length > 0) {
		const lastRow = pageRows[pageRows.length - 1];
		let sortVal: string | number;

		switch (query.by) {
			case "marks":
				sortVal = lastRow.total_obtained;
				break;
			case "sgpa":
				sortVal = lastRow.sgpa_x100;
				break;
			case "name":
				sortVal = lastRow.name;
				break;
			case "reg_no":
				sortVal = (lastRow as Record<string, unknown>).reg_no as string;
				break;
			default:
				sortVal = lastRow.roll;
				break;
		}

		nextCursor = encodeCursor(sortVal, lastRow.roll, dataVersion);
	}

	const results: ResultRow[] = pageRows.map((r) => ({
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
	}));

	return okResponseData({
		results,
		...(total !== undefined ? { total } : {}),
		...(nextCursor ? { next_cursor: nextCursor } : {}),
		data_version: dataVersion,
	});
}
