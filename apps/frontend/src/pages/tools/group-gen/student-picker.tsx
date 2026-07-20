import { BRANCH_NAME, COLLEGE_NAME } from "@app/shared/types";
import { getRegNoFromRoll } from "@app/shared/utils";
import PlusIcon from "lucide-solid/icons/plus";
import Trash2Icon from "lucide-solid/icons/trash-2";
import XIcon from "lucide-solid/icons/x";
import { createMemo, createSignal, Show } from "solid-js";
import { BranchBadge } from "~/components/misc/badges";
import { ResultsFilter } from "~/components/misc/results-filter/component";
import type { useResultsFilter } from "~/components/misc/results-filter/hook";
import VirtualList from "~/components/misc/virtual-list";
import { Dialog } from "~/components/ui/dialog";
import { cn } from "~/components/utils";
import type { PoolStudent } from "./types";

interface StudentPickerDialogProps {
    open: boolean;
    onClose: () => void;
    hook: ReturnType<typeof useResultsFilter>;
    indexedData: any;
    availableStudents: PoolStudent[];
    poolRolls: Set<string>;
    onAddStudent: (student: PoolStudent) => void;
    onRemoveStudent: (roll: string) => void;
    onAddAll: () => void;
    customName: string;
    setCustomName: (name: string) => void;
    customRoll: string;
    setCustomRoll: (roll: string) => void;
    onAddCustomStudent: () => void;
}

export function StudentPickerDialog(props: StudentPickerDialogProps) {
    const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement | undefined>();
    const hasMultipleColleges = createMemo(() => new Set(props.availableStudents.map((s) => s.college)).size > 1);
    const hasMultipleSessions = createMemo(() => new Set(props.availableStudents.map((s) => s.session)).size > 1);

    const gridCols = createMemo(() => {
        const cols = ["2fr", "1.5fr", "1.5fr"];
        if (hasMultipleColleges()) cols.push("1.5fr");
        if (hasMultipleSessions()) cols.push("1fr");
        cols.push("auto");
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
                <h2 class="text-xl font-bold text-normal-fg">Add Students to Pool</h2>
                <button
                    type="button"
                    onClick={props.onClose}
                    class="grid place-content-center p-1 aspect-square text-dim-fg hover:text-normal-fg hover:bg-zinc-100 rounded-full transition-colors"
                >
                    <XIcon class="w-5 h-5" />
                </button>
            </div>

            <div class="grid bg-white">
                <div class="grid gap-4 p-6">
                    <div class="flex flex-wrap items-center justify-between gap-4">
                        <div class="grid gap-1">
                            <h3 class="font-semibold text-normal-fg">Add From Results</h3>
                            <p class="fg">Filter and select students from the existing results data.</p>
                        </div>
                        <button
                            type="button"
                            onClick={props.onAddAll}
                            class={cn(
                                "text-sm font-medium bg-accent-fg/15 text-accent-fg px-4 rounded-lg transition-colors",
                                "hover:bg-accent-bg hover:text-accent-bg-text focus-visible:bg-accent-bg focus-visible:text-accent-bg-text",
                            )}
                        >
                            Add All Filtered ({props.availableStudents.length})
                        </button>
                    </div>

                    <div class="grid grid-cols-1 xl:grid-cols-[4fr_3fr_3fr_3fr_4fr] gap-x-2.5 gap-y-4 py-2 *:first:col-span-full">
                        <ResultsFilter hook={props.hook} indexedData={props.indexedData} alwaysShowSort />
                    </div>
                </div>

                <div class="grid border-t border-border mt-4" style={{ "grid-template-columns": gridCols() }}>
                    <div class="grid grid-cols-subgrid col-span-full bg-zinc-700 text-zinc-200 border-b border-border text-sm font-semibold">
                        <div class="px-4 py-3">Name</div>
                        <div class="px-4 py-3">Roll No.</div>
                        <div class="px-4 py-3">Branch</div>
                        <Show when={hasMultipleColleges()}>
                            <div class="px-4 py-3">College</div>
                        </Show>
                        <Show when={hasMultipleSessions()}>
                            <div class="px-4 py-3">Session</div>
                        </Show>
                        <div class="px-4 py-3 text-end min-w-[6rem]"> </div>
                    </div>

                    <VirtualList
                        items={props.availableStudents}
                        defaultRowHeight={40}
                        containerProps={{ class: "grid col-span-full grid-cols-subgrid" }}
                        scrollElement={dialogRef()}
                        RowComponent={(args) => {
                            const student = args.item;
                            const isAdded = () => props.poolRolls.has(student.roll);

                            return (
                                <div
                                    class={cn(
                                        args.class,
                                        "grid grid-cols-subgrid col-span-full items-center border-b border-border hover:bg-zinc-50/50 transition-colors py-2",
                                    )}
                                >
                                    <div class="font-medium text-normal-fg px-4">{student.name}</div>
                                    <div class="text-dim-fg tabular-nums px-4">{getRegNoFromRoll(student.roll)}</div>
                                    <div>
                                        <BranchBadge branch={BRANCH_NAME[student.branch]} />
                                    </div>
                                    <Show when={hasMultipleColleges()}>
                                        <div class="text-sm text-dim-fg px-4">{COLLEGE_NAME[student.college]}</div>
                                    </Show>
                                    <Show when={hasMultipleSessions()}>
                                        <div class="text-sm text-dim-fg tabular-nums px-4">{student.session}</div>
                                    </Show>
                                    <div class="px-4 text-end flex justify-end">
                                        <Show
                                            when={isAdded()}
                                            fallback={
                                                <button
                                                    type="button"
                                                    onClick={() => props.onAddStudent(student)}
                                                    class="min-h-9 p-1 flex items-center justify-center rounded-lg transition-all aspect-square bg-accent-bg/15 text-accent-fg hover:bg-accent-bg/25"
                                                >
                                                    <PlusIcon class="w-5 h-5" />
                                                </button>
                                            }
                                        >
                                            <button
                                                type="button"
                                                onClick={() => props.onRemoveStudent(student.roll)}
                                                class="min-h-9 p-1 flex items-center justify-center rounded-lg transition-all aspect-square bg-rose-50 text-rose-600 hover:bg-rose-100"
                                            >
                                                <Trash2Icon class="w-4 h-4" />
                                            </button>
                                        </Show>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        </Dialog>
    );
}
