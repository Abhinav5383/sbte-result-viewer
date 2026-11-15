import type { LeaderboardData, MetaData, ResultDetailData, ResultListData } from "@app/shared/dto";
import type { ExportQuery, LeaderboardQuery, ResultQuery } from "@app/shared/schemas";
import { buildApiUrl, request } from "./client";

export function fetchMeta(signal?: AbortSignal): Promise<MetaData> {
	return request<MetaData>("/meta", { signal });
}

export function fetchResults(
	query: Partial<ResultQuery>,
	signal?: AbortSignal,
): Promise<ResultListData> {
	return request<ResultListData>("/results", {
		query: query as Record<
			string,
			string | number | boolean | (string | number)[] | undefined | null
		>,
		signal,
	});
}

export function fetchResultDetail(roll: string, signal?: AbortSignal): Promise<ResultDetailData> {
	return request<ResultDetailData>(`/results/${encodeURIComponent(roll)}`, {
		signal,
	});
}

export function fetchLeaderboard(
	query: Partial<LeaderboardQuery>,
	signal?: AbortSignal,
): Promise<LeaderboardData> {
	return request<LeaderboardData>("/leaderboard", {
		query: query as Record<
			string,
			string | number | boolean | (string | number)[] | undefined | null
		>,
		signal,
	});
}

export function getExportCsvUrl(query: Partial<ExportQuery>): string {
	const queryParams: Record<
		string,
		string | number | boolean | (string | number)[] | undefined | null
	> = {
		college: query.college,
		branch: query.branch,
		sem: query.sem,
		session: query.session,
		q: query.q,
	};

	if (query.fields && query.fields.length > 0) {
		queryParams.fields = Array.isArray(query.fields)
			? query.fields.join(",")
			: String(query.fields);
	}

	return buildApiUrl("/export.csv", queryParams);
}
