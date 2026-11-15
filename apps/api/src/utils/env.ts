import { z } from "zod";

const EnvSchema = z.object({
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
	PORT: z.coerce.number().int().default(3001),
	CORS_ORIGIN: z.string().default("*"),
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
	console.error(
		"❌ Invalid environment variables:\n",
		JSON.stringify(parsed.error.format(), null, 2),
	);
	throw new Error("Invalid environment configuration");
}

export const env = parsed.data;
