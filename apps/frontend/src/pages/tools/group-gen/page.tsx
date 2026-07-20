import type { EncodedData } from "@app/shared/encoder";
import { BRANCH_NAME } from "@app/shared/types/branch";
import { COLLEGE_NAME } from "@app/shared/types/college";
import { getRegNoFromRoll } from "@app/shared/utils";
import Trash2Icon from "lucide-solid/icons/trash-2"
import XIcon from "lucide-solid/icons/x";
import { createMemo, createSignal, Show } from "solid-js";
import { BranchBadge } from "~/components/misc/badges";
import { useResultsFilter } from "~/components/misc/results-filter/hook";
import VirtualList from "~/components/misc/virtual-list";
import { cn } from "~/components/utils";
import { useIndexedResults } from "~/lib/hooks/index-results";
import { useResults } from "~/providers/results";
import { generateCSV } from "../csv-export/gen-csv";
import { GeneratedGroupsDialog } from "./generated-groups-dialog";
import { StudentPickerDialog } from "./student-picker";
import {
    dedupeResultsByRegNo,
    type GeneratedGroup,
    makeCustomPoolStudent,
    makePoolStudentFromResult,
    mergeStudents,
    type PoolStudent,
    shuffleStudents,
} from "./types";

export default function GroupGeneratorPage() {
    const ctx = useResults();

    return (
        <Show
            when={ctx.data()}
            keyed
            fallback={
                <div class="grid place-items-center h-96">
                    <p class="text-dim-fg text-lg">Loading results data...</p>
                </div>
            }
        >
            {(data) => <PageContents encodedData={data} />}
        </Show>
    );
}

function PageContents(props: { encodedData: EncodedData }) {
    const indexedData = useIndexedResults(props.encodedData);
    const resultsFilter = useResultsFilter(props.encodedData);
    const [pickerOpen, setPickerOpen] = createSignal(false);
    const [generatedOpen, setGeneratedOpen] = createSignal(false);
    const [poolStudents, setPoolStudents] = createSignal<PoolStudent[]>([]);
    const [generatedGroups, setGeneratedGroups] = createSignal<GeneratedGroup[]>([]);
    const [groupSize, setGroupSize] = createSignal(4);
    const [customName, setCustomName] = createSignal("");
    const [customRoll, setCustomRoll] = createSignal("");

    const availableStudents = createMemo(() => {
        return dedupeResultsByRegNo(resultsFilter.sortedResults().results).map(makePoolStudentFromResult);
    });

    const poolRolls = createMemo(() => new Set(poolStudents().map((student) => student.roll)));

    const hasMultipleColleges = createMemo(() => new Set(poolStudents().map((s) => s.college)).size > 1);
    const hasMultipleSessions = createMemo(() => new Set(poolStudents().map((s) => s.session)).size > 1);

    const gridCols = createMemo(() => {
        const cols = ["4rem", "2fr", "1fr", "1fr"];
        if (hasMultipleColleges()) cols.push("1.5fr");
        if (hasMultipleSessions()) cols.push("1fr");
        cols.push("auto");
        return cols.join(" ");
    });

    function addStudents(students: PoolStudent[]) {
        setPoolStudents((current) => mergeStudents(current, students));
    }

    function addStudent(student: PoolStudent) {
        addStudents([student]);
    }

    function addAllFilteredStudents() {
        addStudents(availableStudents());
    }

    function removeStudent(roll: string) {
        setPoolStudents((current) => current.filter((student) => student.roll !== roll));
    }

    function addCustomStudent() {
        const name = customName().trim();
        const roll = customRoll().trim();

        if (!name || !roll) return;

        addStudents([makeCustomPoolStudent(name, roll)]);
        setCustomName("");
        setCustomRoll("");
    }

    function generateGroups() {
        const size = Math.max(1, Math.floor(Number(groupSize()) || 0));
        const shuffled = shuffleStudents(poolStudents());
        const groups: GeneratedGroup[] = [];

        for (let index = 0; index < shuffled.length; index += size) {
            groups.push({
                groupNumber: groups.length + 1,
                students: shuffled.slice(index, index + size),
            });
        }

        setGeneratedGroups(groups);
        setGeneratedOpen(true);
    }

    function downloadGroupsCsv() {
        const groups = generatedGroups();
        if (!groups.length) return;

        const csvFields = getCsvFields(groups.flatMap((group) => group.students));
        const headers = ["Group Number", "Student Name", "Roll", ...csvFields.map((field) => field.label)];
        const rows: string[][] = [];

        for (const group of groups) {
            for (const student of group.students) {
                rows.push([
                    String(group.groupNumber),
                    student.name,
                    student.roll,
                    ...csvFields.map((field) => {
                        const value = student[field.key];
                        if (typeof value === "string") return value;
                        if (typeof value === "number") return value.toString();
                        return "";
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
        setTimeout(() => URL.revokeObjectURL(url), 0);
    }

    return (
        <main class="grid gap-6 content-start pb-8">
            <div class="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div class="grid gap-1">
                    <h1 class="text-3xl font-bold text-normal-fg">Group Generator</h1>
                    <p class="text-dim-fg text-sm">Build randomized groups from the current filtered results.</p>
                </div>

                <button
                    type="button"
                    class={cn(
                        "flex items-center gap-2 shrink-0 font-medium rounded-full px-4 py-2 transition-all",
                        "border-2 border-transparent bg-accent-bg text-accent-bg-text hover:bg-transparent hover:border-border hover:text-normal-fg",
                        "focus-visible:bg-transparent focus-visible:border-border focus-visible:text-normal-fg",
                    )}
                    onClick={() => setPickerOpen(true)}
                >
                    Add Students
                </button>
            </div>

            <section class="grid gap-5">
                <div class="px-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div class="grid gap-2">
                        <h2 class="text-lg font-semibold text-normal-fg">Pool</h2>
                        <p class="text-sm text-dim-fg">
                            {poolStudents().length} {poolStudents().length === 1 ? "student" : "students"} selected.
                        </p>
                    </div>

                    <div class="grid gap-2">
                        <label for="group-size" class="text-sm font-medium text-normal-fg">
                            Students per group
                        </label>
                        <div class="flex flex-wrap gap-3">
                            <input
                                id="group-size"
                                type="number"
                                min="1"
                                value={groupSize()}
                                onInput={(e) => {
                                    const next = Number(e.currentTarget.value);
                                    setGroupSize(Number.isFinite(next) ? Math.max(1, Math.floor(next)) : 1);
                                }}
                                class="border-2 border-border focus:border-accent-bg rounded-lg px-3 py-1.5 w-24 outline-none transition-colors"
                            />

                            <button
                                type="button"
                                class={cn(
                                    "flex items-center justify-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-all",
                                    "bg-accent-bg text-accent-bg-text hover:bg-accent-bg/90 disabled:opacity-50 disabled:cursor-not-allowed",
                                )}
                                disabled={poolStudents().length === 0}
                                onClick={generateGroups}
                            >
                                Generate
                            </button>
                        </div>
                    </div>
                </div>

                <Show
                    when={poolStudents().length > 0}
                    fallback={
                        <div class="mx-6 grid place-items-center rounded-xl border border-dashed border-border bg-white py-10 text-center">
                            <p class="text-dim-fg">No students added yet.</p>
                            <button
                                type="button"
                                class="mt-3 rounded-full border-2 border-border px-4 py-2 font-medium hover:bg-accent-bg hover:text-accent-bg-text hover:border-accent-bg transition-all"
                                onClick={() => setPickerOpen(true)}
                            >
                                Add from results
                            </button>
                        </div>
                    }
                >
                    <div class="grid gap-0">
                        <div class="px-6 flex items-center justify-between gap-4 flex-wrap mb-3">
                            <h3 class="font-semibold text-normal-fg">Selected students</h3>
                            <button
                                type="button"
                                class="text-sm font-medium text-accent-fg underline underline-offset-[0.1lh]"
                                onClick={() => setPoolStudents([])}
                            >
                                <Trash2Icon class="w-4 h-4 inline-block mr-1" />
                                Clear all
                            </button>
                        </div>

                        <div class="overflow-x-auto w-full border-y border-border">
                            <div class="grid min-w-[62rem]" style={{ "grid-template-columns": gridCols() }}>
                                <div class="grid grid-cols-subgrid col-span-full border-b border-border bg-zinc-700 text-zinc-200 text-sm font-semibold *:px-4 *:py-3">
                                    <div>#</div>
                                    <div>Name</div>
                                    <div>Roll</div>
                                    <div>Branch</div>
                                    <Show when={hasMultipleColleges()}>
                                        <div>College</div>
                                    </Show>
                                    <Show when={hasMultipleSessions()}>
                                        <div>Session</div>
                                    </Show>
                                    <div />
                                </div>

                                <VirtualList
                                    items={poolStudents()}
                                    defaultRowHeight={48}
                                    containerProps={{ class: "grid col-span-full grid-cols-subgrid bg-white" }}
                                    RowComponent={(args) => (
                                        <div class={cn(args.class, "grid grid-cols-subgrid col-span-full items-center border-b border-border last:border-b-0 hover:bg-zinc-50/50 transition-colors *:px-4 *:py-2.5")}>
                                            <div class="text-sm text-dim-fg">{args.index + 1}</div>
                                            <div class="font-medium text-normal-fg">{args.item.name}</div>
                                            <div class="text-dim-fg tabular-nums">{getRegNoFromRoll(args.item.roll)}</div>
                                            <div>
                                                <BranchBadge branch={BRANCH_NAME[args.item.branch]} class="text-sm" />
                                            </div>
                                            <Show when={hasMultipleColleges()}>
                                                <div class="text-sm text-dim-fg" >{COLLEGE_NAME[args.item.college]}</div>
                                            </Show>
                                            <Show when={hasMultipleSessions()}>
                                                <div class="text-sm text-dim-fg tabular-nums">{args.item.session}</div>
                                            </Show>
                                            <div class="text-end">
                                                <button
                                                    type="button"
                                                    class="min-h-9 inline-flex items-center justify-center rounded-lg p-1 aspect-square text-rose-600 hover:bg-rose-50 transition-colors"
                                                    onClick={() => removeStudent(args.item.roll)}
                                                >
                                                    <XIcon class="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </Show>
            </section>

            <StudentPickerDialog
                open={pickerOpen()}
                onClose={() => setPickerOpen(false)}
                hook={resultsFilter}
                indexedData={indexedData()}
                availableStudents={availableStudents()}
                poolRolls={poolRolls()}
                onAddStudent={addStudent}
                onRemoveStudent={removeStudent}
                onAddAll={addAllFilteredStudents}
                customName={customName()}
                setCustomName={setCustomName}
                customRoll={customRoll()}
                setCustomRoll={setCustomRoll}
                onAddCustomStudent={addCustomStudent}
            />

            <GeneratedGroupsDialog
                open={generatedOpen()}
                onClose={() => setGeneratedOpen(false)}
                groups={generatedGroups()}
                onDownloadCsv={downloadGroupsCsv}
            />
        </main>
    );
}

function getCsvFields(students: PoolStudent[]) {
    const fields = [] as { key: keyof PoolStudent; label: string; }[];
    const branches = new Set(students.map((student) => student.branch));
    const colleges = new Set(students.map((student) => student.college));
    const sessions = new Set(students.map((student) => student.session));

    if (branches.size > 1) {
        fields.push({ label: "Branch", key: "branch" });
    }
    if (colleges.size > 1) {
        fields.push({ label: "College", key: "college" });
    }
    if (sessions.size > 1) {
        fields.push({ label: "Session", key: "session" });
    }

    return fields;
}