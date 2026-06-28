import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { decodeResults, type EncodedResult, encodeResults } from "@app/shared/encoder";
import type { ParsedResult } from "@app/shared/types";
import config from "~/config";
import { tryJsonParse } from "~/lib/utils";

function RESULTS_DB() {
    return `${config.STORE_DIR}/${config.RESULTS_DATABASE}`;
}

export async function getSavedResults(path = RESULTS_DB()): Promise<ParsedResult[]> {
    if (!existsSync(path)) return [];

    const fileContents = (await readFile(path, { encoding: "utf-8" })).toString();
    const encoded = tryJsonParse<EncodedResult[]>(fileContents);
    if (!encoded) return [];

    return decodeResults(encoded);
}

export async function saveResults(results: ParsedResult[], path = RESULTS_DB()) {
    const encoded = encodeResults(results);
    await writeFile(path, JSON.stringify(encoded));
}
