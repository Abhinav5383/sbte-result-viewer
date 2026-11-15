import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import { env } from "~/utils/env";
import type { DB } from "./types";

const { Pool } = pg;

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: env.DATABASE_URL,
		max: 10,
		// Enforce read-only at the connection level as a safety net
		// and a 5-second statement timeout to protect the VPS
		options: "-c default_transaction_read_only=on -c statement_timeout=5000",
	}),
});

export const db = new Kysely<DB>({ dialect });
