import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import solid from "vite-plugin-solid";
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

async function getEmbeddedResults() {
    const res = await fetch("http://localhost:5500/students-data");
    if (!res.ok) {
        throw new Error(`Failed to fetch embedded results: ${res.status} ${res.statusText}.`);
    }
    const data = (await res.json()) as Record<string, ParsedResult>;
    return JSON.stringify(data);
}
