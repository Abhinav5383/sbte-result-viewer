import { getRegNoFromRoll } from "@app/shared/utils";
import { createMemo } from "solid-js";
import { useResults } from "~/providers/results";
import type { StudentItem } from "./types";

export default function GroupGeneratorPage() {
    const ctx = useResults();

    const studentsList = createMemo(() => {
        const results = ctx.results();
        if (!results?.length) return [];

        const added = new Set<string>();
        const list: StudentItem[] = [];

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const regNo = getRegNoFromRoll(result.student.roll);
            if (added.has(regNo)) continue;

            added.add(regNo);
            list.push({
                name: result.student.name,
                regNo,
            });
        }

        return list;
    });

    console.log(studentsList.length);

    return <p>Group Generator</p>;
}
