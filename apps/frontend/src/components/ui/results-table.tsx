import { type ParsedResult } from "@app/shared/types";
import ArrowDownWideNarrow from "lucide-solid/icons/arrow-down-wide-narrow";
import ArrowUpNarrowWide from "lucide-solid/icons/arrow-up-narrow-wide";
import { For, type Setter, Show, batch, createSignal } from "solid-js";
import { marksClass, sgpaClass } from "~/lib/grade-utils";
import { SortBy, SortOrder } from "~/lib/types";
import { OrdinalSuffix, cn } from "../utils";
import { DetailsDialog } from "./details-dialog";
import "./results-table.css";

interface ResultsListTableProps {
    sortBy: SortBy;
    setSortBy: Setter<SortBy>;

    sortOrder: SortOrder;
    setSortOrder: Setter<SortOrder>;

    displayedResults: ParsedResult[];
    totalItems: number;
}

export function ResultsListTable(props: ResultsListTableProps) {
    const [dialogOpen, setDialogOpen] = createSignal(false);
    const [selectedRoll, setSelectedRoll] = createSignal<string | null>(null);

    // Find the current data by roll number to handle list changes while dialog is open
    const dialogData = () => {
        const roll = selectedRoll();
        if (!roll) return undefined;
        return props.displayedResults.find((r) => r.student.roll === roll);
    };

    return (
        <div>
            <Show
                when={props.displayedResults.length > 0}
                fallback={
                    <div class="flex flex-col items-center justify-center gap-2 py-16 text-dim-fg">
                        <span class="text-xl font-semibold">No results found</span>
                        <span class="text-sm">Try adjusting your search or filters</span>
                    </div>
                }
            >
                <div class="text-sm text-dim-fg px-6 py-2 border-b border-border bg-zinc-50">
                    Showing {props.displayedResults.length} of {props.totalItems}{" "}
                    {props.displayedResults.length !== 1 ? "results" : "result"}
                </div>

                <div class="grid gap-x-8 grid-cols-[max-content_1fr_1fr_1fr_1fr_1fr] [&>div>*:first-child]:ps-6 [&>div>*:last-child]:pe-6">
                    <div class="grid col-span-full grid-cols-subgrid gap-x-0 *:px-4 *:py-3 border-b border-border bg-zinc-700 text-zinc-200">
                        <div>
                            <strong>Sl no</strong>
                        </div>

                        <SortableHeaderItem
                            title="Roll No"
                            value={SortBy.Roll}
                            sortBy={props.sortBy}
                            setSortBy={props.setSortBy}
                            sortOrder={props.sortOrder}
                            setSortOrder={props.setSortOrder}
                        />
                        <SortableHeaderItem
                            title="Name"
                            value={SortBy.Name}
                            sortBy={props.sortBy}
                            setSortBy={props.setSortBy}
                            sortOrder={props.sortOrder}
                            setSortOrder={props.setSortOrder}
                        />

                        <div>
                            <strong>Branch</strong>
                        </div>

                        <SortableHeaderItem
                            title="Marks"
                            value={SortBy.Marks}
                            sortBy={props.sortBy}
                            setSortBy={props.setSortBy}
                            sortOrder={props.sortOrder}
                            setSortOrder={props.setSortOrder}
                        />
                        <SortableHeaderItem
                            title="SGPA"
                            value={SortBy.sgpa}
                            sortBy={props.sortBy}
                            setSortBy={props.setSortBy}
                            sortOrder={props.sortOrder}
                            setSortOrder={props.setSortOrder}
                        />
                    </div>

                    <For each={props.displayedResults}>
                        {(item, index) => (
                            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                            <div
                                class="grid items-center col-span-full grid-cols-subgrid py-3 border-b border-border hover:bg-zinc-100 cursor-pointer"
                                onClick={() => {
                                    setSelectedRoll(item.student.roll);
                                    setDialogOpen(true);
                                }}
                            >
                                <span class="text-dim-fg">{index() + 1}</span>
                                <span class="text-dim-fg">{item.student.roll}</span>
                                <span class="">{item.student.name}</span>
                                <div>
                                    <span
                                        class={`branch-badge ${item.student.branch.toLowerCase()} inline-block ps-2 pe-0.5 rounded-lg text-sm`}
                                    >
                                        {item.student.branch}
                                        <em class="inline-block not-italic ms-1 px-1.5 py-0.5 my-0.5 bg-white/75 rounded-md">
                                            {item.student.roll.charAt(0)}
                                            {OrdinalSuffix(item.student.roll.charAt(0))} sem
                                        </em>
                                    </span>
                                </div>
                                <div>
                                    <span
                                        class={cn(
                                            "font-medium text-lg",
                                            marksClass(
                                                item.grandTotal.obtained,
                                                item.grandTotal.maximum,
                                            ),
                                        )}
                                    >
                                        {item.grandTotal.obtained}
                                    </span>{" "}
                                    <span class="text-sm text-dim-fg">
                                        /{item.grandTotal.maximum}
                                    </span>
                                </div>
                                <span class={cn("font-medium", sgpaClass(item.sgpa))}>
                                    {item.sgpa.toFixed(2)}
                                </span>
                            </div>
                        )}
                    </For>
                </div>
            </Show>

            <DetailsDialog
                open={dialogOpen()}
                onClose={() => {
                    setSelectedRoll(null);
                    setDialogOpen(false);
                }}
                data={dialogData()}
            />
        </div>
    );
}

interface SortableHeaderItemProps {
    title: string;
    value: SortBy;

    sortBy: SortBy;
    setSortBy: Setter<SortBy>;
    sortOrder: SortOrder;
    setSortOrder: Setter<SortOrder>;
}

function SortableHeaderItem(props: SortableHeaderItemProps) {
    return (
        <button
            type="button"
            class={cn(
                "h-full rounded-none justify-between text-start", // reset defaults
                "grid grid-cols-[1fr_min-content] items-center hover:bg-zinc-950 cursor-pointer transition-colors",
            )}
            onclick={() => {
                if (props.sortBy === props.value) {
                    props.setSortOrder(
                        props.sortOrder === SortOrder.Ascending
                            ? SortOrder.Descending
                            : SortOrder.Ascending,
                    );
                } else {
                    batch(() => {
                        props.setSortBy(props.value);
                        props.setSortOrder(() => {
                            switch (props.value) {
                                case SortBy.Name:
                                case SortBy.Roll:
                                    return SortOrder.Ascending;
                                case SortBy.Marks:
                                case SortBy.sgpa:
                                    return SortOrder.Descending;
                                default:
                                    return SortOrder.Descending;
                            }
                        });
                    });
                }
            }}
        >
            <strong>{props.title}</strong>
            <Show when={props.sortBy === props.value}>
                <Show
                    when={props.sortOrder === SortOrder.Descending}
                    fallback={<ArrowUpNarrowWide class="text-accent-fg-light" />}
                >
                    <ArrowDownWideNarrow class="text-accent-fg-light" />
                </Show>
            </Show>
        </button>
    );
}
