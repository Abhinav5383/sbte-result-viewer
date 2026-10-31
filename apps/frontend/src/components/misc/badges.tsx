import type { BRANCH_NAME } from "@app/shared/types";
import { type JSX, Show } from "solid-js";
import { cn, OrdinalSuffix } from "~/components/utils";

interface BranchBadgeProps {
    branch: BRANCH_NAME;
    semester?: string | JSX.Element;
    class?: string;
}

export function BranchBadge(props: BranchBadgeProps) {
    return (
        <span
            class={cn(
                "branch-badge inline-block rounded-lg text-sm text-nowrap",
                props.semester ? "p-[0.15rem] ps-2" : "px-2 py-1",
                props.branch.toLowerCase(),
                props.class,
            )}
        >
            <span class={props.semester ? "pe-1.5" : ""}>{props.branch}</span>

            <Show when={typeof props.semester === "string" && props.semester} keyed>
                {(sem) => (
                    <em class="inline-block not-italic px-1.5 py-0.5 bg-white/75 rounded-md">
                        {sem}
                        {OrdinalSuffix(sem)} sem
                    </em>
                )}
            </Show>

            <Show when={typeof props.semester !== "string" && props.semester} keyed>
                {(sem) => sem}
            </Show>
        </span>
    );
}

export function PercentageBadge(props: { percentObtained: number; class?: string }) {
    return (
        <span class={cn("bg-(--clr)/10 px-1.5 rounded-lg w-fit text-[0.83rem]", props.class)}>
            <span>{props.percentObtained.toFixed(2)}</span>
            <span class="text-xs opacity-80 saturate-50">{" %"}</span>
        </span>
    );
}
