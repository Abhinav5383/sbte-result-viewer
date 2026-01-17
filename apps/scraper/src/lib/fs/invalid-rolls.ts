import config from "~/config";

export async function getInvalidRolls() {
    const rollsFile = Bun.file(`${config.STORE_DIR}/${config.INVALID_ROLLS_STORE}`);
    if (!(await rollsFile.exists())) return [];

    try {
        const data = await rollsFile.text();
        return data.split("\n");
    } catch (error) {
        console.error("Error reading invalid rolls file:", error);
        return [];
    }
}

export async function saveInvalidRolls(rolls: string[]) {
    const rollsFile = Bun.file(`${config.STORE_DIR}/${config.INVALID_ROLLS_STORE}`);
    const existingRolls = await getInvalidRolls();

    try {
        await rollsFile.write([...existingRolls, ...rolls].join("\n"));
    } catch (error) {
        console.error(`Error writing ${config.INVALID_ROLLS_STORE} file:`, error);
    }
}
