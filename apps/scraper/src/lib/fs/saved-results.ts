import { type EncodedResult, decodeResult, encodeResult } from "@app/shared/encoder";
import type { ParsedResult } from "@app/shared/types";
import config from "~/config";
import { tryJsonParse } from "~/lib/utils";

export async function getSavedResults(): Promise<ParsedResult[]> {
    const file = Bun.file(`${config.STORE_DIR}/${config.RESULTS_DATABASE}`);
    if (!(await file.exists())) return [];

    const encoded = tryJsonParse<EncodedResult[]>(await file.text());
    if (!encoded) return [];

    const decoded: ParsedResult[] = [];
    for (const encodedItem of encoded) {
        decoded.push(decodeResult(encodedItem));
    }

    return decoded;
}

export async function saveResults(results: ParsedResult[]) {
    const file = Bun.file(`${config.STORE_DIR}/${config.RESULTS_DATABASE}`);

    const addedRolls = new Set<string>();
    const encoded: EncodedResult[] = [];

    for (const item of results) {
        if (addedRolls.has(item.student.roll)) continue;

        addedRolls.add(item.student.roll);
        encoded.push(encodeResult(item));
    }

    await file.write(JSON.stringify(encoded));
}
