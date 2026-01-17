import type { ParsedResult } from "@app/shared/types";
import config from "~/config";
import { tryJsonParse } from "~/lib/utils";

type SavedResults = Record<string, ParsedResult>;

export async function getSavedResults(): Promise<SavedResults> {
    const file = Bun.file(`${config.STORE_DIR}/${config.SAVED_RESULTS_STORE}`);
    if (!(await file.exists())) return {};

    return tryJsonParse<SavedResults>(await file.text()) ?? {};
}

export async function saveResults(results: SavedResults) {
    const file = Bun.file(`${config.STORE_DIR}/${config.SAVED_RESULTS_STORE}`);
    await file.write(JSON.stringify(results));
}
