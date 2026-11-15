import { Hono } from "hono";
import { cors } from "hono/cors";
import { resultsRouter } from "~/routes/results/router";
import { env } from "~/utils/env";
import { notFoundResponse, serverErrorResponse } from "~/utils/http";

const app = new Hono();

app.use(cors({ origin: env.CORS_ORIGIN }));

app.get("/", (c) => c.json({ ok: true, message: "sbte-result-viewer API" }));

app.route("/", resultsRouter);

app.onError((error, c) => {
	console.error(`[API Error] ${c.req.method} ${c.req.url}:`, error);
	return serverErrorResponse(c, error.message || "Internal Server Error");
});

app.notFound((c) => {
	return notFoundResponse(c, `Not Found: ${c.req.method} ${c.req.path}`);
});

Bun.serve({ fetch: app.fetch, port: env.PORT });
console.log(`API running on http://localhost:${env.PORT}`);
