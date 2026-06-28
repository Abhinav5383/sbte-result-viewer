import { decodeResults, type EncodedResult } from "@app/shared/encoder";
import { BRANCH_NAME, COLLEGE_NAME, PAPER_TYPE, type ParsedResult } from "@app/shared/types";

interface Props {
    college: COLLEGE_NAME;
    branch: BRANCH_NAME;
    semester: string;
}

async function getCSV(props: Props) {
    const list = await getParsedResults();
    const requiredList: ParsedResult[] = [];

    for (let i = 0; i < list.length; i++) {
        const item = list[i];

        if (item.student.college !== props.college) continue;
        if (item.student.branch !== props.branch) continue;
        if (item.student.roll[0] !== props.semester) continue;

        requiredList.push(item);
    }

    requiredList.sort((a, b) => a.student.roll.localeCompare(b.student.roll));

    let csv = "Name,Roll,Marks,SGPA,Carry Subjects\n";

    for (let i = 0; i < requiredList.length; i++) {
        const item = requiredList[i];

        csv += escapeStr(item.student.name);
        csv += ",";
        csv += escapeStr(item.student.roll);
        csv += ",";
        csv += item.grandTotal.obtained;
        csv += ",";
        csv += item.sgpa;
        csv += ",";

        if (item.sgpa <= 0) {
            const carrySubjects = item.subjects.filter((sub) => {
                return sub.type === PAPER_TYPE.THEORY && sub.external.obtained < sub.external.passing;
            });

            const carrySubs: string[] = [];
            for (const sub of carrySubjects) {
                carrySubs.push(sub.name);
            }

            csv += escapeStr(carrySubs.join(", "));
        }

        if (i < requiredList.length - 1) csv += "\n";
    }

    await Bun.write("result.csv", csv);
    console.log("Result written to result.csv");
}

await getCSV({
    college: COLLEGE_NAME.NGP_PATNA_13,
    branch: BRANCH_NAME.CSE,
    semester: "2",
});
process.exit(0);

async function getParsedResults() {
    const results = Bun.file("./generated/saved-results.json");
    return decodeResults(JSON.parse(await results.text()) as EncodedResult[]);
}

function escapeStr(str: string) {
    return `"${str.replaceAll('"', '""')}"`;
}
