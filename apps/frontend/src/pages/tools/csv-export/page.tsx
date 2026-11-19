/** biome-ignore-all lint/a11y/useFocusableInteractive: f a11y */
/** biome-ignore-all lint/a11y/useSemanticElements: f a11y */

import type { ResultRow } from "@app/shared/dto";
import { ExportField } from "@app/shared/schemas";
import { useSearchParams } from "@solidjs/router";
import FileSpreadsheetIcon from "lucide-solid/icons/file-spreadsheet";
import Trash2Icon from "lucide-solid/icons/trash-2";
import { For, onMount, Show } from "solid-js";
import { ResultsFilter } from "~/components/misc/results-filter/component";
import { useFilterControls } from "~/components/misc/results-filter/hook";
import { SortBy, SortDirection } from "~/components/misc/results-filter/types";
import VirtualList from "~/components/misc/virtual-list";
import { Button } from "~/components/ui/button";
import MultiSelect from "~/components/ui/multi-select";
import { cn } from "~/components/utils";
import { useMeta } from "~/hooks/use-meta";
import { useResults } from "~/hooks/use-results";
import { getExportCsvUrl } from "~/lib/api/results";

const EXPORT_FIELDS: { key: ExportField; label: string }[] = [
	{ key: ExportField.ROLL, label: "Roll No." },
	{ key: ExportField.NAME, label: "Name" },
	{ key: ExportField.BRANCH, label: "Branch" },
	{ key: ExportField.COLLEGE, label: "College" },
	{ key: ExportField.SEMESTER, label: "Semester" },
	{ key: ExportField.SESSION, label: "Admission Year" },
	{ key: ExportField.TOTAL_OBTAINED, label: "Marks Obtained" },
	{ key: ExportField.TOTAL_MAX, label: "Maximum Marks" },
	{ key: ExportField.SGPA, label: "SGPA" },
	{ key: ExportField.CGPA, label: "CGPA" },
	{ key: ExportField.REMARK, label: "Remarks" },
];

const DEFAULT_FIELDS: ExportField[] = [
	ExportField.ROLL,
	ExportField.NAME,
	ExportField.BRANCH,
	ExportField.COLLEGE,
	ExportField.TOTAL_OBTAINED,
	ExportField.SGPA,
	ExportField.REMARK,
];

function getValidCsvKeys(keys: string[]): ExportField[] {
	const valid: ExportField[] = [];
	for (const key of keys) {
		if (!valid.includes(key as ExportField) && EXPORT_FIELDS.some((f) => f.key === key)) {
			valid.push(key as ExportField);
		}
	}
	return valid;
}

function extractField(
	row: ResultRow,
	field: ExportField,
	meta: ReturnType<typeof useMeta>,
): string {
	switch (field) {
		case ExportField.ROLL:
			return row.roll;
		case ExportField.NAME:
			return row.name;
		case ExportField.BRANCH:
			return meta.getBranchName(row.branch_code);
		case ExportField.COLLEGE:
			return meta.getCollegeName(row.college_code);
		case ExportField.SEMESTER:
			return row.semester.toString();
		case ExportField.SESSION:
			return row.session;
		case ExportField.TOTAL_OBTAINED:
			return row.total_obtained.toString();
		case ExportField.TOTAL_MAX:
			return row.total_max.toString();
		case ExportField.SGPA:
			return (row.sgpa_x100 / 100).toFixed(2);
		case ExportField.CGPA:
			return row.cgpa_x100 != null ? (row.cgpa_x100 / 100).toFixed(2) : "";
		case ExportField.REMARK:
			return row.remark;
		default:
			return "";
	}
}

export default function CsvExportPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const filters = useFilterControls({ sortBy: SortBy.MARKS, sortOrder: SortDirection.DESC });

	const resultsHook = useResults(filters, { limit: 100 });

	onMount(() => {
		if (searchParams.fields === undefined) {
			setSearchParams({ fields: DEFAULT_FIELDS.join("__") }, { replace: true });
		}
	});

	const selectedFields = () => {
		const raw = searchParams.fields;
		if (!raw) return [];
		const keyList = Array.isArray(raw) ? raw[0] : raw;
		return getValidCsvKeys(keyList.split("__"));
	};

	function setSelectedFields(fields: ExportField[]) {
		const valid = getValidCsvKeys(fields);
		setSearchParams({ fields: valid.join("__") }, { replace: true });
	}

	function handleExport() {
		if (selectedFields().length === 0) return;

		const url = getExportCsvUrl({
			college: filters.college().length > 0 ? filters.college() : undefined,
			branch: filters.branch().length > 0 ? filters.branch() : undefined,
			sem: filters.semester().length > 0 ? filters.semester() : undefined,
			session: filters.session().length > 0 ? filters.session() : undefined,
			q: filters.query().trim().length >= 2 ? filters.query().trim() : undefined,
			fields: selectedFields(),
		});

		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", "results.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	return (
		<main class="@container grid gap-4 content-start px-6">
			<div class="py-4 flex justify-between items-center">
				<h1 class="text-3xl font-bold text-normal-fg">CSV Export</h1>

				<Button
					variant="primary-alt"
					onClick={handleExport}
					disabled={selectedFields().length === 0}
				>
					<FileSpreadsheetIcon class="w-[1.2em] h-[1.2em] mbs-[-0.15em]" />
					<span style="text-box: trim-both cap alphabetic;">Export CSV</span>
				</Button>
			</div>

			<div id="results" class="grid">
				<div class="grid grid-cols-1 @min-desktop:grid-cols-[4fr_3fr_3fr_3fr_4fr] gap-x-2.5 gap-y-4 py-4 pbe-6 *:first:col-span-full">
					<ResultsFilter hook={filters} alwaysShowSort />
				</div>

				<div class="flex items-center justify-between flex-wrap gap-x-8 gap-y-4 pbs-6">
					<div class="flex gap-4 items-center">
						<p class="text-dim-fg text-sm">
							Export Preview (showing{" "}
							<span class="font-medium">{resultsHook.results().length}</span>
							<Show when={resultsHook.total() !== undefined}>
								{" "}
								of <span class="font-medium">{resultsHook.total()}</span>
							</Show>{" "}
							{filters.anyFilterActive() ? "matches" : "results"})
						</p>
						<Show when={filters.anyFilterActive()}>
							<span class="text-border">|</span>
							<button
								type="button"
								class="text-inherit text-sm min-h-0 px-0 py-0 hover:text-accent-fg underline underline-offset-[0.1lh]"
								onClick={filters.clearFilters}
							>
								Clear Filters
							</button>
						</Show>
					</div>

					<div class="grow grid grid-cols-[1fr_auto] gap-4 justify-items-end">
						<MultiSelect
							selected={selectedFields()}
							onChange={(list) => setSelectedFields(list as ExportField[])}
							options={EXPORT_FIELDS.map((f) => ({
								label: f.label,
								value: f.key,
							})).sort((a, b) => a.label.localeCompare(b.label))}
							class="w-stretch @min-desktop:w-[42ch]"
							searchThreshold={null}
						/>

						<Button
							variant="danger-alt-hover"
							size="sm"
							onClick={() => setSelectedFields([])}
						>
							<Trash2Icon />
							Clear All
						</Button>
					</div>
				</div>

				<PreviewCsv
					results={resultsHook.results()}
					loading={resultsHook.loading()}
					error={resultsHook.error()}
					selectedFields={selectedFields()}
					setSelectedFields={setSelectedFields}
				/>
			</div>
		</main>
	);
}

interface PreviewCsvProps {
	results: ResultRow[];
	loading: boolean;
	error: string | null;
	selectedFields: ExportField[];
	setSelectedFields: (fields: ExportField[]) => void;
}

function PreviewCsv(props: PreviewCsvProps) {
	const meta = useMeta();

	function removeField(field: ExportField) {
		const newFields = props.selectedFields.filter((f) => f !== field);
		props.setSelectedFields(newFields);
	}

	return (
		<Show
			when={props.selectedFields.length > 0}
			fallback={
				<div class="grid place-items-center h-96">
					<p class="text-dim-fg text-lg">
						No fields selected. Select some fields to preview the CSV.
					</p>
				</div>
			}
		>
			<div
				class={cn(
					"max-w-stretch overflow-x-auto my-4 transition-opacity duration-200 relative",
					props.loading && "opacity-70",
				)}
				style="scrollbar-width: thin;"
			>
				<Show when={props.loading}>
					<div class="absolute top-0 inset-x-0 h-0.5 bg-accent animate-pulse z-20" />
				</Show>

				<div
					role="table"
					class="grid w-full text-[0.925rem]"
					style={{
						"grid-template-columns": `repeat(${props.selectedFields.length}, auto)`,
					}}
				>
					<div role="rowgroup" class="contents">
						<div role="row" class="grid grid-cols-subgrid col-span-full">
							<For each={props.selectedFields}>
								{(field) => {
									const fieldDef = EXPORT_FIELDS.find((f) => f.key === field);
									if (!fieldDef) return null;

									return (
										<div
											role="columnheader"
											class="flex items-center justify-between bg-zinc-700 dark:bg-subtle text-zinc-200 dark:text-dim-fg gap-4 px-3 py-2 border-e-[0.07rem] border-border-subtle"
										>
											<span class="inline-block w-max max-w-[24ch] font-semibold">
												{fieldDef.label}
											</span>

											<Button
												variant="danger-muted"
												size="icon-sm"
												onClick={() => removeField(fieldDef.key)}
												class="text-zinc-300 dark:text-dim-fg/70"
											>
												<Trash2Icon />
											</Button>
										</div>
									);
								}}
							</For>
						</div>
					</div>

					<Show
						when={props.results.length > 0}
						fallback={
							<div class="col-span-full grid place-items-center py-16 text-dim-fg">
								{props.loading
									? "Loading preview..."
									: "No results found matching your filters."}
							</div>
						}
					>
						<VirtualList
							items={props.results}
							defaultRowHeight={32}
							containerProps={{
								role: "rowgroup",
								class: "grid grid-cols-subgrid col-span-full text-normal-fg",
							}}
							RowComponent={(args) => (
								<div
									role="row"
									class={cn(
										args.class,
										"grid grid-cols-subgrid col-span-full hover:bg-hover/50 active:bg-hover",
										args.index % 2 === 1 && "bg-subtle/40 dark:bg-surface/30",
									)}
								>
									<For each={props.selectedFields}>
										{(field) => {
											const value = extractField(args.item, field, meta);

											return (
												<div
													role="cell"
													class="border-be-[0.07rem] border-e-[0.07rem] first-of-type:border-s-[0.07rem] border-border px-3 py-2"
												>
													<span class="inline-block w-max tabular-nums">
														{value}
													</span>
												</div>
											);
										}}
									</For>
								</div>
							)}
						/>
					</Show>
				</div>
			</div>
		</Show>
	);
}
