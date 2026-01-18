import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import solid from "vite-plugin-solid";
import { gzipSync } from "zlib";
import { type EncodedResult, encodeResult } from "../shared/src/encoder";
import type { ParsedResult } from "../shared/src/types";

export default defineConfig(async (ctx) => ({
    plugins: [tailwindcss(), solid(), viteSingleFile()],

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
    const res = await fetch("http://localhost:5500/students-data");
    if (!res.ok) {
        throw new Error(`Failed to fetch embedded results: ${res.status} ${res.statusText}.`);
    }
    const data = (await res.json()) as ParsedResult[];

    // Encode to compact array format
    const encoded: EncodedResult[] = data.map(encodeResult);

    // JSON -> gzip -> base64
    const json = JSON.stringify(encoded);
    const gzipped = gzipSync(json, { level: 9 });
    const base64 = gzipped.toString("base64");

    console.log(
        `Embedded data: ${data.length} results, ${(json.length / 1024 / 1024).toFixed(
            2,
        )}MB JSON -> ${(base64.length / 1024 / 1024).toFixed(2)}MB gzipped+base64`,
    );

    return JSON.stringify(base64);
}
