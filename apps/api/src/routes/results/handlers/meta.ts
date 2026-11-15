import type { MetaData } from "@app/shared/dto";
import { db } from "~/db/index";
import { type ApiSuccess, okResponseData } from "~/utils/http";

const STATIC_SEMESTERS = [1, 2, 3, 4, 5, 6];

export async function getMetaHandler(dataVersion: number): Promise<ApiSuccess<MetaData>> {
	const [colleges, branches, sessionRows, countRow] = await Promise.all([
		db
			.selectFrom("college")
			.select(["code", "short_name", "full_name"])
			.orderBy("short_name", "asc")
			.execute(),
		db.selectFrom("branch").select(["code", "name"]).orderBy("name", "asc").execute(),
		db.selectFrom("result").select("session").distinct().orderBy("session", "desc").execute(),
		db.selectFrom("result").select(db.fn.countAll().as("count")).executeTakeFirst(),
	]);

	return okResponseData({
		colleges,
		branches,
		semesters: STATIC_SEMESTERS,
		sessions: sessionRows.map((r) => r.session),
		total_results: Number(countRow?.count ?? 0),
		data_version: dataVersion,
	});
}
