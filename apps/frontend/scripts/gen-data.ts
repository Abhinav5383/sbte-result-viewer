import { readFile, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const OUTPUT_FILE = "./src/data/compressed-results.ts";

async function generate() {
    const file = await readFile("./../../generated/saved-results.json");

    // JSON -> gzip -> base64
    const gzipped = gzipSync(file, { level: 9 });
    const base64 = gzipped.toString("base64");

    console.log(
        `Embedded data: ${(file.length / 1024 / 1024).toFixed(
            2,
        )}MB JSON -> ${(base64.length / 1024 / 1024).toFixed(2)}MB gzipped+base64`,
    );

    const script = `const compressedResults = "${base64}";\nexport default compressedResults;`;
    await writeFile(OUTPUT_FILE, script);
}

await generate();
process.exit(0);
