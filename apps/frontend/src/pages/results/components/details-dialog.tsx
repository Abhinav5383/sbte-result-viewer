import { apiUrl } from "@app/shared/consts";
import {
    BRANCH_NAME,
    COLLEGE_FULL_NAME,
    PAPER_NAME,
    PAPER_TYPE,
    type ParsedResult,
    type SubjectResult,
} from "@app/shared/types";
import ExternalLinkIcon from "lucide-solid/icons/external-link";
import XIcon from "lucide-solid/icons/x";
import { For, type JSX, Show } from "solid-js";
import { BranchBadge } from "~/components/misc/badges";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { cn } from "~/components/utils";
import { alphabeticalGradeClass, marksClass, sgpaClass } from "~/lib/grade-utils";

interface DetailsDialogProps {
    open: boolean;
    onClose: () => void;
    result: ParsedResult | undefined;
    customBadge?: JSX.Element;
}

export function DetailsDialog(props: DetailsDialogProps) {
    function closeDialog() {
        props.onClose();
    }

    return (
        <Dialog open={props.open} onClose={closeDialog} dialogProps={{ class: "rounded-xl relative" }}>
            <Show
                keyed
                when={props.result}
                fallback={
                    <div class="flex flex-col items-center justify-center gap-4 p-6">
                        <span class="text-lg font-semibold text-dim-fg">Result not found</span>
                        <button
                            type="button"
                            class="px-4 py-2 rounded-lg bg-accent-bg text-white font-bold hover:bg-accent-bg/90 transition-colors"
                            onClick={closeDialog}
                        >
                            Close
                        </button>
                    </div>
                }
            >
                {(data) => (
                    <div class="@container">
                        <div class="grid gap-y-1 p-6 bg-accent-bg text-zinc-50">
                            <div class="flex flex-wrap items-center gap-x-3 pe-12">
                                <h1 class="text-3xl font-extrabold">{data.student.name}</h1>

                                <BranchBadge
                                    branch={BRANCH_NAME[data.student.branch]}
                                    semester={props.customBadge ? props.customBadge : data.student.roll.charAt(0)}
                                />

                                <Show when={data.cgpa}>
                                    {(cgpa) => (
                                        <span
                                            class={`branch-badge ${BRANCH_NAME[data.student.branch].toLowerCase()} inline-block ps-2 pe-0.5 rounded-lg text-sm`}
                                        >
                                            CGPA
                                            <em class="inline-block not-italic ms-1 px-1.5 py-0.5 my-0.5 bg-white/75 rounded-md">
                                                {cgpa().toFixed(2)}
                                            </em>
                                        </span>
                                    )}
                                </Show>
                            </div>

                            <span class="text-accent-bg-text font-medium">
                                {COLLEGE_FULL_NAME[data.student.college]}
                            </span>

                            <div class="flex flex-wrap items-center gap-x-3">
                                <span class="font-semibold py-1 tabular-nums">{data.student.roll}</span>
                                <a
                                    href={apiUrl(data.student.roll)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="flex items-center font-medium gap-1 text-sm px-2 py-1 rounded-md text-white underline decoration-white/50 hover:text-accent-fg hover:bg-white transition-colors"
                                >
                                    View original PDF
                                    <ExternalLinkIcon />
                                </a>
                            </div>
                        </div>

                        <div class="grid gap-4 p-4">
                            <div class="grid grid-cols-1 xs:grid-cols-2 gap-4">
                                <div class="grid gap-1 place-items-center bg-zinc-100 rounded-lg p-6">
                                    <h2 class="uppercase font-semibold text-dim-fg text-sm">Obtained Marks</h2>
                                    <span
                                        class={cn(
                                            "text-4xl font-bold",
                                            marksClass(data.grandTotal.obtained, data.grandTotal.maximum),
                                        )}
                                    >
                                        {data.grandTotal.obtained}
                                    </span>
                                    <span class="text-dim-fg">Out of {data.grandTotal.maximum}</span>
                                </div>

                                <div class="grid gap-1 place-items-center bg-zinc-100 rounded-lg p-6">
                                    <h2 class="uppercase font-semibold text-dim-fg text-sm">SGPA</h2>
                                    <span class={cn("text-4xl font-bold", sgpaClass(data.sgpa))}>
                                        {data.sgpa.toFixed(2)}
                                    </span>
                                    <span class="text-dim-fg">{data.remarks}</span>
                                </div>
                            </div>

                            <div class="grid gap-6">
                                <For each={Object.values(PAPER_TYPE)}>
                                    {(paperType) => (
                                        <SubjectCategory
                                            title={PAPER_NAME[paperType]}
                                            subjects={data.subjects.filter((sub) => sub.type === paperType)}
                                        />
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>
                )}
            </Show>

            <div class="absolute inset-bs-5 inset-e-4 flex items-center gap-2">
                <Button
                    variant="secondary"
                    size="icon"
                    class="rounded-full bg-zinc-50 hover:text-accent-fg"
                    onClick={closeDialog}
                >
                    <XIcon />
                </Button>
            </div>
        </Dialog>
    );
}

interface SubjectCategoryProps {
    title: string;
    subjects: SubjectResult[];
}

function SubjectCategory(props: SubjectCategoryProps) {
    return (
        <Show when={props.subjects.length > 0}>
            <div class="grid grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-3 gap-3 border-bs-[0.07rem] border-border mt-3 pt-3">
                <span class="capitalize text-xl font-bold text-dim-fg col-span-full">{props.title}</span>
                <For each={props.subjects}>{(subject) => <SubjectMarksDetails sub={subject} />}</For>
            </div>
        </Show>
    );
}

function SubjectMarksDetails(props: { sub: SubjectResult }) {
    return (
        <div class="grid gap-3 bg-zinc-100 rounded-lg px-4 py-3 border-[0.07rem] border-zinc-200 tabular-nums">
            <div class="h-fit flex gap-3 items-center">
                <span class="text-lg leading-tight font-medium">{props.sub.name}</span>
                <span
                    class={cn(
                        "bg-current/10 px-2 py-0.5 self-start ms-auto mt-[0.15em] rounded-md text-xs font-bold",
                        alphabeticalGradeClass(props.sub.grade),
                    )}
                >
                    {props.sub.grade}
                </span>
            </div>

            <SubjectMarksRow sub={props.sub} />
        </div>
    );
}

function MarksDivider() {
    return <span class="leading-none text-[0.9em] text-dim-fg/50">/</span>;
}

function SubjectMarksRow(props: { sub: SubjectResult }) {
    return (
        <div class="grid gap-x-1 gap-y-3 grid-cols-[repeat(4,max-content)] font-medium text-xs text-dim-fg [&>div>*:not(:first-child)]:justify-self-end">
            <Show
                when={props.sub.external.max}
                fallback={
                    <div class="grid items-end col-span-full grid-cols-subgrid">
                        <span class="trim-both">Internal:</span>
                        <span
                            class={cn(
                                "trim-both font-semibold text-lg",
                                marksClass(props.sub.total.obtained, props.sub.total.max),
                            )}
                        >
                            {props.sub.internal.obtained}
                        </span>

                        <MarksDivider />
                        <span class="trim-both">{props.sub.internal.max}</span>
                    </div>
                }
            >
                <div class="grid items-end col-span-full grid-cols-subgrid">
                    <span class="trim-both">External:</span>
                    <span class="trim-both font-semibold text-normal-fg">{props.sub.external.obtained}</span>

                    <MarksDivider />
                    <span class="trim-both">{props.sub.external.max}</span>
                </div>

                <div class="grid items-end col-span-full grid-cols-subgrid">
                    <span class="trim-both">Internal:</span>
                    <span class="trim-both font-semibold text-normal-fg">{props.sub.internal.obtained}</span>

                    <MarksDivider />
                    <span class="trim-both">{props.sub.internal.max}</span>
                </div>

                <div class="grid items-end col-span-full grid-cols-subgrid">
                    <span class="trim-both">Total:</span>
                    <span
                        class={cn(
                            "trim-both font-semibold text-lg",
                            marksClass(props.sub.total.obtained, props.sub.total.max),
                        )}
                    >
                        {props.sub.total.obtained}
                    </span>

                    <MarksDivider />
                    <span class="trim-both">{props.sub.total.max}</span>
                </div>
            </Show>
        </div>
    );
}
