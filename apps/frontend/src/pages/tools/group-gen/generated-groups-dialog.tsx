import { BRANCH_NAME, COLLEGE_NAME } from "@app/shared/types";
import { getRegNoFromRoll } from "@app/shared/utils";
import DownloadIcon from "lucide-solid/icons/download";
import XIcon from "lucide-solid/icons/x";
import { createMemo, createSignal, For, Show } from "solid-js";
import { BranchBadge } from "~/components/misc/badges";
import VirtualList from "~/components/misc/virtual-list";
import { Dialog } from "~/components/ui/dialog";
import { cn } from "~/components/utils";
import type { GeneratedGroup } from "./types";

interface GeneratedGroupsDialogProps {
    open: boolean;
    onClose: () => void;
    groups: GeneratedGroup[];
    onDownloadCsv: () => void;
}

export function GeneratedGroupsDialog(props: GeneratedGroupsDialogProps) {
    let [dialogRef, setDialogRef] = createSignal<HTMLDialogElement | undefined>();
    const hasMultipleColleges = createMemo(() => {
        if (!props.groups.length) return false;
        const students = props.groups.flatMap((g) => g.students);
        return new Set(students.map((s) => s.college)).size > 1;
    });
    const hasMultipleSessions = createMemo(() => {
        if (!props.groups.length) return false;
        const students = props.groups.flatMap((g) => g.students);
        return new Set(students.map((s) => s.session)).size > 1;
    });

    const gridCols = createMemo(() => {
        const cols = ["6rem", "2fr", "1fr", "1.5fr"];
        if (hasMultipleColleges()) cols.push("1.5fr");
        if (hasMultipleSessions()) cols.push("1fr");
        return cols.join(" ");
    });

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            dialogProps={{
                class: "rounded-lg max-w-[calc(100vw-4rem)]!",
                ref: (el) => setDialogRef(el),
            }}
        >
            <div class="flex items-center justify-between p-4 border-b border-border bg-white shrink-0">
                <h2 class="text-xl font-bold text-normal-fg">Generated Groups</h2>
                <div class="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={props.onDownloadCsv}
                        class={cn(
                            "flex items-center justify-center gap-2 bg-accent-bg text-accent-bg-text px-4 h-9 rounded-lg font-medium text-sm transition-colors",
                            "hover:bg-accent-bg/90 focus-visible:bg-accent-bg/90",
                        )}
                    >
                        <DownloadIcon class="w-4 h-4" />
                        Download CSV
                    </button>
                    <button
                        type="button"
                        onClick={props.onClose}
                        class="flex items-center justify-center w-10 p-0 text-dim-fg hover:text-normal-fg hover:bg-zinc-200 rounded-full transition-colors"
                    >
                        <XIcon class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto bg-white flex flex-col">
                <Show
                    when={props.groups.length > 0}
                    fallback={
                        <div class="p-8 text-center mt-10 mx-6 border border-dashed border-border rounded-xl bg-white">
                            <p class="text-dim-fg">No groups generated yet.</p>
                        </div>
                    }
                >
                    <div class="grid" style={{ "grid-template-columns": gridCols() }}>
                        <div class="grid grid-cols-subgrid col-span-full bg-zinc-700 text-zinc-200 border-b border-border font-semibold">
                            <div class="px-4 py-3">Group</div>
                            <div class="px-4 py-3">Name</div>
                            <div class="px-4 py-3">Roll No.</div>
                            <div class="px-4 py-3">Branch</div>
                            <Show when={hasMultipleColleges()}>
                                <div class="px-4 py-3">College</div>
                            </Show>
                            <Show when={hasMultipleSessions()}>
                                <div class="px-4 py-3">Session</div>
                            </Show>
                        </div>

                        <div class="grid grid-cols-subgrid col-span-full">
                            <VirtualList
                                items={props.groups}
                                defaultRowHeight={props.groups[0].students.length * 52} // Estimates height for a ~3 person group
                                containerProps={{ class: "grid col-span-full grid-cols-subgrid bg-white" }}
                                scrollElement={dialogRef()}
                                RowComponent={(args) => {
                                    const group = args.item;
                                    return (
                                        <div
                                            class={cn(
                                                args.class,
                                                "grid grid-cols-subgrid col-span-full border-b border-border",
                                            )}
                                        >
                                            <div
                                                class="px-4 py-3 font-semibold text-dim-fg border-e border-border flex items-center justify-center bg-zinc-50/50 text-lg"
                                                style={{ "grid-row": `span ${group.students.length}` }}
                                            >
                                                #{group.groupNumber}
                                            </div>

                                            <For each={group.students}>
                                                {(student) => (
                                                    <div class="contents">
                                                        <div class="px-4 py-2.5 font-medium text-normal-fg border-t border-border/50">
                                                            {student.name}
                                                        </div>
                                                        <div class="px-4 py-2.5 text-dim-fg tabular-nums border-t border-border/50">
                                                            {getRegNoFromRoll(student.roll)}
                                                        </div>
                                                        <div class="px-4 py-2.5 text-sm text-dim-fg border-t border-border/50">
                                                            <BranchBadge branch={BRANCH_NAME[student.branch]} />
                                                        </div>
                                                        <Show when={hasMultipleColleges()}>
                                                            <div class="px-4 py-2.5 text-sm text-dim-fg border-t border-border/50">
                                                                {COLLEGE_NAME[student.college]}
                                                            </div>
                                                        </Show>
                                                        <Show when={hasMultipleSessions()}>
                                                            <div class="px-4 py-2.5 text-sm text-dim-fg tabular-nums border-t border-border/50">
                                                                {student.session}
                                                            </div>
                                                        </Show>
                                                    </div>
                                                )}
                                            </For>
                                        </div>
                                    );
                                }}
                            />
                        </div>
                    </div>
                </Show>
            </div>
        </Dialog>
    );
}
