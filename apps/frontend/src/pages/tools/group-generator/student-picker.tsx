import type { EncodedResultT } from "@app/shared/encoder";
import PlusIcon from "lucide-solid/icons/plus";
import Trash2Icon from "lucide-solid/icons/trash-2";
import XIcon from "lucide-solid/icons/x";
import { createSignal, Show } from "solid-js";
import { ResultsFilter } from "~/components/misc/results-filter/component";
import type { useResultsFilter } from "~/components/misc/results-filter/hook";
import { FilterParams } from "~/components/misc/results-filter/types";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import type { useIndexedResults } from "~/lib/hooks/index-results";
import { getStudentId } from "./helpers";
import { PreviewTable } from "./table";

interface StudentPickerDialogProps {
    isOpen: boolean;
    onClose: () => void;

    indexedData: ReturnType<ReturnType<typeof useIndexedResults>>;
    resultsFilter: ReturnType<typeof useResultsFilter>;

    selectedStudents: EncodedResultT[];
    onAdd: (students: EncodedResultT[]) => void;
    onRemove: (id: string) => void;
}

export function StudentPickerDialog(props: StudentPickerDialogProps) {
    const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement | undefined>();
    const filteredResults = () => props.resultsFilter.sortedResults().results;
    const selectedStudentIds = () => props.selectedStudents.map(getStudentId);

    function handleAddAll() {
        props.onAdd(filteredResults());
        props.onClose();
    }

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.onClose}
            dialogProps={{
                class: "rounded-lg max-w-[100vw] sm:max-w-[calc(100vw-4rem)]",
                ref: (el) => setDialogRef(el),
            }}
        >
            <div class="flex items-center justify-between p-4 border-be-[0.07rem] border-border">
                <h2 class="text-xl font-bold text-normal-fg">Select Students</h2>

                <Button variant="secondary" size="icon" class="rounded-full" onClick={props.onClose}>
                    <XIcon class="w-5 h-5" />
                </Button>
            </div>

            <div class="grid gap-4">
                <div class="@container grid gap-4 p-6">
                    <div class="flex flex-wrap items-center justify-between gap-4">
                        <div class="grid gap-1">
                            <h3 class="font-semibold text-normal-fg">Add From Results</h3>
                            <p class="fg">Filter and select students from the existing results data.</p>
                        </div>

                        <Button variant="primary-alt" onClick={handleAddAll} class="text-sm">
                            <PlusIcon />
                            Add All Filtered ({filteredResults().length})
                        </Button>
                    </div>

                    <div class="grid grid-cols-1 @min-desktop:grid-cols-[4fr_3fr_2fr_3fr] gap-x-2.5 gap-y-4 py-2 *:first:col-span-full">
                        <ResultsFilter
                            hook={props.resultsFilter}
                            indexedData={props.indexedData}
                            alwaysShowSort
                            hideFilters={[FilterParams.SEMESTER]}
                        />
                    </div>
                </div>

                <PreviewTable
                    results={filteredResults()}
                    scrollElement={dialogRef()}
                    selectedStudentIds={selectedStudentIds()}
                    actionButton={(args) => {
                        const studentId = getStudentId(args.item);
                        const isAdded = () => selectedStudentIds().includes(studentId);
                        return (
                            <Show
                                when={isAdded()}
                                fallback={
                                    <Button
                                        variant="primary-alt-hover"
                                        size="icon-sm"
                                        onClick={() => props.onAdd([args.item])}
                                        class="text-lg"
                                    >
                                        <PlusIcon />
                                    </Button>
                                }
                            >
                                <Button
                                    variant="danger-alt-hover"
                                    size="icon-sm"
                                    onClick={() => props.onRemove(studentId)}
                                >
                                    <Trash2Icon />
                                </Button>
                            </Show>
                        );
                    }}
                />
            </div>
        </Dialog>
    );
}
