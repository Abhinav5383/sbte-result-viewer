import { db } from "~/db/index";

let cached: { version: number; fetchedAt: number } | null = null;
const TTL_MS = 60 * 60 * 1000; // 1 hour

export async function getDataVersion(): Promise<number> {
	const now = Date.now();
	if (cached && now - cached.fetchedAt < TTL_MS) {
		return cached.version;
	}

	const row = await db
		.selectFrom("data_version")
		.select("version")
		.where("id", "=", 1)
		.executeTakeFirst();

	const version = row ? Number(row.version) : 0;
	cached = { version, fetchedAt: now };
	return version;
}
