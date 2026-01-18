import type { ParsedResult } from "@app/shared/types";
import { Hono } from "hono";
import { cors } from "hono/cors";
import config from "./config";
import { parseAllStudentsData } from "./lib/downloader";

async function getParsedResults() {
    const seenRolls = new Set<string>();
    const allResults: ParsedResult[] = [];

    for (const branch of config.BRANCHES_LIST) {
        const _res = await parseAllStudentsData(branch);
        for (const item of _res) {
            if (seenRolls.has(item.student.roll)) continue;

            seenRolls.add(item.student.roll);
            if (item) allResults.push(item);
        }
    }

    return allResults;
}
console.log("Starting scraper server...");
const parsedData = await getParsedResults();

const app = new Hono();

app.use(
    cors({
        origin: "*",
    }),
);

app.get("/", (c) => c.text("Scraper is running"));
app.get("/students-data", (c) => {
    return c.json(parsedData);
});

Bun.serve({
    fetch: app.fetch,
    port: 5500,
});

console.log("Scraper server is running on http://localhost:5500");
