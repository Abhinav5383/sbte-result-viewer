import { type ParsedResult } from "@app/shared/types";
import ArrowDownWideNarrow from "lucide-solid/icons/arrow-down-wide-narrow";
import ArrowUpWideNarrow from "lucide-solid/icons/arrow-up-wide-narrow";
import ChevronUpIcon from "lucide-solid/icons/chevron-up";
import {
    For,
    type Setter,
    Show,
    batch,
    createEffect,
    createMemo,
    createSignal,
    onCleanup,
    onMount,
} from "solid-js";
import { marksClass, sgpaClass } from "~/lib/grade-utils";
import { type Filters, SortBy, SortOrder } from "~/lib/types";
import { OrdinalSuffix, cn } from "../utils";
import { DetailsDialog } from "./details-dialog";
import "./results-table.css";

interface ResultsListTableProps {
    totalItems: number;
    sortedResults: SortedResults;

    setSortBy: Setter<SortBy>;
    setSortOrder: Setter<SortOrder>;

    maxStrSizes: {
        // name: number;
        // college: number;
        branch: number;
    };

    filters: Filters;
}

interface SortedResults {
    results: ParsedResult[];
    sortedBy: SortBy;
    sortOrder: SortOrder;
}

export function ResultsListTable(props: ResultsListTableProps) {
    const [dialogOpen, setDialogOpen] = createSignal(false);
    const [selectedRoll, setSelectedRoll] = createSignal<string | null>(null);

    function dialogData() {
        const roll = selectedRoll();
        if (!roll) return undefined;
        return props.sortedResults.results.find((r) => r.student.roll === roll);
    }

    const showCollegeCol = () => !props.filters.college;

    return (
        <div>
            <Show
                when={props.sortedResults.results.length > 0}
                fallback={
                    <div class="flex flex-col items-center justify-center gap-2 py-16 text-dim-fg">
                        <span class="text-xl font-semibold">No results found</span>
                        <span class="text-sm">Try adjusting your search or filters</span>
                    </div>
                }
            >
                <div class="text-sm text-dim-fg px-6 py-2 border-b border-border bg-zinc-50">
                    Showing {props.sortedResults.results.length} of {props.totalItems}{" "}
                    {props.sortedResults.results.length !== 1 ? "results" : "result"}
                </div>

                <div
                    class="block lg:grid gap-x-8 relative justify-between"
                    style={{
                        // adding extra for the semester suffix + spacing
                        "--max-branch-len": `${props.maxStrSizes.branch + 10}ch`,
                        "grid-template-columns": `minmax(8ch, max-content) minmax(max-content, 1fr) minmax(14ch, 0.5fr) minmax(max-content, 0.7fr) minmax(max-content, 0.7fr) minmax(var(--max-branch-len), 1fr) ${
                            showCollegeCol() ? "minmax(max-content, 2fr)" : ""
                        }`,
                    }}
                >
                    <div class="hidden lg:grid z-10 sticky top-0 col-span-full grid-cols-subgrid gap-x-0 *:px-4 *:py-3 border-b border-border bg-zinc-700 text-zinc-200">
                        <div>
                            <strong>#</strong>
                        </div>

                        <SortableHeaderItem
                            title="Name"
                            value={SortBy.Name}
                            sortBy={props.sortedResults.sortedBy}
                            setSortBy={props.setSortBy}
                            sortOrder={props.sortedResults.sortOrder}
                            setSortOrder={props.setSortOrder}
                        />

                        <SortableHeaderItem
                            title="Roll No"
                            value={SortBy.Roll}
                            sortBy={props.sortedResults.sortedBy}
                            setSortBy={props.setSortBy}
                            sortOrder={props.sortedResults.sortOrder}
                            setSortOrder={props.setSortOrder}
                        />

                        <SortableHeaderItem
                            title="Marks"
                            value={SortBy.Marks}
                            sortBy={props.sortedResults.sortedBy}
                            setSortBy={props.setSortBy}
                            sortOrder={props.sortedResults.sortOrder}
                            setSortOrder={props.setSortOrder}
                        />

                        <SortableHeaderItem
                            title="SGPA"
                            value={SortBy.sgpa}
                            sortBy={props.sortedResults.sortedBy}
                            setSortBy={props.setSortBy}
                            sortOrder={props.sortedResults.sortOrder}
                            setSortOrder={props.setSortOrder}
                        />

                        <div>
                            <strong>Branch</strong>
                        </div>

                        <Show when={showCollegeCol()}>
                            <div>
                                <strong>College</strong>
                            </div>
                        </Show>
                    </div>

                    <ResultTableContents
                        sortedResults={props.sortedResults}
                        onSelect={(roll) => {
                            setSelectedRoll(roll);
                            setDialogOpen(true);
                        }}
                        showCollege={showCollegeCol()}
                    />
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
            onClick={() => {
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
                    fallback={<ArrowUpWideNarrow class="text-accent-fg-light" />}
                >
                    <ArrowDownWideNarrow class="text-accent-fg-light" />
                </Show>
            </Show>
        </button>
    );
}

interface ResultTableContentsProps {
    sortedResults: SortedResults;
    onSelect: (roll: string) => void;
    showCollege: boolean;
}

function ResultTableContents(props: ResultTableContentsProps) {
    const DEFAULT_ROW_HEIGHT = 52;

    const [rowHeight, setRowHeight] = createSignal<number>(DEFAULT_ROW_HEIGHT);
    const [containerRef, setContainerRef] = createSignal<HTMLDivElement | undefined>();
    const [visibleIndices, setVisibleIndices] = createSignal({ start: 0, end: 0 });

    function handleResize(parent: HTMLDivElement) {
        const row = parent.querySelector<HTMLDivElement>(".result-row");
        if (!row) return;

        const height = row.getBoundingClientRect().height;
        if (height && height !== rowHeight()) {
            setRowHeight(height);
            handleScroll(undefined, height);
        }
    }

    function handleScroll(_e?: Event, rHeight = rowHeight()) {
        const scrollContainer = containerRef();

        const containerTop = scrollContainer?.getBoundingClientRect().top ?? 0;
        const containerYScroll = Math.max(0, -containerTop);

        const startIndex = Math.floor(containerYScroll / rHeight);
        const endIndex = Math.ceil((containerYScroll + window.innerHeight) / rHeight);

        const overscan = endIndex - startIndex; // overscan by one viewport height
        const adjustedStartIndex = Math.max(0, startIndex - overscan);
        const adjustedEndIndex = Math.min(
            props.sortedResults.results.length - 1,
            endIndex + overscan,
        );

        setVisibleIndices({ start: adjustedStartIndex, end: adjustedEndIndex });
    }

    onMount(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });

        const container = containerRef();
        let observer: ResizeObserver | null = null;
        if (container) {
            observer = new ResizeObserver(() => handleResize(container));
            observer.observe(container);
            handleResize(container);
        }

        onCleanup(() => {
            window.removeEventListener("scroll", handleScroll);
            if (observer) observer.disconnect();
        });
    });

    createEffect(() => {
        const paddingTop = visibleIndices().start * rowHeight();
        const paddingBottom =
            (props.sortedResults.results.length - (visibleIndices().end + 1)) * rowHeight();

        const el = containerRef();
        if (el) {
            el.style.paddingTop = `${paddingTop}px`;
            el.style.paddingBottom = `${paddingBottom}px`;
        }
    });

    createEffect(() => {
        props.sortedResults.results;
        handleScroll();
    });

    // computed values
    const visibleItems = createMemo(() => {
        const items = [];
        for (let i = visibleIndices().start; i <= visibleIndices().end; i++) {
            const item = props.sortedResults.results[i];
            if (item) items.push(item);
        }
        return items;
    });

    return (
        <>
            <div ref={setContainerRef} class="grid col-span-full grid-cols-subgrid">
                <For each={visibleItems()}>
                    {(item, index) => (
                        <ResultRow
                            item={item}
                            index={visibleIndices().start + index()}
                            onSelect={() => props.onSelect(item.student.roll)}
                            showCollege={props.showCollege}
                        />
                    )}
                </For>
            </div>

            <div
                class="fixed bottom-4 end-4"
                style={{
                    visibility:
                        visibleIndices().start > 15 &&
                        visibleIndices().end < props.sortedResults.results.length - 15
                            ? "visible"
                            : "hidden",
                }}
            >
                <button
                    type="button"
                    class="flex items-center justify-center bg-accent-bg text-white h-12 aspect-square rounded-full"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <ChevronUpIcon class="size-6" />
                </button>
            </div>
        </>
    );
}

interface ResultRowProps {
    item: ParsedResult;
    index: number;
    onSelect: () => void;
    showCollege: boolean;
}

function calcPercentObtained(obtained: number, maximum: number) {
    if (maximum <= 0) return 0;
    return Math.round((obtained / maximum) * 100_00) / 100;
}

function ResultRow(props: ResultRowProps) {
    const commonProps = () => ({
        item: props.item,
        index: props.index,
        onSelect: props.onSelect,
        showCollege: props.showCollege,

        semester: props.item.student.roll.charAt(0),
        formattedSgpa: props.item.sgpa.toFixed(2),
        marksClassName: marksClass(props.item.grandTotal.obtained, props.item.grandTotal.maximum),
        sgpaClassName: sgpaClass(props.item.sgpa),
        percentObtained: calcPercentObtained(
            props.item.grandTotal.obtained,
            props.item.grandTotal.maximum,
        ),
    });

    return (
        <div class="result-row grid col-span-full grid-cols-subgrid">
            <MobileResultRow {...commonProps()} />
            <DesktopResultRow {...commonProps()} />
        </div>
    );
}

interface RowVariantProps extends ResultRowProps {
    semester: string;
    formattedSgpa: string;
    marksClassName: string;
    sgpaClassName: string;
    percentObtained: number;
}

function MobileResultRow(props: RowVariantProps) {
    return (
        <div
            class="lg:hidden grid grid-cols-[max-content_1fr] gap-3 px-3 py-5 border-b border-border hover:bg-zinc-100 active:bg-zinc-100 cursor-pointer focus-ring"
            onClick={props.onSelect}
            onKeyDown={(e) => handleRowKbEvent(e, props.onSelect)}
            role="button"
            tabindex={0}
        >
            <div>
                <span class="text-sm text-dim-fg/50">#{props.index + 1}</span>
            </div>

            <div class="grid gap-2">
                <div class="flex items-center gap-x-2">
                    <span class="font-semibold text-lg leading-tight truncate">
                        {props.item.student.name}
                    </span>
                    <BranchBadge
                        branch={props.item.student.branch}
                        semester={props.semester}
                        class="text-xs"
                    />
                </div>

                <div class="flex items-center gap-2">
                    <span class="text-sm text-dim-fg">{props.item.student.roll}</span>
                    <span class="text-xs opacity-50">•</span>
                    <span class="text-sm text-dim-fg">{props.item.student.college}</span>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center justify-center flex-col bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                        <span class="text-dim-fg font-medium uppercase text-xs opacity-70">
                            Marks Obtained
                        </span>

                        <div class="text-dim-fg text-xs">
                            <span class={cn(props.marksClassName, "text-lg font-medium")}>
                                {props.item.grandTotal.obtained}
                            </span>{" "}
                            <span class="opacity-50">/</span>{" "}
                            <span class="opacity-70">{props.item.grandTotal.maximum}</span>
                        </div>
                    </div>

                    <div class="flex items-center justify-center flex-col bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                        <span class="text-dim-fg font-medium uppercase text-xs opacity-70">
                            SGPA
                        </span>
                        <span class={cn(props.sgpaClassName, "font-semibold text-lg")}>
                            {props.item.sgpa}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DesktopResultRow(props: RowVariantProps) {
    return (
        <div
            class={cn(
                "hidden lg:grid",
                "items-center col-span-full grid-cols-subgrid py-3 border-b border-border hover:bg-zinc-100 cursor-pointer px-6",
                "focus-ring",
            )}
            onClick={props.onSelect}
            onKeyDown={(e) => handleRowKbEvent(e, props.onSelect)}
            tabindex={0}
            role="button"
        >
            <span class="text-dim-fg text-sm">{props.index + 1}</span>
            <span class="truncate">{props.item.student.name}</span>
            <span class="text-dim-fg">
                <span class="opacity-90">{props.item.student.roll.slice(0, -3)}</span>
                <span class="italic">{props.item.student.roll.slice(-3)}</span>
            </span>

            <div class="grid grid-cols-2 gap-2 items-center pe-8">
                <div class="text-dim-fg text-xs">
                    <span class="text-base font-medium">{props.item.grandTotal.obtained}</span>{" "}
                    <span class="text-xs opacity-50">/</span>{" "}
                    <span class="text-xs opacity-70">{props.item.grandTotal.maximum}</span>
                </div>

                <PercentageBadge
                    percentObtained={props.percentObtained}
                    class={props.marksClassName}
                />
            </div>

            <span class={cn("saturate-70", props.sgpaClassName)}>{props.formattedSgpa}</span>

            <div class="block">
                <BranchBadge branch={props.item.student.branch} semester={props.semester} />
            </div>

            <Show when={props.showCollege}>
                <span class="text-dim-fg text-sm truncate">{props.item.student.college}</span>
            </Show>
        </div>
    );
}

function BranchBadge(props: { branch: string; semester: string; class?: string }) {
    return (
        <span
            class={cn(
                "branch-badge inline-block ps-2 pe-0.5 rounded-lg text-sm text-nowrap",
                props.branch.toLowerCase(),
                props.class,
            )}
        >
            {props.branch}
            <em class="inline-block not-italic ms-1 px-1.5 py-0.5 my-0.5 bg-white/75 rounded-md">
                {props.semester}
                {OrdinalSuffix(props.semester)} sem
            </em>
        </span>
    );
}

function PercentageBadge(props: { percentObtained: number; class?: string }) {
    return (
        <span class={cn("bg-(--clr)/10 px-1.5 rounded-lg w-fit text-[0.83rem]", props.class)}>
            <span>{props.percentObtained}</span>
            <span class="text-xs opacity-80 saturate-50">{" %"}</span>
        </span>
    );
}

function handleRowKbEvent(
    e: KeyboardEvent & {
        currentTarget: HTMLDivElement;
        target: Element;
    },
    callback: () => void,
) {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        callback();
    }
}
