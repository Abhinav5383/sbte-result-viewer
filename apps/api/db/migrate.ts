import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
	const client = await pool.connect();
	try {
		await client.query(`
            CREATE TABLE IF NOT EXISTS _migrations (
                id         serial PRIMARY KEY,
                filename   text NOT NULL UNIQUE,
                applied_at timestamptz NOT NULL DEFAULT current_timestamp
            )
        `);

		const migrationsDir = join(import.meta.dir, "migrations");
		const files = (await readdir(migrationsDir)).filter((f) => f.endsWith(".sql")).sort();

		const { rows: applied } = await client.query<{ filename: string }>(
			"SELECT filename FROM _migrations",
		);
		const appliedSet = new Set(applied.map((r) => r.filename));

		const pending = files.filter((f) => !appliedSet.has(f));
		if (pending.length === 0) {
			console.log("No pending migrations");
			return;
		}

		for (const file of pending) {
			const sql = await readFile(join(migrationsDir, file), "utf8");
			console.log(`Applying ${file}...`);
			await client.query("BEGIN");
			try {
				await client.query(sql);
				await client.query("INSERT INTO _migrations (filename) VALUES ($1)", [file]);
				await client.query("COMMIT");
				console.log(`    ${file} applied.`);
			} catch (err) {
				await client.query("ROLLBACK");
				throw err;
			}
		}

		console.log(`\n${pending.length} migration(s) applied.`);
	} finally {
		client.release();
		await pool.end();
	}
}

migrate().catch((err) => {
	console.error("Migration failed:", err);
	process.exit(1);
});
