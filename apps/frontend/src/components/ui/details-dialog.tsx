import { apiUrl } from "@app/shared/consts";
import {
    COLLEGE_FULL_NAME,
    PAPER_TYPE,
    type ParsedResult,
    type SubjectResult,
} from "@app/shared/types";
import { toPng } from "html-to-image";
import CheckIcon from "lucide-solid/icons/check";
import ClipboardIcon from "lucide-solid/icons/clipboard";
import DownloadIcon from "lucide-solid/icons/download";
import ExternalLinkIcon from "lucide-solid/icons/external-link";
import ImageIcon from "lucide-solid/icons/image";
import XIcon from "lucide-solid/icons/x";
import { For, Show, createEffect, createSignal } from "solid-js";
import { OrdinalSuffix, cn } from "~/components/utils";
import { alphabeticalGradeClass, marksClass, sgpaClass } from "~/lib/grade-utils";
import "./details-dialog.css";

interface DetailsDialogProps {
    open: boolean;
    onClose: () => void;
    data: ParsedResult | undefined;
}

export function DetailsDialog(props: DetailsDialogProps) {
    const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement | null>(null);

    const [contentRef, setContentRef] = createSignal<HTMLDivElement | null>(null);
    const [saving, setSaving] = createSignal(false);
    const [previewImage, setPreviewImage] = createSignal<string | null>(null);
    const [previewOpen, setPreviewOpen] = createSignal(false);

    function closeDialog() {
        props.onClose();
    }

    async function saveAsImage() {
        const content = contentRef();
        if (!content || !props.data) return;

        setSaving(true);
        try {
            // wait to apply the saving state
            await new Promise((resolve) => setTimeout(resolve, 10));

            const dataUrl = await toPng(content, {
                backgroundColor: "#ffffff",
                pixelRatio: 2,
            });
            setPreviewImage(dataUrl);
            setPreviewOpen(true);
        } catch (err) {
            console.error("Failed to save image:", err);
        } finally {
            setSaving(false);
        }
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
                    <div class="relative">
                        <div ref={setContentRef} class="@container">
                            <div class="grid gap-y-3 p-6 bg-accent-bg text-zinc-50">
                                <div class="grid gap-1">
                                    <div class="flex flex-wrap items-center gap-3">
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
                                    </div>
                                    <span class="text-accent-bg-text font-medium">
                                        {COLLEGE_FULL_NAME[data.student.college]}
                                    </span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span class="font-semibold py-1">{data.student.roll}</span>
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
                                        <span
                                            class={cn("text-4xl font-bold", sgpaClass(data.sgpa))}
                                        >
                                            {data.sgpa.toFixed(2)}
                                        </span>
                                        <span class="text-dim-fg">{data.remarks}</span>
                                    </div>
                                </div>

                                <div class="grid gap-6">
                                    <SubjectCategory
                                        title={PAPER_TYPE.THEORY.toLowerCase()}
                                        subjects={data.subjects.filter(
                                            (sub) => sub.type === PAPER_TYPE.THEORY,
                                        )}
                                    />

                                    <SubjectCategory
                                        title={PAPER_TYPE.PRACTICAL.toLowerCase()}
                                        subjects={data.subjects.filter(
                                            (sub) => sub.type === PAPER_TYPE.PRACTICAL,
                                        )}
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

                        <div class="absolute top-6 end-4 flex items-center gap-2">
                            <button
                                type="button"
                                class="flex items-center justify-center gap-2 bg-zinc-50 text-normal-fg rounded-full ring-zinc-600 hover:scale-105 transition-transform duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={saving()}
                                onclick={saveAsImage}
                            >
                                <ImageIcon />
                                {saving() ? "Saving..." : "Save Image"}
                            </button>

                            <button
                                type="button"
                                class="bg-zinc-50 text-normal-fg rounded-full ring-zinc-600 hover:scale-105 transition-transform duration-500"
                                onclick={closeDialog}
                            >
                                <XIcon />
                            </button>
                        </div>
                    </div>
                )}
            </Show>

            <ImagePreviewDialog
                open={previewOpen()}
                onClose={() => setPreviewOpen(false)}
                imageUrl={previewImage()}
                filename={`${props.data?.student.name.replace(" ", "_")}-${
                    props.data?.student.roll
                }-result.png`}
            />
        </dialog>
    );
}

interface ImagePreviewDialogProps {
    open: boolean;
    onClose: () => void;
    imageUrl: string | null;
    filename: string;
}

function ImagePreviewDialog(props: ImagePreviewDialogProps) {
    const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement | null>(null);
    const [copied, setCopied] = createSignal(false);

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

    function download() {
        if (!props.imageUrl) return;
        const link = document.createElement("a");
        link.download = props.filename;
        link.href = props.imageUrl;
        link.click();
    }

    let timeoutRef: number;
    async function copyToClipboard() {
        if (!props.imageUrl) return;
        try {
            if (timeoutRef) {
                clearTimeout(timeoutRef);
            }

            const response = await fetch(props.imageUrl);
            const blob = await response.blob();
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
            setCopied(true);
            timeoutRef = setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy image:", err);
        }
    }

    return (
        <dialog
            ref={setDialogRef}
            closedby="any"
            onClose={(e) => {
                e.preventDefault();
                props.onClose();
            }}
            class="rounded-xl overflow-clip"
        >
            <Show when={props.imageUrl}>
                <div class="flex flex-col max-h-[90vh] gap-4 p-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-semibold">Image Preview</h2>
                        <button
                            type="button"
                            class="p-2 aspect-square flex items-center justify-center rounded-full bg-zinc-800 text-white hover:bg-zinc-600 transition-colors"
                            onclick={props.onClose}
                        >
                            <XIcon />
                        </button>
                    </div>

                    <div class="flex-1 min-h-0 overflow-auto flex items-center justify-center p-6 bg-zinc-100 rounded-lg">
                        <div class="bg-white p-3 pb-12 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_8px_40px_rgba(0,0,0,0.1)] rounded-sm rotate-3">
                            <img
                                src={props.imageUrl ?? ""}
                                alt="Result preview"
                                class="max-w-full max-h-[60vh] rounded-sm shadow-inner"
                            />
                        </div>
                    </div>

                    <div class="flex gap-3 justify-end">
                        <button
                            type="button"
                            class="flex items-center gap-2 px-4 py-2 rounded-lg border text-dim-fg border-zinc-300 hover:bg-zinc-100 transition-colors"
                            onclick={copyToClipboard}
                        >
                            <Show when={copied()} fallback={<ClipboardIcon />}>
                                <CheckIcon class="text-accent-fg" />
                            </Show>
                            {copied() ? "Copied!" : "Copy to Clipboard"}
                        </button>

                        <button
                            type="button"
                            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-bg text-white font-bold hover:bg-accent-bg/90 transition-colors"
                            onclick={download}
                        >
                            <DownloadIcon />
                            Download
                        </button>
                    </div>
                </div>
            </Show>
        </dialog>
    );
}

interface SubjectCategoryProps {
    title: string;
    subjects: SubjectResult[];
}

function SubjectCategory(props: SubjectCategoryProps) {
    return (
        <Show when={props.subjects.length > 0}>
            <div class="grid grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-3 gap-3 border-t border-border mt-3 pt-3">
                <span class="capitalize text-xl font-bold text-dim-fg col-span-full">
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
