import type { ResultRow } from "@app/shared/dto";
import { useSearchParams } from "@solidjs/router";
import ArrowDownWideNarrow from "lucide-solid/icons/arrow-down-wide-narrow";
import ArrowUpWideNarrow from "lucide-solid/icons/arrow-up-wide-narrow";
import { type Accessor, For, Show } from "solid-js";
import { ChevronRightIcon } from "~/components/icons/chevron-right";
import { BranchBadge, PercentageBadge } from "~/components/misc/badges";
import { SortBy, SortDirection } from "~/components/misc/results-filter/types";
import { ScrollToTopButton } from "~/components/misc/scroll-to-top";
import VirtualList from "~/components/misc/virtual-list";
import BouncingDotsLoader from "~/components/ui/loaders/bouncing-dots";
import { cn } from "~/components/utils";
import { useMeta } from "~/hooks/use-meta";
import { marksClass, sgpaClass } from "~/lib/grade-utils";
import { DetailsDialog } from "./details-dialog";

import "./results-table.css";

interface ResultsListTableProps {
	results: ResultRow[];
	total: number | undefined;
	totalItems?: number;
	loading: boolean;
	loadingMore: boolean;
	hasMore: boolean;
	loadMore: () => void;
	sortBy: Accessor<SortBy>;
	sortOrder: Accessor<SortDirection>;
	setSort: (by: SortBy, order: SortDirection) => void;
	clearFilters: () => void;
	anyFilterActive: boolean;
	showCollegeColumn?: boolean;
	error?: string | null;
	onRetry?: () => void;
}

export function ResultsListTable(props: ResultsListTableProps) {
	const meta = useMeta();
	const [searchParams, setSearchParams] = useSearchParams();

	const filtered = () => props.total ?? props.results.length;
	const totalItems = () => props.totalItems ?? (meta.totalResults() || filtered());

	const selectedRoll = () => {
		const roll = searchParams.dialog;
		if (typeof roll === "string") return roll;
		return null;
	};

	function setSelectedRoll(roll: string) {
		setSearchParams({ dialog: roll });
	}

	const dialogOpen = () => !!selectedRoll();
	function closeDialog() {
		setSelectedRoll("");
	}

	return (
		<div class="@container/table">
			<Show
				when={!props.error}
				fallback={
					<div class="flex flex-col items-center justify-center gap-3 py-16 text-dim-fg">
						<span class="text-2xl font-semibold text-rose-600 dark:text-rose-400">
							Oops! Something went wrong
						</span>
						<span class="text-sm text-dim-fg">{props.error}</span>
						<Show when={props.onRetry}>
							<button
								type="button"
								onClick={props.onRetry}
								class="mt-2 font-medium rounded-full px-4 py-1.5 border border-border hover:bg-accent-bg hover:text-white transition-all text-sm"
							>
								Try Again
							</button>
						</Show>
					</div>
				}
			>
				<Show
					when={props.results.length > 0}
					fallback={
						<Show
							when={props.loading}
							fallback={
								<div class="flex flex-col items-center justify-center gap-2 py-16 text-dim-fg">
									<span class="text-xl font-semibold">No results found</span>
									<span class="text-sm">
										Try adjusting your search or filters
									</span>

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
							<div class="flex flex-col items-center justify-center gap-4 py-20 text-dim-fg">
								<BouncingDotsLoader class="w-24 text-accent-fg" />
								<span class="text-sm font-semibold italic">Loading results...</span>
							</div>
						</Show>
					}
				>
					<div class="flex items-center text-sm text-dim-fg px-6 py-3 gap-4 border-be-[0.07rem] border-border">
						<p>
							Showing <span class="font-medium">{filtered()}</span> of{" "}
							<span class="font-medium">{totalItems()}</span>{" "}
							{totalItems() === 1 ? "result" : "results"}
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
						class={cn(
							"block @min-desktop:grid gap-x-8 relative justify-between transition-opacity duration-200",
							props.loading && "opacity-70",
						)}
						style={{
							"--max-branch-len": "25ch",
							"grid-template-columns": `minmax(8ch, max-content) minmax(max-content, 1fr) minmax(14ch, 0.5fr) minmax(max-content, 0.7fr) minmax(max-content, 0.7fr) minmax(var(--max-branch-len), 1fr) ${
								props.showCollegeColumn !== false ? "minmax(max-content, 1fr)" : ""
							}`,
						}}
					>
						<Show when={props.loading}>
							<div class="absolute top-0 inset-x-0 h-0.5 bg-accent animate-pulse z-20" />
						</Show>
						<div class="hidden @min-desktop:grid z-10 sticky top-0 col-span-full grid-cols-subgrid gap-x-0 *:px-4 *:py-3 border-be-[0.07rem] border-border bg-zinc-700 dark:bg-subtle text-zinc-200 dark:text-dim-fg">
							<div>
								<strong>#</strong>
							</div>

							<SortableHeaderItem
								title="Name"
								value={SortBy.NAME}
								sortBy={props.sortBy()}
								sortOrder={props.sortOrder()}
								setSortFilter={props.setSort}
							/>

							<SortableHeaderItem
								title="Roll No"
								value={SortBy.ROLL}
								sortBy={props.sortBy()}
								sortOrder={props.sortOrder()}
								setSortFilter={props.setSort}
							/>

							<SortableHeaderItem
								title="Marks"
								value={SortBy.MARKS}
								sortBy={props.sortBy()}
								sortOrder={props.sortOrder()}
								setSortFilter={props.setSort}
							/>

							<SortableHeaderItem
								title="SGPA"
								value={SortBy.SGPA}
								sortBy={props.sortBy()}
								sortOrder={props.sortOrder()}
								setSortFilter={props.setSort}
							/>

							<div>
								<strong>Branch</strong>
							</div>

							<Show when={props.showCollegeColumn !== false}>
								<div>
									<strong>College</strong>
								</div>
							</Show>
						</div>

						<ResultTableContents
							results={props.results}
							onSelect={setSelectedRoll}
							showCollege={props.showCollegeColumn !== false}
							loadMore={props.loadMore}
						/>
					</div>
				</Show>
			</Show>

			<DetailsDialog open={dialogOpen()} onClose={closeDialog} roll={selectedRoll()} />
		</div>
	);
}

export interface SortableHeaderItemProps {
	title: string;
	value: SortBy;
	sortBy: SortBy;
	sortOrder: SortDirection;
	setSortFilter: (by: SortBy, order: SortDirection) => void;
}

export function SortableHeaderItem(props: SortableHeaderItemProps) {
	return (
		<button
			type="button"
			class={cn(
				"h-full rounded-none justify-between text-start",
				"grid grid-cols-[1fr_min-content] items-center hover:bg-zinc-800 dark:hover:bg-hover cursor-pointer transition-colors px-4 py-3",
			)}
			onClick={() => {
				if (props.sortBy === props.value) {
					props.setSortFilter(
						props.value,
						props.sortOrder === SortDirection.ASC
							? SortDirection.DESC
							: SortDirection.ASC,
					);
				} else {
					let order: SortDirection = SortDirection.DESC;
					switch (props.value) {
						case SortBy.NAME:
						case SortBy.ROLL: {
							order = SortDirection.ASC;
							break;
						}
						case SortBy.MARKS:
						case SortBy.SGPA: {
							order = SortDirection.DESC;
							break;
						}
					}
					props.setSortFilter(props.value, order);
				}
			}}
		>
			<strong>{props.title}</strong>
			<Show when={props.sortBy === props.value}>
				<Show
					when={props.sortOrder === "desc"}
					fallback={<ArrowUpWideNarrow class="text-accent-fg-light" />}
				>
					<ArrowDownWideNarrow class="text-accent-fg-light" />
				</Show>
			</Show>
		</button>
	);
}

interface ResultTableContentsProps {
	results: ResultRow[];
	onSelect: (roll: string) => void;
	showCollege: boolean;
	loadMore: () => void;
}

const DEFAULT_ROW_HEIGHT = 52;

function ResultTableContents(props: ResultTableContentsProps) {
	return (
		<>
			<VirtualList
				defaultRowHeight={DEFAULT_ROW_HEIGHT}
				items={props.results}
				containerProps={{ class: "grid col-span-full grid-cols-subgrid" }}
				onScrollBottom={props.loadMore}
				RowComponent={(args) => (
					<ResultRowComponent
						item={args.item}
						index={args.index}
						onSelect={() => props.onSelect(args.item.roll)}
						showCollege={props.showCollege}
						class={args.class}
					/>
				)}
			/>

			<ScrollToTopButton />
		</>
	);
}

interface ResultRowProps {
	item: ResultRow;
	index: number;
	onSelect: () => void;
	showCollege: boolean;
	class?: string;
}

function calcPercentObtained(obtained: number, maximum: number) {
	if (maximum <= 0) return 0;
	return Math.round((obtained / maximum) * 100_00) / 100;
}

function ResultRowComponent(props: ResultRowProps) {
	const percentObtained = calcPercentObtained(props.item.total_obtained, props.item.total_max);
	const marksClassName = marksClass(props.item.total_obtained, props.item.total_max);
	const sgpaClassName = sgpaClass(props.item.sgpa_x100 / 100);
	const formattedSgpa = (props.item.sgpa_x100 / 100).toFixed(2);
	const semester = props.item.semester.toString();

	return (
		<div class={`${props.class} grid col-span-full grid-cols-subgrid`}>
			<For each={[DesktopResultRow, MobileResultRow]}>
				{(Row) => (
					<Row
						item={props.item}
						index={props.index}
						onSelect={props.onSelect}
						showCollege={props.showCollege}
						semester={semester}
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

interface RowVariantProps extends ResultRowProps {
	semester: string;
	formattedSgpa: string;
	marksClassName: string;
	sgpaClassName: string;
	percentObtained: number;
}

function MobileResultRow(props: RowVariantProps) {
	const meta = useMeta();

	return (
		// biome-ignore lint/a11y/useSemanticElements: grid row container
		<div
			class={cn(
				"group/row @min-desktop:hidden grid grid-cols-[max-content_1fr] gap-3 px-3 py-5 border-be-[0.07rem] border-border hover:bg-hover/50 active:bg-hover cursor-pointer focus-ring",
				props.index % 2 === 0 && "bg-subtle/40 dark:bg-surface/30",
			)}
			onClick={props.onSelect}
			onKeyDown={(e) => handleRowKbEvent(e, props.onSelect)}
			tabIndex={0}
			role="button"
		>
			<div>
				<span class="text-sm text-dim-fg/50">#{props.index + 1}</span>
			</div>

			<div class="grid gap-2">
				<div class="flex items-center gap-x-2 overflow-x-auto whitespace-nowrap">
					<span class="font-semibold text-lg leading-tight truncate">
						{props.item.name}
					</span>
					<BranchBadge
						branch={meta.getBranchName(props.item.branch_code)}
						semester={props.semester}
						class="text-xs"
					/>
				</div>

				<div class="flex items-center gap-x-2 overflow-x-auto whitespace-nowrap">
					<span class="text-sm text-dim-fg tabular-nums">{props.item.roll.slice(2)}</span>
					<span class="text-xs opacity-50">•</span>
					<span class="text-sm text-dim-fg truncate">
						{meta.getCollegeName(props.item.college_code)}
					</span>
					<span class="text-xs opacity-50">•</span>
					<PercentageBadge
						percentObtained={props.percentObtained}
						class={props.marksClassName}
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="grid place-items-center bg-subtle p-3 rounded-lg border-[0.07rem] border-border-subtle">
						<span class="text-dim-fg font-medium uppercase text-xs opacity-70 whitespace-nowrap">
							Marks Obtained
						</span>

						<div class="text-dim-fg text-xs">
							<span class={cn(props.marksClassName, "text-lg font-medium")}>
								{props.item.total_obtained}
							</span>{" "}
							<span class="opacity-50">/</span>{" "}
							<span class="opacity-70">{props.item.total_max}</span>
						</div>
					</div>

					<div class="grid place-items-center bg-subtle p-3 rounded-lg border-[0.07rem] border-border-subtle">
						<span class="text-dim-fg font-medium uppercase text-xs opacity-70">
							SGPA
						</span>
						<span class={cn(props.sgpaClassName, "font-semibold text-lg")}>
							{props.formattedSgpa}
						</span>
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

function DesktopResultRow(props: RowVariantProps) {
	const meta = useMeta();

	return (
		// biome-ignore lint/a11y/useSemanticElements: grid row container
		<div
			class={cn(
				"hidden @min-desktop:grid",
				"items-center col-span-full grid-cols-subgrid py-3 border-be-[0.07rem] border-border hover:bg-hover/50 active:bg-hover cursor-pointer px-6",
				props.index % 2 === 0 && "bg-subtle/40 dark:bg-surface/30",
				"focus-ring",
			)}
			onClick={props.onSelect}
			onKeyDown={(e) => handleRowKbEvent(e, props.onSelect)}
			tabIndex={0}
			role="button"
		>
			<span class="text-dim-fg text-sm">{props.index + 1}</span>
			<span class="truncate">{props.item.name}</span>
			<span class="text-dim-fg tabular-nums flex gap-[0.07em]">
				<span class="opacity-90">{props.item.roll.slice(2, -3)}</span>
				<span class="text-normal-fg">{props.item.roll.slice(-3)}</span>
			</span>

			<div class="grid grid-cols-2 gap-2 items-center pe-8 tabular-nums">
				<div class="text-dim-fg text-xs">
					<span class="text-base font-medium">{props.item.total_obtained}</span>{" "}
					<span class="text-xs opacity-50">/</span>{" "}
					<span class="text-xs opacity-70">{props.item.total_max}</span>
				</div>

				<PercentageBadge
					percentObtained={props.percentObtained}
					class={props.marksClassName}
				/>
			</div>

			<span class={cn("saturate-70", props.sgpaClassName)}>{props.formattedSgpa}</span>

			<div class="block">
				<BranchBadge
					branch={meta.getBranchName(props.item.branch_code)}
					semester={props.semester}
					class="text-xs"
				/>
			</div>

			<Show when={props.showCollege}>
				<span class="text-dim-fg text-sm truncate">
					{meta.getCollegeName(props.item.college_code)}
				</span>
			</Show>
		</div>
	);
}

export function handleRowKbEvent(
	e: KeyboardEvent & {
		currentTarget: HTMLDivElement;
		target: Element;
	},
	cb: () => void,
) {
	if (e.key === "Enter" || e.key === " ") {
		e.preventDefault();
		cb();
	}
}
