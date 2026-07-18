import { EncodedResult, type EncodedResultT } from "@app/shared/encoder";
import { getVal } from "@app/shared/encoder/helpers";
import { getRegNoFromRoll } from "@app/shared/utils";
import { createMemo } from "solid-js";
import { useResults } from "~/providers/results";
import type { StudentItem } from "./types";

export default function GroupGeneratorPage() {
    const ctx = useResults();

    const studentsList = createMemo(() => {
        const data = ctx.data();
        const results = data?.results;
        if (!data || !results?.length) return [];

        const added = new Set<string>();
        const list: EncodedResultT[] = [];

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const regNo = getRegNoFromRoll(getVal(result, "roll"));
            if (added.has(regNo)) continue;

            added.add(regNo);
            list.push(result);
        }

        return list;
    });

    return <p>Group Generator</p>;
}
