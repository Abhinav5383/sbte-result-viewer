import { extractText } from "unpdf";

export async function extractTextFromPdfBuffer(pdf: ArrayBuffer) {
    const text = await extractText(pdf);

    // assuming single page pdfs
    return text.text.join("\n");
}
