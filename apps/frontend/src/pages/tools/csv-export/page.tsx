/** biome-ignore-all lint/a11y/useFocusableInteractive: f a11y */
/** biome-ignore-all lint/a11y/useSemanticElements: f a11y */

import type { EncodedData, EncodedResultT } from "@app/shared/encoder";
import { getVal, getValSub } from "@app/shared/encoder/helpers";
import { BRANCH_NAME, COLLEGE_NAME, PAPER_TYPE } from "@app/shared/types";
import { getBranchFromRoll, getCollegeFromRoll } from "@app/shared/utils";
import { useSearchParams } from "@solidjs/router";
import FileSpreadsheetIcon from "lucide-solid/icons/file-spreadsheet";
import PlusIcon from "lucide-solid/icons/plus";
import Trash2Icon from "lucide-solid/icons/trash-2";
import { createEffect, createMemo, createSignal, For, onMount, Show } from "solid-js";
import { ResultsFilter } from "~/components/misc/results-filter/component";
import { useResultsFilter } from "~/components/misc/results-filter/hook";
import VirtualList from "~/components/misc/virtual-list";
import { Select } from "~/components/ui/select";
import { cn } from "~/components/utils";
import { useIndexedResults } from "~/lib/hooks/index-results";
import { useResults } from "~/providers/results";
import { generateCSV } from "./gen-csv";

export default function CsvExportPage() {
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

const CSV_FIELDS = [
    {
        key: "roll",
        label: "Roll Number",
        extract(result: EncodedResultT) {
            return getVal(result, "roll");
        },
    },
    {
        key: "name",
        label: "Name",
        extract(result: EncodedResultT) {
            return getVal(result, "name");
        },
    },
    {
        key: "branchName",
        label: "Branch",
        extract(result: EncodedResultT) {
            const roll = getVal(result, "roll");
            return BRANCH_NAME[getBranchFromRoll(roll)];
        },
    },
    {
        key: "collegeName",
        label: "College",
        extract(result: EncodedResultT) {
            const roll = getVal(result, "roll");
            return COLLEGE_NAME[getCollegeFromRoll(roll)];
        },
    },
    {
        key: "totalMarksObtained",
        label: "Marks Obtained",
        extract(result: EncodedResultT) {
            return getVal(result, "grandTotalObtained").toString();
        },
    },
    {
        key: "totalMarksMax",
        label: "Maximum Marks",
        extract(result: EncodedResultT) {
            return getVal(result, "grandTotalMax").toString();
        },
    },
    {
        key: "percentObtained",
        label: "Percentage",
        extract(result: EncodedResultT) {
            const obtained = getVal(result, "grandTotalObtained");
            const max = getVal(result, "grandTotalMax");
            return ((obtained / max) * 100).toFixed(2).toString();
        },
    },
    {
        key: "sgpa",
        label: "SGPA",
        extract(result: EncodedResultT) {
            return getVal(result, "sgpa").toString();
        },
    },
    {
        key: "cgpa",
        label: "CGPA",
        extract(result: EncodedResultT) {
            return getVal(result, "cgpa")?.toString();
        },
    },
    {
        key: "remarks",
        label: "Remarks",
        extract(result: EncodedResultT, data: EncodedData) {
            return data.remarks[getVal(result, "remarks")];
        },
    },
    {
        key: "carrySubjects",
        label: "Carry Subjects",
        extract(result: EncodedResultT, data: EncodedData) {
            const subjects = getVal(result, "subjects");
            const sgpa = getVal(result, "sgpa");
            if (sgpa > 0) return "";

            const carrySubjects = subjects.filter((sub) => {
                return (
                    getValSub(sub, "type") === PAPER_TYPE.THEORY &&
                    getValSub(sub, "externalObtained") < getValSub(sub, "externalPassing")
                );
            });

            const carrySubs: string[] = [];
            for (const sub of carrySubjects) {
                carrySubs.push(data.subjects[getValSub(sub, "name")]);
            }

            return carrySubs.join(", ");
        },
    },
] as const;

type ValidKeys = (typeof CSV_FIELDS)[number]["key"];

function PageContents(props: { encodedData: EncodedData }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const indexedData = useIndexedResults(props.encodedData);
    const res = useResultsFilter(props.encodedData);

    const selectedFields = () => {
        let fields = searchParams.fields;
        if (!fields) return [];

        if (Array.isArray(fields)) fields = fields[0];
        return getValidCsvKeys(fields.split("__"));
    };
    const setSelectedFields = (fields: ValidKeys[]) => {
        const validKeys = getValidCsvKeys(fields);
        setSearchParams({ fields: validKeys.length > 0 ? validKeys.join("__") : null });
    };
    onMount(() => {
        if (!searchParams.fields) {
            setSelectedFields(["roll", "name", "totalMarksObtained", "sgpa"]);
        }
    });

    const availableAddOptions = createMemo(() => {
        const selected = selectedFields();
        return CSV_FIELDS.filter((f) => !selected.includes(f.key));
    });
    const [addField, setAddField] = createSignal(availableAddOptions()[0]?.key || "");
    createEffect(() => {
        const addF = addField();
        if (!availableAddOptions().some((opt) => opt.key === addF)) {
            setAddField(availableAddOptions()[0]?.key || "");
        }
    });

    function handleCSVExport() {
        const headers = selectedFields().map((key) => {
            const fieldDef = CSV_FIELDS.find((f) => f.key === key);
            if (!fieldDef) throw new Error(`Invalid CSV field key: ${key}`);
            return fieldDef.label;
        });

        const results = res.sortedResults().results;
        const selected = selectedFields();
        const rows: string[][] = [];

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const row: string[] = [];

            for (const key of selected) {
                const fieldDef = CSV_FIELDS.find((f) => f.key === key);
                if (!fieldDef) throw new Error(`Invalid CSV field key: ${key}`);

                const value = fieldDef.extract(result, props.encodedData);
                row.push(value ?? "");
            }
            rows.push(row);
        }

        const csvContent = generateCSV(headers, rows);

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "results.csv");
        link.click();
    }

    return (
        <main class="grid gap-4 content-start px-6">
            <div class="py-4 flex justify-between items-center">
                <h1 class="text-3xl font-bold text-normal-fg">CSV Export</h1>

                <button
                    type="button"
                    class={cn(
                        "flex items-center gap-2 shrink-0 font-medium rounded-full px-4 transition-all",
                        "border-2 border-transparent bg-accent-bg text-accent-bg-text hover:bg-transparent hover:border-border hover:text-normal-fg",
                        "focus-visible:bg-transparent focus-visible:border-border focus-visible:text-normal-fg",
                    )}
                    onClick={handleCSVExport}
                >
                    <FileSpreadsheetIcon class="w-[1.2em] h-[1.2em] mbs-[-0.15em]" />
                    <span style="text-box: trim-both cap alphabetic;">Export CSV</span>
                </button>
            </div>

            <div id="results" class="grid">
                <div class="grid grid-cols-1 xl:grid-cols-[4fr_3fr_3fr_3fr_4fr] gap-x-2.5 gap-y-4 py-4 pbe-6 *:first:col-span-full">
                    <ResultsFilter hook={res} indexedData={indexedData()} alwaysShowSort />
                </div>

                <div class="flex items-center justify-between flex-wrap gap-4 pbs-6">
                    <p class="text-dim-fg text-sm">
                        Includes <span class="font-medium">{res.sortedResults().results.length}</span> of{" "}
                        <span class="font-medium">{props.encodedData.results.length} </span>
                        {res.sortedResults().results.length !== 1 ? "results" : "result"}
                    </p>

                    <Show
                        when={availableAddOptions().length > 0}
                        fallback={
                            <button
                                type="button"
                                class={cn(
                                    "flex shrink-0 items-center gap-2 font-medium text-sm text-dim-fg transition-all",
                                    "hover:bg-rose-500 hover:text-white focus-visible:bg-rose-500 focus-visible:text-white",
                                )}
                                onClick={() => setSelectedFields([])}
                            >
                                <Trash2Icon />
                                <span style="text-box: trim-both cap alphabetic;">Clear All Fields</span>
                            </button>
                        }
                    >
                        <div class="flex items-center gap-2 flex-wrap">
                            <Select
                                value={addField()}
                                onChange={setAddField}
                                options={availableAddOptions().map((f) => ({
                                    label: f.label,
                                    value: f.key,
                                }))}
                                class="w-fit border-2 min-w-[10ch] border-border focus:border-accent-bg"
                            />
                            <button
                                type="button"
                                class="flex items-center gap-2 font-medium rounded-md px-4 transition-all bg-accent-bg text-accent-bg-text hover:brightness-90"
                                onClick={() => {
                                    setSelectedFields([...selectedFields(), addField()]);
                                }}
                            >
                                <PlusIcon />
                                <span style="text-box: trim-both cap alphabetic;">Add</span>
                            </button>
                        </div>
                    </Show>
                </div>

                <PreviewCsv
                    encodedData={props.encodedData}
                    results={res.sortedResults().results}
                    selectedFields={selectedFields()}
                    setSelectedFields={setSelectedFields}
                />
            </div>
        </main>
    );
}

function getValidCsvKeys(keys: string[]) {
    const validFields: ValidKeys[] = [];
    for (const key of keys) {
        if (!validFields.includes(key as ValidKeys) && CSV_FIELDS.some((f) => f.key === key)) {
            validFields.push(key as ValidKeys);
        }
    }

    return validFields;
}

interface PreviewCsvProps {
    encodedData: EncodedData;
    results: EncodedResultT[];
    selectedFields: ValidKeys[];
    setSelectedFields: (fields: ValidKeys[]) => void;
}

function PreviewCsv(props: PreviewCsvProps) {
    function removeField(field: ValidKeys) {
        const newFields = props.selectedFields.filter((f) => f !== field);
        props.setSelectedFields(newFields);
    }

    return (
        <Show
            when={props.selectedFields.length > 0}
            fallback={
                <div class="grid place-items-center h-96">
                    <p class="text-dim-fg text-lg">No fields selected. Select some fields to preview the CSV.</p>
                </div>
            }
        >
            <div class="max-w-stretch overflow-x-auto my-4" style="scrollbar-width: thin;">
                <div
                    role="table"
                    class="grid w-full border-t border-l border-border text-[0.925rem]"
                    style={{
                        "grid-template-columns": `repeat(${props.selectedFields.length}, auto)`,
                    }}
                >
                    <div role="rowgroup" class="contents">
                        <div role="row" class="grid grid-cols-subgrid col-span-full">
                            <For each={props.selectedFields}>
                                {(field) => {
                                    const fieldDef = CSV_FIELDS.find((f) => f.key === field);
                                    if (!fieldDef) return null;

                                    return (
                                        <div
                                            role="columnheader"
                                            class="flex items-center justify-between gap-4 ps-3 pe-2 py-2 border-be border-e border-border bg-accent-bg text-accent-bg-text"
                                        >
                                            <span class="inline-block w-max max-w-[24ch] font-semibold">
                                                {fieldDef.label}
                                            </span>

                                            <button
                                                type="button"
                                                class={cn(
                                                    "flex items-center justify-center w-fit min-h-0 p-0 h-8 aspect-square transition-all",
                                                    "hover:bg-white focus-visible:bg-white hover:text-rose-500 focus-visible:text-rose-500",
                                                )}
                                                onClick={() => removeField(fieldDef.key)}
                                            >
                                                <Trash2Icon class="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                }}
                            </For>
                        </div>
                    </div>

                    <VirtualList
                        items={props.results}
                        defaultRowHeight={32}
                        containerProps={{
                            role: "rowgroup",
                            class: "grid grid-cols-subgrid col-span-full text-normal-fg",
                        }}
                        RowComponent={(args) => (
                            <div role="row" class={cn(args.class, "grid grid-cols-subgrid col-span-full")}>
                                <For each={props.selectedFields}>
                                    {(field) => {
                                        const fieldDef = CSV_FIELDS.find((f) => f.key === field);
                                        if (!fieldDef) return null;

                                        const value = fieldDef.extract(args.item, props.encodedData);

                                        return (
                                            <div role="cell" class="border-be border-e border-border px-3 py-2">
                                                <span class="inline-block w-max">{value}</span>
                                            </div>
                                        );
                                    }}
                                </For>
                            </div>
                        )}
                    />
                </div>
            </div>
        </Show>
    );
}
