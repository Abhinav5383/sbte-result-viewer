import tailwindcss from "@tailwindcss/vite";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import solid from "vite-plugin-solid";

export default defineConfig(async (ctx) => ({
	plugins: [tailwindcss(), solid(), viteSingleFile()],
	base: process.env.BASE_PATH,

	resolve: {
		alias: {
			"~": path.resolve(__dirname, "src"),
			"@app/shared": path.resolve(__dirname, "../shared/src"),
		},
	},

	define: {
		__EMBEDDED_RESULTS__: ctx.command === "build" ? await getEmbeddedResults() : undefined,
	},
}));

async function getEmbeddedResults(): Promise<string> {
	const file = (await readFile("./../../generated/saved-results.json")).toString();

	// JSON -> gzip -> base64
	const gzipped = gzipSync(file, { level: 9 });
	const base64 = gzipped.toString("base64");

	console.log(
		`Embedded data: ${(file.length / 1024 / 1024).toFixed(
			2,
		)}MB JSON -> ${(base64.length / 1024 / 1024).toFixed(2)}MB gzipped+base64`,
	);
	
	return JSON.stringify(base64);
}
