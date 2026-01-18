import { apiUrl } from "@app/shared/consts";
import type { BranchConfig, ParsedResult } from "@app/shared/types";
import { getInvalidRolls, saveInvalidRolls } from "~/lib/fs/invalid-rolls";
import { getSavedResults, saveResults } from "~/lib/fs/saved-results";
import { extractTextFromPdfBuffer } from "~/lib/parser/extract-text";
import { parseTxtToJson } from "~/lib/parser/parse-txt";
import { formatRollList } from "~/lib/utils";

const BATCH_SIZE = 60;
export async function parseAllStudentsData(branch: BranchConfig): Promise<ParsedResult[]> {
    const requestedItems: ParsedResult[] = [];
    const requestedRolls = formatRollList(branch.rollList, branch);

    const invalidRolls = await getInvalidRolls();
    const existingResults = await getSavedResults();
    const existingResultRolls = existingResults.map((res) => res.student.roll);

    for (const item of existingResults) {
        if (requestedRolls.includes(item.student.roll)) {
            requestedItems.push(item);
        }
    }
    const filteredRolls = formatRollList(branch.rollList, branch).filter((roll) => {
        return !invalidRolls.includes(roll) && !existingResultRolls.includes(roll);
    });

    // if no new rolls to fetch, return from existing results
    if (filteredRolls.length < 1) return requestedItems;

    console.log(
        `Fetching results for ${filteredRolls.length} students in ${branch.branchName} branch...`,
    );

    const newInvalidRolls: string[] = [];
    const parsedData: ParsedResult[] = [];

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

            parsedData.push(parsedResult);
            requestedItems.push(parsedResult);
        });

        await Promise.all(fetchPromises);
    }
    console.log(`Fetched ${parsedData.length} results for branch: ${branch.branchName}\n`);

    const invalidRolls_appendList: string[] = [];
    for (const roll of newInvalidRolls) {
        if (!invalidRolls.includes(roll) && !invalidRolls_appendList.includes(roll)) {
            invalidRolls_appendList.push(roll);
        }
    }
    await saveInvalidRolls(invalidRolls_appendList);

    const combinedResults = [...existingResults, ...parsedData];
    await saveResults(combinedResults);

    return requestedItems;
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
