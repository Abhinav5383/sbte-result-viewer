import type { CollegeBranchMeta, CollegeType, MetaData } from "@app/shared/dto";
import { db } from "~/db/index";
import { type ApiSuccess, okResponseData } from "~/utils/http";

const STATIC_SEMESTERS = [1, 2, 3, 4, 5, 6];

export async function getMetaHandler(dataVersion: number): Promise<ApiSuccess<MetaData>> {
	const [
		collegeRows,
		collegeBranchRows,
		branchRows,
		pairRows,
		sessionRows,
		countRow,
		studentCountRow,
	] = await Promise.all([
		db
			.selectFrom("college")
			.select(["code", "short_name", "full_name", "type"])
			.orderBy("short_name", "asc")
			.execute(),
		db
			.selectFrom("college_branch")
			.select(["college_code", "branch_code", "seats", "extra_seats"])
			.orderBy("branch_code", "asc")
			.execute(),
		db.selectFrom("branch").select(["code", "name"]).orderBy("name", "asc").execute(),
		db.selectFrom("result").select(["college_code", "branch_code"]).distinct().execute(),
		db.selectFrom("result").select("session").distinct().orderBy("session", "desc").execute(),
		db.selectFrom("result").select(db.fn.countAll().as("count")).executeTakeFirst(),
		db.selectFrom("student").select(db.fn.countAll().as("count")).executeTakeFirst(),
	]);

	const pairsWithData = new Set(pairRows.map((r) => `${r.college_code}:${r.branch_code}`));
	const collegesWithData = new Set(pairRows.map((r) => r.college_code));
	const branchesWithData = new Set(pairRows.map((r) => r.branch_code));

	const branches = branchRows.filter((b) => branchesWithData.has(b.code));

	const branchesByCollege = new Map<number, CollegeBranchMeta[]>();
	for (const row of collegeBranchRows) {
		if (!pairsWithData.has(`${row.college_code}:${row.branch_code}`)) continue;
		const list = branchesByCollege.get(row.college_code) ?? [];
		list.push({ code: row.branch_code, seats: row.seats, extra_seats: row.extra_seats });
		branchesByCollege.set(row.college_code, list);
	}

	const colleges = collegeRows
		.filter((c) => collegesWithData.has(c.code))
		.map((c) => {
			const collegeBranches = branchesByCollege.get(c.code) ?? [];
			return {
				...c,
				type: c.type as CollegeType,
				total_seats: collegeBranches.reduce((sum, b) => sum + b.seats + b.extra_seats, 0),
				branches: collegeBranches,
			};
		});

	return okResponseData({
		colleges,
		branches,
		semesters: STATIC_SEMESTERS,
		sessions: sessionRows.map((r) => r.session),
		total_results: Number(countRow?.count ?? 0),
		total_students: Number(studentCountRow?.count ?? 0),
		data_version: dataVersion,
	});
}
