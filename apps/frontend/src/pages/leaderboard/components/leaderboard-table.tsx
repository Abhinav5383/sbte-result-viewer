import type { EncodedData } from "@app/shared/encoder";
import { getVal } from "@app/shared/encoder/helpers";
import { type BRANCH, BRANCH_NAME, type COLLEGE, COLLEGE_NAME } from "@app/shared/types";
import { useSearchParams } from "@solidjs/router";
import { For, Show } from "solid-js";
import { ChevronRightIcon } from "~/components/icons/chevron-right";
import { BranchBadge, PercentageBadge } from "~/components/misc/badges";
import { ScrollToTopButton } from "~/components/misc/scroll-to-top";
import VirtualList from "~/components/misc/virtual-list";
import { cn } from "~/components/utils";
import { marksClass, sgpaClass } from "~/lib/grade-utils";
import { SortBy, type SortOrder } from "~/lib/types";
import { handleRowKbEvent, SortableHeaderItem } from "~/pages/results/components/results-table";
import { getStudentBranch, getStudentCollege, getStudentName } from "../helpers";
import type { LeaderboardEntry, LeaderboardStudent, SortedLeaderboard } from "../types";
import { LeaderboardDialog } from "./leaderboard-dialog";

import "~/pages/results/components/results-table.css";

interface LeaderboardTableProps {
    resultsData: EncodedData;
    sortedResults: SortedLeaderboard;
    allStudents: LeaderboardStudent[];
    setSortFilter: (by: SortBy, order: SortOrder) => void;
    clearFilters: () => void;
    anyFilterActive: boolean;
    maxStrSizes: {
        branch: number;
    };
    showCollegeColumn: boolean;
    totalStudents: number;
}

export function LeaderboardTable(props: LeaderboardTableProps) {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedStudentId = () => {
        const id = searchParams.dialog;
        if (typeof id === "string") return id;
        return null;
    };

    function setSelectedStudentId(id: string) {
        setSearchParams({ dialog: id });
    }

    const dialogOpen = () => !!selectedStudentId();
    function closeDialog() {
        setSelectedStudentId("");
    }

    function dialogData(): LeaderboardEntry | undefined {
        const id = selectedStudentId();
        if (!id) return undefined;
        const found = props.sortedResults.results.find((entry) => entry.student.id === id);
        if (found) return found;

        const student = props.allStudents.find((s) => s.id === id);
        if (!student) return undefined;

        let totalObtained = 0;
        let totalMax = 0;
        let totalSgpa = 0;
        for (let j = 0; j < student.results.length; j++) {
            const r = student.results[j];
            totalObtained += getVal(r, "grandTotalObtained");
            totalMax += getVal(r, "grandTotalMax");
            totalSgpa += getVal(r, "sgpa");
        }
        const count = student.results.length;
        return {
            student,
            matchedResults: student.results,
            totalObtained,
            totalMax,
            percentage: totalMax > 0 ? (totalObtained / totalMax) * 100 : 0,
            avgSgpa: count > 0 ? totalSgpa / count : 0,
        };
    }

    return (
        <div class="@container/table">
            <Show
                when={props.sortedResults.results.length > 0}
                fallback={
                    <div class="flex flex-col items-center justify-center gap-2 py-16 text-dim-fg">
                        <span class="text-xl font-semibold">No results found</span>
                        <span class="text-sm">Try adjusting your search or filters</span>

                        <button
                            type="button"
                            onClick={props.clearFilters}
                            class="font-medium rounded-full px-4 border-[0.07rem] border-border hover:bg-accent-bg hover:text-accent-bg-text hover:border-accent-bg transition-all"
                        >
                            Clear Filters
                        </button>
                    </div>
                }
            >
                <div class="flex items-center text-sm text-dim-fg px-6 py-3 gap-4 border-be-[0.07rem] border-border">
                    <p>
                        Showing <span class="font-medium">{props.sortedResults.results.length}</span> of{" "}
                        <span class="font-medium">{props.totalStudents} </span>
                        {props.sortedResults.results.length !== 1 ? "students" : "student"}
                    </p>
                    <Show when={props.anyFilterActive}>
                        <span class="text-border">|</span>
                        <button
                            type="button"
                            class="text-inherit text-sm min-h-0 px-0 py-0 hover:text-accent-fg underline underline-offset-[0.1lh]"
                            onClick={props.clearFilters}
                        >
                            Clear Filters
                        </button>
                    </Show>
                </div>

                <div
                    class="block @min-desktop:grid gap-x-8 relative justify-between"
                    style={{
                        "--max-branch-len": `${props.maxStrSizes.branch + 10}ch`,
                        "grid-template-columns": `minmax(5ch, max-content) minmax(max-content, 1fr) minmax(14ch, 0.5fr) minmax(max-content, 0.7fr) minmax(max-content, 0.7fr) minmax(var(--max-branch-len), 1fr) ${
                            props.showCollegeColumn ? "minmax(max-content, 1fr)" : ""
                        }`,
                    }}
                >
                    <div class="hidden @min-desktop:grid z-10 sticky top-0 col-span-full grid-cols-subgrid gap-x-0 *:px-4 *:py-3 border-be-[0.07rem] border-border bg-zinc-700 text-zinc-200">
                        <div>
                            <strong>#</strong>
                        </div>

                        <SortableHeaderItem
                            title="Name"
                            value={SortBy.Name}
                            sortBy={props.sortedResults.sortedBy}
                            sortOrder={props.sortedResults.sortOrder}
                            setSortFilter={props.setSortFilter}
                        />

                        <SortableHeaderItem
                            title="Roll No"
                            value={SortBy.RegNo}
                            sortBy={props.sortedResults.sortedBy}
                            sortOrder={props.sortedResults.sortOrder}
                            setSortFilter={props.setSortFilter}
                        />

                        <SortableHeaderItem
                            title="Avg Marks"
                            value={SortBy.Marks}
                            sortBy={props.sortedResults.sortedBy}
                            sortOrder={props.sortedResults.sortOrder}
                            setSortFilter={props.setSortFilter}
                        />

                        <SortableHeaderItem
                            title="Avg SGPA"
                            value={SortBy.sgpa}
                            sortBy={props.sortedResults.sortedBy}
                            sortOrder={props.sortedResults.sortOrder}
                            setSortFilter={props.setSortFilter}
                        />

                        <div>
                            <strong>Branch</strong>
                        </div>

                        <Show when={props.showCollegeColumn}>
                            <div>
                                <strong>College</strong>
                            </div>
                        </Show>
                    </div>

                    <LeaderboardTableContents
                        sortedResults={props.sortedResults}
                        onSelect={setSelectedStudentId}
                        showCollege={props.showCollegeColumn}
                    />
                </div>
            </Show>

            <LeaderboardDialog
                open={dialogOpen()}
                onClose={closeDialog}
                entry={dialogData()}
                resultsData={props.resultsData}
            />
        </div>
    );
}

interface LeaderboardTableContentsProps {
    sortedResults: SortedLeaderboard;
    onSelect: (studentId: string) => void;
    showCollege: boolean;
}

const DEFAULT_ROW_HEIGHT = 52;
function LeaderboardTableContents(props: LeaderboardTableContentsProps) {
    return (
        <>
            <VirtualList
                defaultRowHeight={DEFAULT_ROW_HEIGHT}
                items={props.sortedResults.results}
                containerProps={{ class: "grid col-span-full grid-cols-subgrid" }}
                RowComponent={(args) => (
                    <LeaderboardRow
                        entry={args.item}
                        index={args.index}
                        onSelect={() => props.onSelect(args.item.student.id)}
                        showCollege={props.showCollege}
                        class={args.class}
                    />
                )}
            />

            <ScrollToTopButton />
        </>
    );
}

interface LeaderboardRowProps {
    entry: LeaderboardEntry;
    index: number;
    onSelect: () => void;
    showCollege: boolean;
    class?: string;
}

function LeaderboardRow(props: LeaderboardRowProps) {
    const student = props.entry.student;
    const name = getStudentName(student);
    const branch = getStudentBranch(student);
    const college = getStudentCollege(student);
    const count = props.entry.matchedResults.length;
    const avgObtained = count > 0 ? props.entry.totalObtained / count : 0;
    const avgMax = count > 0 ? props.entry.totalMax / count : 0;
    const formattedSgpa = props.entry.avgSgpa.toFixed(2);
    const marksClassName = marksClass(avgObtained, avgMax);
    const sgpaClassName = sgpaClass(props.entry.avgSgpa);
    const percentObtained = Math.round(props.entry.percentage * 100) / 100;

    return (
        <div class={`${props.class} grid col-span-full grid-cols-subgrid`}>
            <For each={[DesktopLeaderboardRow, MobileLeaderboardRow]}>
                {(Row) => (
                    <Row
                        entry={props.entry}
                        index={props.index}
                        onSelect={props.onSelect}
                        showCollege={props.showCollege}
                        name={name}
                        branch={branch}
                        college={college}
                        avgObtained={avgObtained}
                        avgMax={avgMax}
                        semester={""}
                        formattedSgpa={formattedSgpa}
                        marksClassName={marksClassName}
                        sgpaClassName={sgpaClassName}
                        percentObtained={percentObtained}
                    />
                )}
            </For>
        </div>
    );
}

interface RowVariantProps extends LeaderboardRowProps {
    name: string;
    branch: BRANCH;
    college: COLLEGE;
    avgObtained: number;
    avgMax: number;
    semester: string;
    formattedSgpa: string;
    marksClassName: string;
    sgpaClassName: string;
    percentObtained: number;
}

function MobileLeaderboardRow(props: RowVariantProps) {
    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: --
        <div
            class="group/row @min-desktop:hidden grid grid-cols-[max-content_1fr] gap-3 px-3 py-5 border-be-[0.07rem] border-border hover:bg-zinc-100/50 active:bg-zinc-100 cursor-pointer focus-ring"
            onClick={props.onSelect}
            onKeyDown={(e) => handleRowKbEvent(e, props.onSelect)}
            tabindex={0}
        >
            <div>
                <span class="text-sm text-dim-fg/50">#{props.index + 1}</span>
            </div>

            <div class="grid gap-2">
                <div class="flex items-center gap-x-2 overflow-x-auto whitespace-nowrap">
                    <span class="font-semibold text-lg leading-tight truncate">{props.name}</span>
                    <BranchBadge branch={BRANCH_NAME[props.branch]} semester={props.semester} class="text-xs" />
                </div>

                <div class="flex items-center gap-x-2 overflow-x-auto whitespace-nowrap">
                    <span class="text-sm text-dim-fg tabular-nums">{props.entry.student.id}</span>
                    <span class="text-xs opacity-50">•</span>
                    <span class="text-sm text-dim-fg truncate">{COLLEGE_NAME[props.college]}</span>
                    <span class="text-xs opacity-50">•</span>
                    <PercentageBadge percentObtained={props.percentObtained} class={props.marksClassName} />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="grid place-items-center bg-zinc-50/50 p-3 rounded-lg border-[0.07rem] border-zinc-200">
                        <span class="text-dim-fg font-medium uppercase text-xs opacity-70 whitespace-nowrap">
                            Avg Marks
                        </span>
                        <div class="text-dim-fg text-xs">
                            <span class={cn(props.marksClassName, "text-lg font-medium")}>
                                {Math.round(props.avgObtained)}
                            </span>{" "}
                            <span class="opacity-50">/</span> <span class="opacity-70">{Math.round(props.avgMax)}</span>
                        </div>
                    </div>

                    <div class="grid place-items-center bg-zinc-50/50 p-3 rounded-lg border-[0.07rem] border-zinc-200">
                        <span class="text-dim-fg font-medium uppercase text-xs opacity-70">Avg SGPA</span>
                        <span class={cn(props.sgpaClassName, "font-semibold text-lg")}>{props.formattedSgpa}</span>
                    </div>
                </div>

                <div class="text-[0.67rem] text-dim-fg/60 flex items-center justify-self-end group-hover/row:underline group-hover/row:text-accent-fg">
                    <span class="trim-both">Details</span>
                    <ChevronRightIcon class="w-[1.3em] h-[1.3em]" />
                </div>
            </div>
        </div>
    );
}

function DesktopLeaderboardRow(props: RowVariantProps) {
    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: __
        <div
            class={cn(
                "hidden @min-desktop:grid",
                "items-center col-span-full grid-cols-subgrid py-3 border-be-[0.07rem] border-border hover:bg-zinc-100 cursor-pointer px-6",
                "focus-ring",
            )}
            onClick={props.onSelect}
            onKeyDown={(e) => handleRowKbEvent(e, props.onSelect)}
            tabindex={0}
        >
            <span class="text-dim-fg text-sm">{props.index + 1}</span>
            <span class="truncate">{props.name}</span>
            <span class="text-dim-fg tabular-nums flex gap-[0.07em]">
                <span class="opacity-90">{props.entry.student.id.slice(0, -3)}</span>
                <span class="text-normal-fg">{props.entry.student.id.slice(-3)}</span>
            </span>

            <div class="grid grid-cols-2 gap-2 items-center pe-8 tabular-nums">
                <div class="text-dim-fg text-xs">
                    <span class="text-base font-medium">{Math.round(props.avgObtained)}</span>{" "}
                    <span class="text-xs opacity-50">/</span>{" "}
                    <span class="text-xs opacity-70">{Math.round(props.avgMax)}</span>
                </div>

                <PercentageBadge percentObtained={props.percentObtained} class={props.marksClassName} />
            </div>

            <span class={cn("saturate-70", props.sgpaClassName)}>{props.formattedSgpa}</span>

            <div class="block">
                <BranchBadge branch={BRANCH_NAME[props.branch]} semester={props.semester} class="text-xs" />
            </div>

            <Show when={props.showCollege}>
                <span class="text-dim-fg text-sm truncate">{COLLEGE_NAME[props.college]}</span>
            </Show>
        </div>
    );
}
