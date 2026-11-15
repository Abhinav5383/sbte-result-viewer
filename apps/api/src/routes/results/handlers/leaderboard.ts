import type { LeaderboardData, LeaderboardRow } from "@app/shared/dto";
import type { LeaderboardQuery } from "@app/shared/schemas";
import { sql } from "kysely";
import { db } from "~/db/index";
import { decodeCursor, encodeCursor } from "~/lib/cursor";
import {
	conflictResponseData,
	type HandlerResult,
	invalidRequestResponseData,
	okResponseData,
} from "~/utils/http";

export async function getLeaderboardHandler(
	query: LeaderboardQuery,
	dataVersion: number,
): Promise<HandlerResult<LeaderboardData>> {
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

	const filterConditions = [];
	if (query.college && query.college.length > 0) {
		filterConditions.push(
			query.college.length === 1
				? sql`s.college_code = ${query.college[0]}`
				: sql`s.college_code IN (${sql.join(query.college)})`,
		);
	}
	if (query.branch && query.branch.length > 0) {
		filterConditions.push(
			query.branch.length === 1
				? sql`s.branch_code = ${query.branch[0]}`
				: sql`s.branch_code IN (${sql.join(query.branch)})`,
		);
	}
	if (query.session && query.session.length > 0) {
		filterConditions.push(
			query.session.length === 1
				? sql`s.session = ${query.session[0]}`
				: sql`s.session IN (${sql.join(query.session)})`,
		);
	}
	if (query.sem && query.sem.length > 0) {
		filterConditions.push(
			query.sem.length === 1
				? sql`r.semester = ${query.sem[0]}`
				: sql`r.semester IN (${sql.join(query.sem)})`,
		);
	}

	const whereClause =
		filterConditions.length > 0 ? sql`WHERE ${sql.join(filterConditions, sql` AND `)}` : sql``;

	let total: number | undefined;
	if (!cursor) {
		const countQuery = sql<{ total: number }>`
            SELECT count(DISTINCT s.id)::int AS total
            FROM student s
            INNER JOIN result r ON r.student_id = s.id
            ${whereClause}
        `;
		const countRes = await countQuery.execute(db);
		total = countRes.rows[0]?.total ?? 0;
	}

	const sortField =
		query.by === "sgpa"
			? "avg_sgpa_x100"
			: query.by === "marks"
				? "avg_obtained"
				: query.by === "cgpa"
					? "cgpa_sort"
					: query.by === "name"
						? "name"
						: "reg_no";

	const sortDir = query.order.toLowerCase() === "asc" ? sql`ASC` : sql`DESC`;
	const cursorOp = query.order.toLowerCase() === "asc" ? sql`>` : sql`<`;

	const cursorCondition = cursor
		? query.by === "reg_no"
			? sql`WHERE reg_no ${cursorOp} ${cursor.tieBreaker}`
			: sql`WHERE (${sql.ref(sortField)}, reg_no) ${cursorOp} (${cursor.sortVal}, ${cursor.tieBreaker})`
		: sql``;

	const limitPlusOne = query.limit + 1;

	const querySql = sql<LeaderboardRow & { cgpa_sort: number }>`
        WITH stats AS (
            SELECT
                s.reg_no,
                s.name,
                s.college_code,
                s.branch_code,
                s.session,
                ROUND(AVG(r.sgpa_x100))::int AS avg_sgpa_x100,
                ROUND(AVG(r.total_obtained))::int AS avg_obtained,
                ROUND(AVG(r.total_max))::int AS avg_max,
                MAX(r.cgpa_x100) AS cgpa_x100,
                COALESCE(MAX(r.cgpa_x100), -1) AS cgpa_sort,
                COUNT(r.id)::int AS semesters_count,
                RANK() OVER (ORDER BY ROUND(AVG(r.sgpa_x100)) DESC, s.reg_no ASC)::int AS rank
            FROM student s
            INNER JOIN result r ON r.student_id = s.id
            ${whereClause}
            GROUP BY s.id, s.reg_no, s.name, s.college_code, s.branch_code, s.session
        )
        SELECT
            reg_no,
            name,
            college_code,
            branch_code,
            session,
            avg_obtained,
            avg_max,
            avg_sgpa_x100,
            cgpa_x100,
            cgpa_sort,
            semesters_count,
            rank
        FROM stats
        ${cursorCondition}
        ORDER BY ${sql.ref(sortField)} ${sortDir}, reg_no ${sortDir}
        LIMIT ${limitPlusOne}
    `;

	const result = await querySql.execute(db);
	const rows = result.rows;

	const hasMore = rows.length > query.limit;
	const pageRows = hasMore ? rows.slice(0, query.limit) : rows;

	let nextCursor: string | undefined;
	if (hasMore && pageRows.length > 0) {
		const lastRow = pageRows[pageRows.length - 1];
		let sortVal: string | number;

		switch (query.by) {
			case "sgpa":
				sortVal = lastRow.avg_sgpa_x100;
				break;
			case "marks":
				sortVal = lastRow.avg_obtained;
				break;
			case "cgpa":
				sortVal = lastRow.cgpa_sort;
				break;
			case "name":
				sortVal = lastRow.name;
				break;
			default:
				sortVal = lastRow.reg_no;
				break;
		}

		nextCursor = encodeCursor(sortVal, lastRow.reg_no, dataVersion);
	}

	const leaderboardResults: LeaderboardRow[] = pageRows.map((r) => ({
		reg_no: r.reg_no,
		name: r.name,
		college_code: r.college_code,
		branch_code: r.branch_code,
		session: r.session,
		avg_obtained: r.avg_obtained,
		avg_max: r.avg_max,
		avg_sgpa_x100: r.avg_sgpa_x100,
		cgpa_x100: r.cgpa_x100,
		semesters_count: r.semesters_count,
		rank: r.rank,
	}));

	return okResponseData({
		results: leaderboardResults,
		...(total !== undefined ? { total } : {}),
		...(nextCursor ? { next_cursor: nextCursor } : {}),
		data_version: dataVersion,
	});
}
