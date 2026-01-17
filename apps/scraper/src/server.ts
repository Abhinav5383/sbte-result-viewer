import type { ParsedResult } from "@app/shared/types";
import { Hono } from "hono";
import config from "./config";
import { parseAllStudentsData } from "./lib/downloader";

async function getParsedResults() {
    const allResults: ParsedResult[] = [];

    for (const branch of config.BRANCHES_LIST) {
        const _res = await parseAllStudentsData(branch);
        for (const item of _res) {
            if (item) allResults.push(item);
        }
    }

    return allResults;
}

const app = new Hono();

app.get("/", (c) => c.text("Scraper is running"));
app.get("/students-data", async (c) => {
    return c.json(await getParsedResults());
});

// Preload parsed results on server start
await getParsedResults();

Bun.serve({
    fetch: app.fetch,
    port: 5500,
});

console.log("Scraper server is running on http://localhost:5500");
