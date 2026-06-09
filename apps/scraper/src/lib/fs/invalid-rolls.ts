import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import config from "~/config";

function ROLLS_FILE() {
    return `${config.STORE_DIR}/${config.INVALID_ROLLS_STORE}`;
}

export async function getInvalidRolls() {
    if (!existsSync(ROLLS_FILE())) return [];

    try {
        const fileContents = await readFile(ROLLS_FILE(), { encoding: "utf-8" });
        return fileContents.toString().split("\n");
    } catch (error) {
        console.error("Error reading invalid rolls file:", error);
        return [];
    }
}

export async function saveInvalidRolls(rolls: string[]) {
    const existingRolls = await getInvalidRolls();

    try {
        await writeFile(ROLLS_FILE(), [...existingRolls, ...rolls].join("\n"));
    } catch (error) {
        console.error(`Error writing ${config.INVALID_ROLLS_STORE} file:`, error);
    }
}
