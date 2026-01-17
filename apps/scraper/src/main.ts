import type { ParsedResult } from "@app/shared/types";
import { BRANCHES } from "./config/colleges/gwp-muzaffarpur";
import { parseAllStudentsData } from "./lib/downloader";

async function main() {
    const allResults: ParsedResult[] = [];

    for (const branch of BRANCHES) {
        const _res = await parseAllStudentsData(branch);
        for (const item of _res) {
            if (item) allResults.push(item);
        }
    }
}

await main();
process.exit(0);
