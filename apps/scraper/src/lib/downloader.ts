import { apiUrl } from "@app/shared/consts";
import type { BranchConfig, ParsedResult } from "@app/shared/types";
import { getCollegeFromRoll } from "@app/shared/utils";
import { getInvalidRolls, saveInvalidRolls } from "~/lib/fs/invalid-rolls";
import { getSavedResults, saveResults } from "~/lib/fs/saved-results";
import { extractTextFromPdfBuffer } from "~/lib/parser/extract-text";
import { parseTxtToJson } from "~/lib/parser/parse-txt";
import { formatRollList } from "~/lib/utils";

export async function getAllBranchesData(branches: BranchConfig[]): Promise<ParsedResult[]> {
    // Use Set/Map for O(1) lookups
    const invalidRolls = new Set(await getInvalidRolls());
    const existingResults = new Map<string, ParsedResult>();
    for (const result of await getSavedResults()) {
        existingResults.set(result.student.roll, result);
    }

    const seenRolls = new Set<string>();
    const allResults: ParsedResult[] = [];

    for (const branch of branches) {
        const { requestedResults, newResults, newInvalidRolls } = await parseAllStudentsData(
            branch,
            invalidRolls,
            existingResults,
        );

        // save and update cache if there's new data
        if (newResults.length > 0) {
            for (const result of newResults) {
                existingResults.set(result.student.roll, result);
            }
            await saveResults([...existingResults.values()]);
        }

        if (newInvalidRolls.length > 0) {
            for (const roll of newInvalidRolls) {
                invalidRolls.add(roll);
            }
            await saveInvalidRolls(newInvalidRolls);
        }

        // collect results
        for (const item of requestedResults) {
            if (seenRolls.has(item.student.roll)) continue;
            seenRolls.add(item.student.roll);
            allResults.push(item);
        }
    }

    return allResults;
}

export interface ParseBranchResult {
    requestedResults: ParsedResult[];
    newResults: ParsedResult[];
    newInvalidRolls: string[];
}

const BATCH_SIZE = 60;

export async function parseAllStudentsData(
    branch: BranchConfig,
    invalidRolls: Set<string>,
    existingResults: Map<string, ParsedResult>,
): Promise<ParseBranchResult> {
    const requestedRolls = formatRollList(branch.rollList, branch);

    const requestedResults: ParsedResult[] = [];
    for (const roll of requestedRolls) {
        const existing = existingResults.get(roll);
        if (existing) {
            requestedResults.push(existing);
        }
    }

    const filteredRolls = requestedRolls.filter((roll) => {
        return !invalidRolls.has(roll) && !existingResults.has(roll);
    });

    // if no new rolls to fetch, return from existing results
    if (filteredRolls.length < 1) {
        return { requestedResults, newResults: [], newInvalidRolls: [] };
    }

    console.log(
        `Fetching results for ${filteredRolls.length} students in ${getCollegeFromRoll(
            filteredRolls[0],
        )} ${branch.branchName} branch...`,
    );

    const newInvalidRolls: string[] = [];
    const newResults: ParsedResult[] = [];

    for (let i = 0; i < filteredRolls.length; i += BATCH_SIZE) {
        const batch = filteredRolls.slice(i, i + BATCH_SIZE);
        const fetchPromises = batch.map(async (roll) => {
            const pdfBuffer = await fetchResultPdf(roll);
            if (!pdfBuffer) {
                newInvalidRolls.push(roll);
                return;
            }

            const pdfText = await extractTextFromPdfBuffer(pdfBuffer);
            const parsedResult = parseTxtToJson(pdfText);
            if (!parsedResult) {
                newInvalidRolls.push(roll);
                return;
            }

            newResults.push(parsedResult);
            requestedResults.push(parsedResult);
        });

        await Promise.all(fetchPromises);
    }
    console.log(
        `Fetched ${newResults.length} results for ${getCollegeFromRoll(filteredRolls[0])} ${
            branch.branchName
        } branch\n`,
    );

    return { requestedResults, newResults, newInvalidRolls };
}

async function fetchResultPdf(roll: string) {
    const url = apiUrl(roll);
    const res = await fetch(url, {
        headers: {
            referer: "https://sbteonline.bihar.gov.in/login",
            origin: "https://sbteonline.bihar.gov.in",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        },
    });

    if (!res.ok) return null;
    console.log(`Fetched result for roll number: ${roll}`);
    return await res.arrayBuffer();
}
