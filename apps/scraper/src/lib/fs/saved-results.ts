import { decodeResult, type EncodedResult, encodeResult } from "@app/shared/encoder";
import type { ParsedResult } from "@app/shared/types";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
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

	const decoded: ParsedResult[] = [];
	for (const encodedItem of encoded) {
		decoded.push(decodeResult(encodedItem));
	}

	return decoded;
}

export async function saveResults(results: ParsedResult[], path = RESULTS_DB()) {
	const addedRolls = new Set<string>();
	const encoded: EncodedResult[] = [];

	for (const item of results) {
		if (addedRolls.has(item.student.roll)) continue;

		addedRolls.add(item.student.roll);
		encoded.push(encodeResult(item));
	}

	await writeFile(path, JSON.stringify(encoded));
}
