import { Hono } from "hono";
import { cors } from "hono/cors";
import config from "./config";
import { getAllBranchesData } from "./lib/downloader";

console.log("Starting scraper server...");
const parsedData = await getAllBranchesData(config.BRANCHES_LIST);

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
