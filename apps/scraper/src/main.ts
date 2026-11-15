import { CURRENT_EXAM_CONFIG } from "~/config/exam";
import { getScrapeTargets } from "~/config/utils";
import { db } from "~/db/index";
import { bumpDataVersion, loadCaches } from "~/db/upsert";
import { type ScrapeRunStats, scrapeAllBranches } from "~/lib/downloader";

const startedAt = Date.now();
console.log(`[${new Date().toISOString()}] Scraper starting for ${CURRENT_EXAM_CONFIG.name}...`);
console.log(
	`Active semesters: ${CURRENT_EXAM_CONFIG.semesters.map((s) => `sem${s.semester} (admission ${s.admissionYear})`).join(", ")}`,
);

// Fetch real colleges & branches from DB for current exam semesters
const targets = await getScrapeTargets(CURRENT_EXAM_CONFIG);
console.log(`Generated ${targets.length} target branch/semester combinations from DB.`);

// Pre-load remark/subject/student/college/branch caches to avoid per-row DB round trips
await loadCaches();

const stats: ScrapeRunStats = {
	inserted: 0,
	updated: 0,
	skipped: 0,
	invalid: 0,
	errors: 0,
};

await scrapeAllBranches(targets, stats);

// Bump data_version so API clients know cache is stale
const newVersion = await bumpDataVersion();

const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
console.log(
	`
[${new Date().toISOString()}] Scrape complete in ${elapsed}s
  Exam     : ${CURRENT_EXAM_CONFIG.name}
  Inserted : ${stats.inserted}
  Updated  : ${stats.updated}
  Skipped  : ${stats.skipped}
  Invalid  : ${stats.invalid}
  Errors   : ${stats.errors}
  DB version → ${newVersion}
`.trim(),
);

await db.destroy();
