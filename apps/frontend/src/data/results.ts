const compressedResults = await import("./compressed-results.ts");

const data = compressedResults.default as unknown as string;
export default data;