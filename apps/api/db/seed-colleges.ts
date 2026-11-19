import pg from "pg";
import { BRANCHES, COLLEGES } from "./seed-data";

const DRY = process.argv.includes("--dry-run");

const problems: string[] = [];
const branchCodes = new Set<number>();
for (const b of BRANCHES) {
	if (branchCodes.has(b.code)) problems.push(`duplicate branch code ${b.code}`);
	branchCodes.add(b.code);
}
const collegeCodes = new Set<number>();
const shortNames = new Map<string, number>();
for (const c of COLLEGES) {
	if (collegeCodes.has(c.code)) problems.push(`duplicate college code ${c.code}`);
	collegeCodes.add(c.code);

	const clash = shortNames.get(c.shortName);
	if (clash !== undefined)
		problems.push(`colleges ${clash} and ${c.code} share short name "${c.shortName}"`);
	shortNames.set(c.shortName, c.code);

	const seen = new Set<number>();
	for (const b of c.branches) {
		if (!branchCodes.has(b.branch))
			problems.push(`college ${c.code}: unknown branch ${b.branch}`);
		if (seen.has(b.branch)) problems.push(`college ${c.code}: duplicate branch ${b.branch}`);
		seen.add(b.branch);
		if (!(b.seats > 0)) problems.push(`college ${c.code}: branch ${b.branch} has no seats`);
		if ((b.extraSeats ?? 0) < 0)
			problems.push(`college ${c.code}: branch ${b.branch} negative extra seats`);
	}
}
if (problems.length) {
	console.log(`PROBLEMS:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
	process.exit(1);
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();
try {
	const existingBranches = new Set<number>(
		(await client.query("select code from branch")).rows.map((r) => r.code),
	);
	const existingColleges = new Set<number>(
		(await client.query("select code from college")).rows.map((r) => r.code),
	);

	const rows = COLLEGES.flatMap((c) => c.branches.map((b) => ({ college: c.code, ...b })));
	console.log(
		`branches: ${BRANCHES.length} (${BRANCHES.filter((b) => !existingBranches.has(b.code)).length} new)`,
	);
	console.log(
		`colleges: ${COLLEGES.length} (${COLLEGES.filter((c) => !existingColleges.has(c.code)).length} new)`,
	);
	console.log(
		`college_branch rows: ${rows.length}, with extra seats: ${rows.filter((r) => r.extraSeats).length}`,
	);

	if (DRY) {
		console.log("\n(dry run)");
		process.exit(0);
	}

	await client.query("BEGIN");
	for (const b of BRANCHES) {
		await client.query(
			`insert into branch (code, name) values ($1, $2)
			 on conflict (code) do update set name = excluded.name`,
			[b.code, b.name],
		);
	}
	for (const c of COLLEGES) {
		await client.query(
			`insert into college (code, short_name, full_name, type) values ($1, $2, $3, $4)
			 on conflict (code) do update
			 set short_name = excluded.short_name, full_name = excluded.full_name, type = excluded.type`,
			[c.code, c.shortName, c.fullName, c.type],
		);
		await client.query("delete from college_branch where college_code = $1", [c.code]);
	}
	for (const r of rows) {
		await client.query(
			"insert into college_branch (college_code, branch_code, seats, extra_seats) values ($1, $2, $3, $4)",
			[r.college, r.branch, r.seats, r.extraSeats ?? 0],
		);
	}
	await client.query("COMMIT");
	console.log("done");
} catch (e) {
	await client.query("ROLLBACK").catch(() => {});
	throw e;
} finally {
	client.release();
	await pool.end();
}
