import { decodeResultsDB, encodeResultsDB } from "@app/shared/storage";
import type { ParsedResult } from "@app/shared/types";
import config from "~/config";
import { tryJsonParse } from "~/lib/utils";

type SavedResults = Record<string, ParsedResult>;

export async function getSavedResults(): Promise<SavedResults> {
    const file = Bun.file(`${config.STORE_DIR}/${config.RESULTS_DATABASE}`);
    if (!(await file.exists())) return {};

    const encoded = tryJsonParse<ReturnType<typeof encodeResultsDB>>(await file.text());
    if (!encoded) return {};

    return decodeResultsDB(encoded);
}

export async function saveResults(results: SavedResults) {
    const file = Bun.file(`${config.STORE_DIR}/${config.RESULTS_DATABASE}`);

    const encoded = encodeResultsDB(results);
    await file.write(JSON.stringify(encoded));
}
