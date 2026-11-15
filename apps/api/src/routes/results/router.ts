import {
	ExportQuerySchema,
	LeaderboardQuerySchema,
	ResultQuerySchema,
	StudentsQuerySchema,
} from "@app/shared/schemas";
import { Hono } from "hono";
import { z } from "zod";
import { getDataVersion } from "~/lib/data-version";
import { invalidRequestResponse } from "~/utils/http";
import { respondJson } from "~/utils/jsonRes";
import { getResultDetailHandler } from "./handlers/detail";
import { createExportCsvStream } from "./handlers/export-csv";
import { getLeaderboardHandler } from "./handlers/leaderboard";
import { listResultsHandler } from "./handlers/list";
import { getMetaHandler } from "./handlers/meta";
import { getStudentsHandler } from "./handlers/students";

export const resultsRouter = new Hono();

resultsRouter.get("/meta", async (c) => {
	const dataVersion = await getDataVersion();
	const etag = `"meta-v${dataVersion}"`;

	if (c.req.header("if-none-match") === etag) {
		return c.body(null, 304);
	}

	const res = await getMetaHandler(dataVersion);

	c.header("ETag", etag);
	c.header("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
	return respondJson(c, res);
});

resultsRouter.get("/results", async (c) => {
	const parseResult = ResultQuerySchema.safeParse(c.req.query());
	if (!parseResult.success) {
		return invalidRequestResponse(c, parseResult.error.issues[0]?.message);
	}

	const dataVersion = await getDataVersion();
	const res = await listResultsHandler(parseResult.data, dataVersion);
	return respondJson(c, res);
});

const RollParamSchema = z.string().min(5).max(30);

resultsRouter.get("/results/:roll", async (c) => {
	const parseResult = RollParamSchema.safeParse(c.req.param("roll"));
	if (!parseResult.success) {
		return invalidRequestResponse(c, "Invalid roll number format");
	}

	const res = await getResultDetailHandler(parseResult.data);
	return respondJson(c, res);
});

resultsRouter.get("/leaderboard", async (c) => {
	const parseResult = LeaderboardQuerySchema.safeParse(c.req.query());
	if (!parseResult.success) {
		return invalidRequestResponse(c, parseResult.error.issues[0]?.message);
	}

	const dataVersion = await getDataVersion();
	const res = await getLeaderboardHandler(parseResult.data, dataVersion);
	return respondJson(c, res);
});

resultsRouter.get("/students", async (c) => {
	const parseResult = StudentsQuerySchema.safeParse(c.req.query());
	if (!parseResult.success) {
		return invalidRequestResponse(c, parseResult.error.issues[0]?.message);
	}

	const res = await getStudentsHandler(parseResult.data);
	return respondJson(c, res);
});

resultsRouter.get("/export.csv", async (c) => {
	const parseResult = ExportQuerySchema.safeParse(c.req.query());
	if (!parseResult.success) {
		return invalidRequestResponse(c, parseResult.error.issues[0]?.message);
	}

	const stream = createExportCsvStream(parseResult.data);

	return new Response(stream, {
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": 'attachment; filename="sbte-results.csv"',
			"Cache-Control": "no-cache",
		},
	});
});
