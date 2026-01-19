import { type ParsedResult } from "@app/shared/types";
import ArrowDownWideNarrow from "lucide-solid/icons/arrow-down-wide-narrow";
import ArrowUpWideNarrow from "lucide-solid/icons/arrow-up-wide-narrow";
import {
    type ComponentProps,
    For,
    type Setter,
    Show,
    batch,
    createMemo,
    createSignal,
    onCleanup,
    onMount,
} from "solid-js";
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

    maxStrSizes: {
        name: number;
        branch: number;
        college: number;
    };
}

export function ResultsListTable(props: ResultsListTableProps) {
    const [dialogOpen, setDialogOpen] = createSignal(false);
    const [selectedRoll, setSelectedRoll] = createSignal<string | null>(null);

    function dialogData() {
        const roll = selectedRoll();
        if (!roll) return undefined;
        return props.displayedResults.find((r) => r.student.roll === roll);
    }

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

                <div
                    class="grid gap-x-8 table-grid relative"
                    style={{
                        // to prevent layout shifts as virtual rows are rendered
                        // col width uses max-content so this is needed to keep the columns stable
                        "--max-name-len": `${props.maxStrSizes.name}ch`,
                        // adding extra for the semester suffix + spacing
                        "--max-branch-len": `${props.maxStrSizes.branch + 10}ch`,
                        "--max-college-len": `${props.maxStrSizes.college}ch`,
                    }}
                >
                    <div class="grid z-10 sticky top-0 col-span-full grid-cols-subgrid gap-x-0 *:px-4 *:py-3 border-b border-border bg-zinc-700 text-zinc-200">
                        <div>
                            <strong>#</strong>
                        </div>

                        <SortableHeaderItem
                            title="Name"
                            value={SortBy.Name}
                            sortBy={props.sortBy}
                            setSortBy={props.setSortBy}
                            sortOrder={props.sortOrder}
                            setSortOrder={props.setSortOrder}
                        />

                        <SortableHeaderItem
                            title="Roll No"
                            value={SortBy.Roll}
                            sortBy={props.sortBy}
                            setSortBy={props.setSortBy}
                            sortOrder={props.sortOrder}
                            setSortOrder={props.setSortOrder}
                        />

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

                        <div>
                            <strong>Branch</strong>
                        </div>

                        <div>
                            <strong>College</strong>
                        </div>
                    </div>

                    <ResultTableContents
                        results={props.displayedResults}
                        onSelect={(roll) => {
                            setSelectedRoll(roll);
                            setDialogOpen(true);
                        }}
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
                    fallback={<ArrowUpWideNarrow class="text-accent-fg-light" />}
                >
                    <ArrowDownWideNarrow class="text-accent-fg-light" />
                </Show>
            </Show>
        </button>
    );
}

interface ResultTableContentsProps {
    results: ParsedResult[];
    onSelect: (roll: string) => void;
}

function ResultTableContents(props: ResultTableContentsProps) {
    const DEFAULT_ROW_HEIGHT = 52;
    const OVERSCAN = 10;

    let measureRef: HTMLDivElement | undefined;
    let containerRef: HTMLDivElement | undefined;
    const [rowHeight, setRowHeight] = createSignal(DEFAULT_ROW_HEIGHT);
    const [scrollOffset, setScrollOffset] = createSignal(0);
    const [viewportHeight, setViewportHeight] = createSignal(window.innerHeight);

    // all rows have the same height
    // and because each column has a min-width of 'max-content', text can't (or rather won't) wrap in our case
    // really long names might still cause wrapping, but meh
    function measureRowHeight() {
        if (measureRef) {
            const measured = measureRef.offsetHeight;
            if (measured > 0) setRowHeight(measured);
        }
    }

    function handleScroll() {
        if (!containerRef) return;
        const rect = containerRef.getBoundingClientRect();
        setScrollOffset(Math.max(0, -rect.top));
    }

    function handleResize() {
        setViewportHeight(window.innerHeight);
        // measure row height again in case layout changed
        requestAnimationFrame(measureRowHeight);
        handleScroll();
    }

    // track window scroll position relative to container
    onMount(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize, { passive: true });

        // init
        requestAnimationFrame(() => {
            measureRowHeight();
            handleScroll();
        });

        onCleanup(() => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        });
    });

    const visibleRange = createMemo(() => {
        const rh = rowHeight();
        const offset = scrollOffset();
        const vh = viewportHeight();
        const total = props.results.length;

        const startIndex = Math.max(0, Math.floor(offset / rh) - OVERSCAN);
        const visibleCount = Math.ceil(vh / rh) + OVERSCAN * 2;
        const endIndex = Math.min(total, startIndex + visibleCount);

        return { startIndex, endIndex };
    });

    const visibleItems = createMemo(() => {
        const { startIndex, endIndex } = visibleRange();
        return props.results.slice(startIndex, endIndex);
    });

    const topPadding = () => visibleRange().startIndex * rowHeight();
    const bottomPadding = () => (props.results.length - visibleRange().endIndex) * rowHeight();

    return (
        <div
            ref={(el) => {
                containerRef = el;
            }}
            class="grid col-span-full grid-cols-subgrid"
            style={{
                "padding-top": `${topPadding()}px`,
                "padding-bottom": `${bottomPadding()}px`,
            }}
        >
            <For each={visibleItems()}>
                {(item, index) => (
                    <ResultRow
                        item={item}
                        index={visibleRange().startIndex + index()}
                        onSelect={() => props.onSelect(item.student.roll)}
                        ref={(el) => {
                            if (index() === 0) measureRef = el;
                        }}
                    />
                )}
            </For>
        </div>
    );
}

interface ResultRowProps {
    item: ParsedResult;
    index: number;
    onSelect: () => void;
    ref?: ComponentProps<"div">["ref"];
}

function ResultRow(props: ResultRowProps) {
    const semester = props.item.student.roll.charAt(0);
    const semesterSuffix = OrdinalSuffix(semester);
    const branchClass = props.item.student.branch.toLowerCase();
    const marksClassName = marksClass(
        props.item.grandTotal.obtained,
        props.item.grandTotal.maximum,
    );
    const sgpaClassName = sgpaClass(props.item.sgpa);
    const formattedSgpa = props.item.sgpa.toFixed(2);

    const percentObtained =
        Math.round((props.item.grandTotal.obtained / props.item.grandTotal.maximum) * 100_00) / 100;

    return (
        // biome-ignore lint/a11y/useKeyWithClickEvents: Row click handler
        <div
            class="grid items-center col-span-full grid-cols-subgrid py-3 border-b border-border hover:bg-zinc-100 cursor-pointer px-6 overflow-clip"
            onClick={props.onSelect}
            ref={props.ref}
        >
            <span class="text-dim-fg text-sm">{props.index + 1}</span>
            <span>{props.item.student.name}</span>
            <span class="text-dim-fg">
                <span class="opacity-90">{props.item.student.roll.slice(0, -3)}</span>
                <span class="italic">{props.item.student.roll.slice(-3)}</span>
            </span>

            <div class="grid grid-cols-2 gap-2 items-center pe-8">
                <div class="text-dim-fg text-xs">
                    <span class="text-base font-medium">{props.item.grandTotal.obtained}</span>{" "}
                    <span class="text-xs opacity-5s0">/</span>{" "}
                    <span class="text-xs opacity-70">{props.item.grandTotal.maximum}</span>
                </div>

                <span class={cn(marksClassName, " bg-(--clr)/10 px-1.5 rounded-lg w-fit")}>
                    <span class="text-[0.83rem]">{percentObtained}</span>
                    <span class="text-xs opacity-80 saturate-50">{" %"}</span>
                </span>
            </div>
            <span class={cn("saturate-70", sgpaClassName)}>{formattedSgpa}</span>

            <div>
                <span
                    class={`branch-badge ${branchClass} inline-block ps-2 pe-0.5 rounded-lg text-sm text-nowrap`}
                >
                    {props.item.student.branch}
                    <em class="inline-block not-italic ms-1 px-1.5 py-0.5 my-0.5 bg-white/75 rounded-md">
                        {semester}
                        {semesterSuffix} sem
                    </em>
                </span>
            </div>
            <span class="text-dim-fg text-sm">{props.item.student.college}</span>
        </div>
    );
}
