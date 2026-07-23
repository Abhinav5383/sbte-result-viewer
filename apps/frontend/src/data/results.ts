export default async function getCompressedResultsData() {
    const compressedResults = await import("./compressed-results.ts");
    return compressedResults.default as unknown as string;
}
