import { apiUrl } from "@app/shared/consts";
import type { ParsedResult } from "@app/shared/types";
import type { ScrapeTarget } from "~/config/utils";
import { db } from "~/db/index";
import { upsertInvalidRolls, upsertResult } from "~/db/upsert";
import { extractTextFromPdfBuffer } from "~/lib/parser/extract-text";
import { parseTxtToJson } from "~/lib/parser/parse-txt";
import { formatRollList } from "~/lib/utils";

export interface ScrapeRunStats {
	inserted: number;
	updated: number;
	skipped: number;
	invalid: number;
	errors: number;
}

const BATCH_SIZE = 60;

export async function scrapeAllBranches(
	targets: ScrapeTarget[],
	stats: ScrapeRunStats,
): Promise<void> {
	// Load known-invalid rolls and existing result rolls from DB
	const [invalidRollsRows, existingRollsRows] = await Promise.all([
		db.selectFrom("invalid_roll").select("roll").execute(),
		db.selectFrom("result").select("roll").execute(),
	]);

	const invalidRolls = new Set(invalidRollsRows.map((r) => r.roll));
	const existingRolls = new Set(existingRollsRows.map((r) => r.roll));

	for (const target of targets) {
		await scrapeBranch(target, invalidRolls, existingRolls, stats);
	}
}

async function scrapeBranch(
	target: ScrapeTarget,
	invalidRolls: Set<string>,
	existingRolls: Set<string>,
	stats: ScrapeRunStats,
): Promise<void> {
	const allRolls = formatRollList(target.rollList, target);

	// Only fetch rolls we haven't successfully scraped yet
	const toFetch = allRolls.filter((roll) => !invalidRolls.has(roll) && !existingRolls.has(roll));

	if (toFetch.length === 0) return;

	console.log(
		`→ Fetching ${toFetch.length} rolls | ${target.collegeName} | ${target.branchName} sem${target.semester}`,
	);

	const newInvalidRolls: string[] = [];

	for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
		const batch = toFetch.slice(i, i + BATCH_SIZE);

		const results = await Promise.allSettled(batch.map((roll) => fetchAndParse(roll)));

		for (let j = 0; j < batch.length; j++) {
			const roll = batch[j];
			const outcome = results[j];

			if (outcome.status === "rejected") {
				console.error(`  Error fetching ${roll}:`, outcome.reason);
				stats.errors++;
				continue;
			}

			const parsed = outcome.value;

			if (!parsed) {
				newInvalidRolls.push(roll);
				invalidRolls.add(roll);
				stats.invalid++;
				continue;
			}

			try {
				const result = await upsertResult(parsed);
				if (result === "inserted") {
					existingRolls.add(roll);
					stats.inserted++;
				} else if (result === "updated") {
					stats.updated++;
				} else {
					stats.skipped++;
				}
			} catch (err) {
				console.error(`  DB error for ${roll}:`, err);
				stats.errors++;
			}
		}
	}

	// Persist newly discovered invalid rolls in one shot
	await upsertInvalidRolls(newInvalidRolls);

	if (newInvalidRolls.length > 0) {
		console.log(`  ${newInvalidRolls.length} invalid rolls recorded.`);
	}
}

async function fetchAndParse(roll: string): Promise<ParsedResult | null> {
	const pdfBuffer = await fetchResultPdf(roll);
	if (!pdfBuffer) return null;

	const pdfText = await extractTextFromPdfBuffer(pdfBuffer);
	return parseTxtToJson(pdfText) ?? null;
}

async function fetchResultPdf(roll: string, attempt = 0): Promise<ArrayBuffer | null> {
	const res = await fetch(apiUrl(roll), {
		headers: {
			referer: "https://sbteonline.bihar.gov.in/login",
			origin: "https://sbteonline.bihar.gov.in",
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
		},
	});

	// Retry on server errors (5xx) or 429, up to 3 attempts
	if (res.status >= 418 && attempt < 3) {
		if (res.status === 429) {
			console.log("  Rate limited — sleeping 60s...");
			await Bun.sleep(60_000);
		}
		return fetchResultPdf(roll, attempt + 1);
	}

	if (!res.ok) return null;

	console.log(`  Fetched ${roll}`);
	return res.arrayBuffer();
}
