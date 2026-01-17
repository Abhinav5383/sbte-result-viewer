import { apiUrl } from "@app/shared/consts";
import { PAPER_TYPE, type ParsedResult, type SubjectResult } from "@app/shared/types";
import { DownloadIcon, XIcon } from "lucide-solid";
import { For, Show, createEffect, createSignal } from "solid-js";
import { alphabeticalGradeClass, marksClass, sgpaClass } from "~/lib/grade-utils";
import { OrdinalSuffix, cn } from "../utils";
import "./details-dialog.css";

interface DetailsDialogProps {
    open: boolean;
    onClose: () => void;
    data: ParsedResult | undefined;
}

export function DetailsDialog(props: DetailsDialogProps) {
    const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement | null>(null);

    function closeDialog() {
        props.onClose();
    }

    createEffect(() => {
        const dialog = dialogRef();
        if (dialog) {
            if (props.open) {
                dialog.showModal();
            } else {
                dialog.close();
            }
        }
    });

    return (
        <dialog
            ref={setDialogRef}
            closedby="any"
            onClose={(e) => {
                e.preventDefault();
                props.onClose();
            }}
            class="rounded-xl overflow-x-clip"
        >
            <Show keyed when={props.data}>
                {(data) => (
                    <div>
                        <div class="grid gap-y-3 p-6 bg-accent-bg text-zinc-50">
                            <div class="flex flex-wrap items-center gap-4">
                                <h1 class="text-3xl font-extrabold">{data.student.name}</h1>
                                <span
                                    class={`branch-badge ${data.student.branch.toLowerCase()} inline-block ps-2 pe-0.5 rounded-lg text-sm`}
                                >
                                    {data.student.branch}
                                    <em class="inline-block not-italic ms-1 px-1.5 py-0.5 my-0.5 bg-white/75 rounded-md">
                                        {data.student.roll.charAt(0)}
                                        {OrdinalSuffix(data.student.roll.charAt(0))} sem
                                    </em>
                                </span>

                                <button
                                    type="button"
                                    class="ms-auto flex items-center justify-center gap-2 bg-zinc-50 text-normal-fg rounded-full cursor-pointer ring-zinc-600 hover:scale-105 transition-transform duration-500"
                                    onclick={async () => {
                                        window.open(apiUrl(data.student.roll));
                                    }}
                                >
                                    <DownloadIcon />
                                    Download
                                </button>

                                <button
                                    type="button"
                                    class="bg-zinc-50 text-normal-fg rounded-full cursor-pointer ring-zinc-600 hover:scale-105 transition-transform duration-500"
                                    onclick={closeDialog}
                                >
                                    <XIcon />
                                </button>
                            </div>
                            <span class="font-semibold">{data.student.roll}</span>
                        </div>

                        <div class="grid gap-4 p-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="grid gap-1 place-items-center bg-zinc-100 rounded-lg p-6">
                                    <h2 class="uppercase font-semibold text-dim-fg text-sm">
                                        Obtained Marks
                                    </h2>
                                    <span
                                        class={cn(
                                            "text-4xl font-bold",
                                            marksClass(
                                                data.grandTotal.obtained,
                                                data.grandTotal.maximum,
                                            ),
                                        )}
                                    >
                                        {data.grandTotal.obtained}
                                    </span>
                                    <span class="text-dim-fg">
                                        Out of {data.grandTotal.maximum}
                                    </span>
                                </div>

                                <div class="grid gap-1 place-items-center bg-zinc-100 rounded-lg p-6">
                                    <h2 class="uppercase font-semibold text-dim-fg text-sm">
                                        SGPA
                                    </h2>
                                    <span class={cn("text-4xl font-bold", sgpaClass(data.sgpa))}>
                                        {data.sgpa.toFixed(2)}
                                    </span>
                                    <span class="text-dim-fg">{data.remarks}</span>
                                </div>
                            </div>

                            <div class="grid gap-6">
                                <h2 class="text-dim-fg text-2xl font-medium border-b-2 border-border">
                                    Subjects
                                </h2>

                                <SubjectCategory
                                    title={PAPER_TYPE.THEORY.toLowerCase()}
                                    subjects={data.subjects.filter(
                                        (sub) => sub.type === PAPER_TYPE.THEORY,
                                    )}
                                    showBorder
                                />

                                <SubjectCategory
                                    title={PAPER_TYPE.PRACTICAL.toLowerCase()}
                                    subjects={data.subjects.filter(
                                        (sub) => sub.type === PAPER_TYPE.PRACTICAL,
                                    )}
                                    showBorder
                                />

                                <SubjectCategory
                                    title={PAPER_TYPE.TERM_WORK.toLowerCase().replace("_", " ")}
                                    subjects={data.subjects.filter(
                                        (sub) => sub.type === PAPER_TYPE.TERM_WORK,
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Show>
        </dialog>
    );
}

interface SubjectCategoryProps {
    title: string;
    subjects: SubjectResult[];
    showBorder?: boolean;
}

function SubjectCategory(props: SubjectCategoryProps) {
    return (
        <Show when={props.subjects.length > 0}>
            <div
                class="grid grid-cols-2 gap-3"
                classList={{
                    "border-b border-border pb-6": props.showBorder,
                }}
            >
                <span class="capitalize text-lg font-bold text-dim-fg col-span-full">
                    {props.title}
                </span>
                <For each={props.subjects}>
                    {(subject) => <SubjectMarksDetails sub={subject} />}
                </For>
            </div>
        </Show>
    );
}

function SubjectMarksDetails(props: { sub: SubjectResult }) {
    return (
        <div class="grid gap-2 bg-zinc-100 rounded-lg p-3 border border-zinc-200">
            <div class="h-fit flex gap-3 items-center">
                <span class="text-lg font-medium">{props.sub.name}</span>
                <span
                    class={cn(
                        "bg-current/10 px-2 py-0.5 rounded-md text-xs font-bold",
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

function SubjectMarksRow(props: { sub: SubjectResult }) {
    return (
        <div class="grid gap-3 grid-cols-[repeat(3,max-content)] font-medium content-end text-xs text-dim-fg uppercase">
            <Show
                when={props.sub.external.max}
                fallback={
                    <div class="grid leading-none items-end col-span-full grid-cols-subgrid">
                        <span>Internal:</span>
                        <span
                            class={cn(
                                "font-semibold text-lg leading-none -mb-[0.16em]",
                                marksClass(props.sub.total.obtained, props.sub.total.max),
                            )}
                        >
                            {props.sub.internal.obtained}
                        </span>
                        <span>
                            <span class="text-dim-fg/50">/</span> {props.sub.internal.max}
                        </span>
                    </div>
                }
            >
                <div class="grid leading-none items-end col-span-full grid-cols-subgrid">
                    <span>External:</span>
                    <span class="font-semibold text-normal-fg">{props.sub.external.obtained}</span>
                    <span>
                        <span class="text-dim-fg/50">/</span> {props.sub.external.max}
                    </span>
                </div>

                <div class="grid leading-none items-end col-span-full grid-cols-subgrid">
                    <span>Internal:</span>
                    <span class="font-semibold text-normal-fg">{props.sub.internal.obtained}</span>
                    <span>
                        <span class="text-dim-fg/50">/</span> {props.sub.internal.max}
                    </span>
                </div>

                <div class="grid leading-none items-end col-span-full grid-cols-subgrid">
                    <span>Total:</span>
                    <span
                        class={cn(
                            "font-semibold text-lg leading-none -mb-[0.16em]",
                            marksClass(props.sub.total.obtained, props.sub.total.max),
                        )}
                    >
                        {props.sub.total.obtained}
                    </span>
                    <span>
                        <span class="text-dim-fg/50">/</span> {props.sub.total.max}
                    </span>
                </div>
            </Show>
        </div>
    );
}
