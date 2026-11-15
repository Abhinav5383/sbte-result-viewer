import type { DB } from "@app/api/db/types";
import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is not set (needs write role)");
}

export const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: process.env.DATABASE_URL,
			max: 5,
		}),
	}),
});
