import type { EncodedData, EncodedResultT } from "@app/shared/encoder";
import PlusIcon from "lucide-solid/icons/plus";
import Trash2Icon from "lucide-solid/icons/trash-2";
import { createSignal, Show } from "solid-js";
import { Dice5Icon } from "~/components/icons/dice-5";
import { useResultsFilter } from "~/components/misc/results-filter/hook";
import { Button } from "~/components/ui/button";
import { useIndexedResults } from "~/lib/hooks/index-results";
import { useResults } from "~/providers/results";
import GeneratedGroupsDialog from "./groups-dialog";
import { generateGroups, getStudentId, getUniqueResults, makeGroupStudents, mergeResults } from "./helpers";
import { StudentPickerDialog } from "./student-picker";
import { PreviewTable } from "./table";
import type { GeneratedGroup } from "./types";

export default function RandomGroupGeneratorPage() {
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
    const uniqueResults = () => {
        return {
            remarks: props.encodedData.remarks,
            subjects: props.encodedData.subjects,
            results: getUniqueResults(props.encodedData.results),
        } satisfies EncodedData;
    };

    const indexedData = useIndexedResults(uniqueResults());
    const pickerResultsFilter = useResultsFilter(uniqueResults());

    const [groupSize, setGroupSize] = createSignal(4);
    const [pickerOpen, setPickerOpen] = createSignal(false);
    const [selectedStudents, setSelectedStudents] = createSignal<EncodedResultT[]>([]);

    function addStudents(list: EncodedResultT[]) {
        setSelectedStudents((prev) => mergeResults(prev, list));
    }

    function removeStudent(targetId: string) {
        setSelectedStudents((prev) => prev.filter((res) => getStudentId(res) !== targetId));
    }

    function removeAllStudents() {
        setSelectedStudents([]);
    }

    const [groupsDialogOpen, setGroupsDialogOpen] = createSignal(false);
    const [generatedGroups, setGeneratedGroups] = createSignal<GeneratedGroup[]>([]);

    function handleGenerateBtnClick() {
        const size = groupSize();
        const studentOptions = makeGroupStudents(selectedStudents());

        setGeneratedGroups(generateGroups(studentOptions, size));
        setGroupsDialogOpen(true);
    }

    return (
        <main class="grid gap-6 content-start pb-8">
            <div class="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div class="grid gap-1">
                    <h1 class="text-3xl font-bold text-normal-fg">Group Generator</h1>
                    <p class="text-dim-fg text-sm">Build randomized groups from the current filtered results.</p>
                </div>

                <Button variant="primary-alt" class="rounded-full" onClick={() => setPickerOpen(true)}>
                    <PlusIcon />
                    Add Students
                </Button>
            </div>

            <section class="grid gap-6">
                <Show
                    when={selectedStudents().length > 0}
                    fallback={
                        <div class="mx-6 grid place-content-center justify-items-center gap-4 rounded-xl border border-dashed border-border bg-white py-10">
                            <p class="text-dim-fg">No students added yet.</p>
                            <Button variant="primary-alt" class="rounded-full" onClick={() => setPickerOpen(true)}>
                                <PlusIcon />
                                Add from results
                            </Button>
                        </div>
                    }
                >
                    <div class="px-6 flex flex-wrap items-stretch justify-between">
                        <div class="flex flex-col justify-between">
                            <h2 class="text-lg font-semibold text-normal-fg">Selected students</h2>
                            <div class="flex items-center gap-4">
                                <p class="text-sm text-dim-fg">
                                    {selectedStudents().length}{" "}
                                    {selectedStudents().length === 1 ? "student" : "students"} selected
                                </p>

                                <span class="text-border">|</span>

                                <Button
                                    variant="danger-muted"
                                    size="sm"
                                    class="min-h-0 px-0 hover:bg-transparent hover:underline"
                                    onClick={removeAllStudents}
                                >
                                    <Trash2Icon class="text-[0.83em]" />
                                    Remove All
                                </Button>
                            </div>
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
                                    onChange={(e) => {
                                        const val = Number.parseInt(e.currentTarget.value, 10);
                                        setGroupSize(Number.isFinite(val) ? Math.max(1, Math.floor(val)) : 1);
                                    }}
                                    class="ring-0 focus:border-accent-bg rounded-lg px-3 py-1.5 w-[8ch] outline-none transition-colors"
                                />

                                <Button
                                    variant="primary"
                                    class="gap-2"
                                    disabled={selectedStudents().length === 0}
                                    onClick={handleGenerateBtnClick}
                                >
                                    <Dice5Icon class="text-lg" />
                                    Generate
                                </Button>
                            </div>
                        </div>
                    </div>

                    <PreviewTable
                        results={selectedStudents()}
                        isSelectedList={true}
                        actionButton={(args) => {
                            return (
                                <Button
                                    variant="danger-muted"
                                    size="icon-sm"
                                    onClick={() => removeStudent(getStudentId(args.item))}
                                >
                                    <Trash2Icon />
                                </Button>
                            );
                        }}
                    />
                </Show>
            </section>

            <StudentPickerDialog
                isOpen={pickerOpen()}
                onClose={() => setPickerOpen(false)}
                indexedData={indexedData()}
                resultsFilter={pickerResultsFilter}
                selectedStudents={selectedStudents()}
                onAdd={addStudents}
                onRemove={removeStudent}
            />

            <GeneratedGroupsDialog
                isOpen={groupsDialogOpen()}
                onClose={() => setGroupsDialogOpen(false)}
                groups={generatedGroups()}
            />
        </main>
    );
}
