import { decodeResult, type EncodedData } from "@app/shared/encoder";
import { getVal } from "@app/shared/encoder/helpers";
import { createEffect, createMemo, createSignal } from "solid-js";
import { Select } from "~/components/ui/select";
import { OrdinalSuffix } from "~/components/utils";
import { DetailsDialog } from "~/pages/results/components/details-dialog";
import type { LeaderboardEntry } from "../types";

interface LeaderboardDialogProps {
    open: boolean;
    onClose: () => void;
    entry: LeaderboardEntry | undefined;
    resultsData: EncodedData;
}

export function LeaderboardDialog(props: LeaderboardDialogProps) {
    const [activeTab, setActiveTab] = createSignal(0);

    createEffect(() => {
        props.entry?.student.id;
        setActiveTab(0);
    });

    const activeResult = () => {
        const entry = props.entry;
        if (!entry || entry.matchedResults.length === 0) return undefined;

        const validIdx = Math.max(0, Math.min(activeTab(), entry.matchedResults.length - 1));
        return decodeResult(entry.matchedResults[validIdx], props.resultsData);
    };

    const semesterOptions = createMemo(() => {
        const entry = props.entry;
        if (!entry || entry.matchedResults.length <= 1) return undefined;

        return entry.matchedResults.map((result, idx) => {
            const roll = getVal(result, "roll");
            const sem = roll.charAt(0);
            const label = `${sem}${OrdinalSuffix(sem)} sem`;

            return { label, value: idx.toString() };
        });
    });

    const CustomBadge = createMemo(() =>
        semesterOptions() ? (
            <div class="inline-block ">
                <Select
                    value={activeTab().toString()}
                    onChange={(val) => setActiveTab(Number.parseInt(val, 10))}
                    options={semesterOptions() ?? []}
                    class="min-w-0 w-fit border-transparent min-h-0 bg-white text-current"
                    triggerClass="min-h-0 p-0 gap-1 ps-1 pe-0.5 [&_arrow_svg]:w-2 [&_arrow_svg]:h-2"
                />
            </div>
        ) : null,
    );

    return (
        <DetailsDialog open={props.open} onClose={props.onClose} result={activeResult()} customBadge={CustomBadge()} />
    );
}
