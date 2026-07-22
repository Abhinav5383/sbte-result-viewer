import { BRANCH_NAME, COLLEGE_NAME } from "@app/shared/types";
import {
    getBranchCodeStrFromRoll,
    getBranchFromRoll,
    getCollegeCodeStrFromRoll,
    getCollegeFromRoll,
    getSessionFromRoll,
} from "@app/shared/utils";
import DownloadIcon from "lucide-solid/icons/download";
import XIcon from "lucide-solid/icons/x";
import { createMemo, createSignal, For, Show } from "solid-js";
import { BranchBadge } from "~/components/misc/badges";
import VirtualList from "~/components/misc/virtual-list";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { cn } from "~/components/utils";
import { generateCSV } from "~/pages/tools/csv-export/gen-csv";
import { getDynamicCsvFields } from "./helpers";
import type { GeneratedGroup } from "./types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    groups: GeneratedGroup[];
}

export default function GeneratedGroupsDialog(props: Props) {
    const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement | undefined>();
    const maxGroupSize = () => props.groups[0]?.students?.length ?? 1;

    function downloadGroupsCsv() {
        const groups = props.groups;
        if (!groups.length) return;

        const csvFields = getDynamicCsvFields(groups.flatMap((group) => group.students));
        const headers = ["Group Number", "Student Name", "Roll", ...csvFields.map((field) => field.label)];
        const rows: string[][] = [];

        for (const group of groups) {
            for (const student of group.students) {
                rows.push([
                    String(group.groupId),
                    student.name,
                    student.roll,
                    ...csvFields.map((field) => {
                        switch (field.key) {
                            case "branch":
                                return BRANCH_NAME[getBranchFromRoll(student.roll)];

                            case "college":
                                return COLLEGE_NAME[getCollegeFromRoll(student.roll)];

                            case "session":
                                return `20${getSessionFromRoll(student.roll)}`;

                            default:
                                throw new Error(`Invalid Dynamic CSV field: ${field.key}`);
                        }
                    }),
                ]);
            }
        }

        const csvContent = generateCSV(headers, rows);
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "randomized-groups.csv";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    }

    const hasMultiple = createMemo(() => {
        const branches = new Set<string>();
        const colleges = new Set<string>();
        const sessions = new Set<string>();

        for (const student of props.groups.flatMap((g) => g.students)) {
            const roll = student.roll;

            if (branches.size <= 1) {
                branches.add(getBranchCodeStrFromRoll(roll));
            }

            if (colleges.size <= 1) {
                colleges.add(getCollegeCodeStrFromRoll(roll));
            }

            if (sessions.size <= 1) {
                sessions.add(getSessionFromRoll(roll));
            }

            if (branches.size > 1 && colleges.size > 1 && sessions.size > 1) {
                break;
            }
        }

        return {
            branch: branches.size > 1,
            session: sessions.size > 1,
            college: colleges.size > 1,
        };
    });

    const gridCols = createMemo(() => {
        const _hasMultiple = hasMultiple();

        const cols = ["auto", "2fr", "1.5fr"];
        if (_hasMultiple.branch) cols.push("1fr");
        if (_hasMultiple.college) cols.push("2fr");
        if (_hasMultiple.session) cols.push("1fr");
        return cols.join(" ");
    });

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.onClose}
            dialogProps={{
                class: "rounded-lg max-w-[calc(100vw_-_1rem)] sm:max-w-[calc(100vw_-_4rem)]",
                ref: (el) => setDialogRef(el),
            }}
        >
            <div class="flex items-center p-4 gap-4">
                <div class="flex flex-wrap items-center justify-between grow gap-2">
                    <h2 class="text-xl font-bold text-normal-fg">Generated Groups</h2>

                    <Button variant="primary-alt" type="button" onClick={downloadGroupsCsv}>
                        <DownloadIcon />
                        Download CSV
                    </Button>
                </div>

                <Button variant="secondary" size="icon" class="rounded-full" onClick={props.onClose}>
                    <XIcon class="w-5 h-5" />
                </Button>
            </div>

            <Show
                when={props.groups.length > 0}
                fallback={
                    <div class="p-8 text-center mt-10 mx-6 border-[0.07rem] border-dashed  border-border rounded-xl bg-white">
                        <p class="text-dim-fg">No groups generated yet.</p>
                    </div>
                }
            >
                <div class="grid overflow-x-auto" style={{ "grid-template-columns": gridCols() }}>
                    <div class="grid grid-cols-subgrid col-span-full bg-zinc-700 text-zinc-200 font-semibold *:px-4 *:py-3">
                        <div class="text-end ps-10 border-e-[0.07rem] border-current/35">Group</div>
                        <div>Name</div>
                        <div>Roll No.</div>
                        <Show when={hasMultiple().branch}>
                            <div>Branch</div>
                        </Show>
                        <Show when={hasMultiple().college}>
                            <div>College</div>
                        </Show>
                        <Show when={hasMultiple().session}>
                            <div>Session</div>
                        </Show>
                    </div>

                    <VirtualList
                        items={props.groups}
                        defaultRowHeight={52}
                        containerProps={{ class: "grid col-span-full grid-cols-subgrid" }}
                        scrollElement={dialogRef()}
                        RowComponent={(args) => (
                            <div
                                class={cn(
                                    args.class,
                                    "grid grid-cols-subgrid col-span-full text-dim-fg border-be-[0.07rem] border-border",
                                )}
                            >
                                <div
                                    class={cn(
                                        args.class,
                                        "px-4 py-3 font-semibold border-e-[0.07rem] border-border text-lg flex items-center justify-end tabular-nums",
                                    )}
                                    style={{ "grid-row": `span ${maxGroupSize()}` }}
                                >
                                    <span class="opacity-50">#</span>
                                    {args.item.groupId}
                                </div>

                                <For each={args.item.students}>
                                    {(student, index) => {
                                        return (
                                            <div
                                                class={cn(
                                                    "contents *:py-2 *:px-4 *:min-w-max *:border-be-[0.07rem] *:border-border/50",
                                                    index() === args.item.students.length - 1 && "*:border-transparent",
                                                )}
                                            >
                                                <div class="font-medium text-normal-fg">{student.name}</div>
                                                <div class="text-sm tabular-nums">{student.id}</div>
                                                <Show when={hasMultiple().branch}>
                                                    <div>
                                                        <BranchBadge
                                                            branch={BRANCH_NAME[getBranchFromRoll(student.roll)]}
                                                        />
                                                    </div>
                                                </Show>
                                                <Show when={hasMultiple().college}>
                                                    <div class="text-sm">
                                                        {COLLEGE_NAME[getCollegeFromRoll(student.roll)]}
                                                    </div>
                                                </Show>
                                                <Show when={hasMultiple().session}>
                                                    <div class="text-sm tabular-nums">
                                                        <span class="opacity-75">20</span>
                                                        {getSessionFromRoll(student.roll)}
                                                    </div>
                                                </Show>
                                            </div>
                                        );
                                    }}
                                </For>

                                <Show when={args.item.students.length < maxGroupSize()}>
                                    <For each={new Array(maxGroupSize() - args.item.students.length)}>
                                        {() => (
                                            <div class="grid col-start-2 -col-end-1 text-current/50 border-bs-[0.07rem] border-border/50 px-4 py-2 italic">
                                                Empty
                                            </div>
                                        )}
                                    </For>
                                </Show>
                            </div>
                        )}
                    />
                </div>
            </Show>
        </Dialog>
    );
}
