export function generateCSV(headers: string[], rows: string[][]): string {
    let csvContent = "";
    csvContent += headers.join(",") + "\n";
    for (const row of rows) {
        let rowStr = "";
        for (const cell of row) {
            const escapedCell = cell.replace(/"/g, '""');

            if (escapedCell.includes(",") || escapedCell.includes('"')) {
                rowStr += `"${escapedCell}",`;
            } else {
                rowStr += `${escapedCell},`;
            }
        }

        csvContent += rowStr.slice(0, -1) + "\n";
    }
    return csvContent;
}
