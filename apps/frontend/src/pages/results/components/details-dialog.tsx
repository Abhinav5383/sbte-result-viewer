import { apiUrl } from "@app/shared/consts";
import type { SubjectDetail } from "@app/shared/dto";
import { PAPER_NAME, PAPER_TYPE } from "@app/shared/types";
import ExternalLinkIcon from "lucide-solid/icons/external-link";
import XIcon from "lucide-solid/icons/x";
import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { BranchBadge } from "~/components/misc/badges";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import BouncingDotsLoader from "~/components/ui/loaders/bouncing-dots";
import { Select } from "~/components/ui/select";
import { cn, OrdinalSuffix } from "~/components/utils";
import { useMeta } from "~/hooks/use-meta";
import { useResultDetail } from "~/hooks/use-result-detail";
import { alphabeticalGradeClass, marksClass, sgpaClass } from "~/lib/grade-utils";

interface DetailsDialogProps {
	open: boolean;
	onClose: () => void;
	roll: string | null;
}

export function DetailsDialog(props: DetailsDialogProps) {
	const meta = useMeta();
	const [selectedSemesterRoll, setSelectedSemesterRoll] = createSignal<string>("");

	const { data, loading, error } = useResultDetail(() => (props.open && props.roll) || null);

	function closeDialog() {
		props.onClose();
	}

	createEffect(() => {
		if (!props.open) {
			setSelectedSemesterRoll("");
			return;
		}
		const d = data();
		if (d) {
			const current = selectedSemesterRoll();
			const hasCurrent = d.results?.some((r) => r.roll === current);
			if (!hasCurrent) {
				setSelectedSemesterRoll(d.result.roll);
			}
		}
	});

	const activeResult = createMemo(() => {
		const d = data();
		if (!d) return undefined;
		const selRoll = selectedSemesterRoll();
		if (selRoll && d.results) {
			const found = d.results.find((r) => r.roll === selRoll);
			if (found) return found;
		}
		return d.result;
	});

	function semesterSelector() {
		const d = data();
		if (!d) return undefined;
		const results = d.results ?? [];
		const current = activeResult();
		if (!current) return undefined;

		if (results.length <= 1) {
			return current.semester.toString();
		}

		return (
			<div class="inline-block">
				<Select
					value={current.roll}
					onChange={(val) => setSelectedSemesterRoll(val)}
					options={results.map((r) => ({
						label: `${r.semester}${OrdinalSuffix(r.semester)} sem`,
						value: r.roll,
					}))}
					class="min-w-0 w-fit border-transparent min-h-0 bg-surface text-current"
					triggerClass="min-h-0 p-0 gap-1 ps-1 pe-0.5 text-sm"
				/>
			</div>
		);
	}

	return (
		<Dialog open={props.open} onClose={closeDialog} dialogProps={{ class: "rounded-xl" }}>
			<Show
				when={!loading() && data()}
				fallback={
					<div class="flex flex-col items-center justify-center gap-4 py-24 px-6 min-h-[360px] text-dim-fg">
						<Show
							when={!loading() && (error() || !data())}
							fallback={
								<div class="flex flex-col items-center gap-3">
									<BouncingDotsLoader class="w-24 text-accent-fg" />
									<span class="text-sm font-semibold italic">
										Loading result...
									</span>
								</div>
							}
						>
							<span class="text-lg font-semibold text-rose-600 dark:text-rose-400">
								{error() || "Result not found"}
							</span>
							<Button variant="primary-alt" onClick={closeDialog}>
								Close
							</Button>
						</Show>
					</div>
				}
			>
				{(val) => {
					const detail = () => activeResult() ?? val().result;
					const roll = () => detail().roll;
					const branchName = () => meta.getBranchName(detail().branch_code);
					const collegeFullName = () => meta.getCollegeFullName(detail().college_code);

					return (
						<div class="@container">
							<div class="grid gap-y-1 p-6 bg-accent-bg text-zinc-50">
								<div class="flex flex-wrap items-center gap-x-3 pe-12">
									<h1 class="text-3xl font-extrabold">{detail().name}</h1>

									<BranchBadge
										branch={branchName()}
										semester={semesterSelector()}
									/>

									<Show when={detail().cgpa_x100}>
										{(cgpa) => (
											<span
												class={`branch-badge ${branchName().toLowerCase()} inline-block ps-2 pe-0.5 rounded-lg text-sm`}
											>
												CGPA
												<em class="inline-block not-italic ms-1 px-1.5 py-0.5 my-0.5 bg-white/75 dark:bg-black/30 rounded-md">
													{(cgpa() / 100).toFixed(2)}
												</em>
											</span>
										)}
									</Show>
								</div>

								<span class="text-accent-bg-text font-medium">
									{collegeFullName()}
								</span>

								<div class="flex flex-wrap items-center gap-x-3">
									<span class="font-semibold py-1 tabular-nums">{roll()}</span>
									<a
										href={apiUrl(roll())}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center font-medium gap-1 text-sm px-2 py-1 rounded-md text-white underline decoration-white/50 hover:text-accent-fg hover:bg-white transition-colors"
									>
										View original PDF
										<ExternalLinkIcon />
									</a>
								</div>
							</div>

							<div class="grid gap-4 p-4">
								<div class="grid grid-cols-1 xs:grid-cols-2 gap-4">
									<div class="grid gap-1 place-items-center bg-surface rounded-lg p-6 border-[0.07rem] border-border-subtle">
										<h2 class="uppercase font-semibold text-dim-fg text-sm">
											Obtained Marks
										</h2>
										<span
											class={cn(
												"text-4xl font-bold",
												marksClass(
													detail().total_obtained,
													detail().total_max,
												),
											)}
										>
											{detail().total_obtained}
										</span>
										<span class="text-dim-fg">Out of {detail().total_max}</span>
									</div>

									<div class="grid gap-1 place-items-center bg-surface rounded-lg p-6 border-[0.07rem] border-border-subtle">
										<h2 class="uppercase font-semibold text-dim-fg text-sm">
											SGPA
										</h2>
										<span
											class={cn(
												"text-4xl font-bold",
												sgpaClass(detail().sgpa_x100 / 100),
											)}
										>
											{(detail().sgpa_x100 / 100).toFixed(2)}
										</span>
										<span class="text-dim-fg">{detail().remark}</span>
									</div>
								</div>

								<div class="grid gap-6">
									<For each={Object.values(PAPER_TYPE)}>
										{(paperType) => (
											<SubjectCategory
												title={
													PAPER_NAME[paperType as keyof typeof PAPER_NAME]
												}
												subjects={detail().subjects.filter(
													(sub) => sub.type === paperType,
												)}
											/>
										)}
									</For>
								</div>
							</div>
						</div>
					);
				}}
			</Show>

			<div class="absolute inset-bs-5 inset-e-4 flex items-center gap-2">
				<Button
					variant="secondary"
					size="icon"
					class="rounded-full bg-surface text-normal-fg hover:text-accent-fg"
					onClick={closeDialog}
				>
					<XIcon />
				</Button>
			</div>
		</Dialog>
	);
}

interface SubjectCategoryProps {
	title: string;
	subjects: SubjectDetail[];
}

function SubjectCategory(props: SubjectCategoryProps) {
	return (
		<Show when={props.subjects.length > 0}>
			<div class="grid grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-3 gap-3 border-bs-[0.07rem] border-border mt-3 pt-3">
				<span class="capitalize text-xl font-bold text-dim-fg col-span-full">
					{props.title}
				</span>
				<For each={props.subjects}>
					{(subject) => <SubjectMarksDetails sub={subject} />}
				</For>
			</div>
		</Show>
	);
}

function SubjectMarksDetails(props: { sub: SubjectDetail }) {
	return (
		<div class="grid gap-3 bg-surface rounded-lg px-4 py-3 border-[0.07rem] border-border-subtle tabular-nums">
			<div class="h-fit flex gap-3 items-center">
				<span class="text-lg leading-tight font-medium">{props.sub.name}</span>
				<span
					class={cn(
						"bg-current/10 px-2 py-0.5 self-start ms-auto mt-[0.15em] rounded-md text-xs font-bold",
						alphabeticalGradeClass(props.sub.grade),
					)}
				>
					{props.sub.grade}
				</span>
			</div>

			<SubjectMarksRow sub={props.sub} />
		</div>
	);
}

function MarksDivider() {
	return <span class="leading-none text-[0.9em] text-dim-fg/50">/</span>;
}

function SubjectMarksRow(props: { sub: SubjectDetail }) {
	return (
		<div class="grid gap-x-1 gap-y-3 grid-cols-[repeat(4,max-content)] font-medium text-xs text-dim-fg [&>div>*:not(:first-child)]:justify-self-end">
			<Show
				when={props.sub.external.max}
				fallback={
					<div class="grid items-end col-span-full grid-cols-subgrid">
						<span class="trim-both">Internal:</span>
						<span
							class={cn(
								"trim-both font-semibold text-lg",
								marksClass(props.sub.total.obtained ?? 0, props.sub.total.max ?? 1),
							)}
						>
							{props.sub.internal.obtained ?? "-"}
						</span>

						<MarksDivider />
						<span class="trim-both">{props.sub.internal.max}</span>
					</div>
				}
			>
				<div class="grid items-end col-span-full grid-cols-subgrid">
					<span class="trim-both">External:</span>
					<span class="trim-both font-semibold text-normal-fg">
						{props.sub.external.obtained ?? "-"}
					</span>

					<MarksDivider />
					<span class="trim-both">{props.sub.external.max}</span>
				</div>

				<div class="grid items-end col-span-full grid-cols-subgrid">
					<span class="trim-both">Internal:</span>
					<span class="trim-both font-semibold text-normal-fg">
						{props.sub.internal.obtained ?? "-"}
					</span>

					<MarksDivider />
					<span class="trim-both">{props.sub.internal.max}</span>
				</div>

				<div class="grid items-end col-span-full grid-cols-subgrid">
					<span class="trim-both">Total:</span>
					<span
						class={cn(
							"trim-both font-semibold text-lg",
							marksClass(props.sub.total.obtained ?? 0, props.sub.total.max ?? 1),
						)}
					>
						{props.sub.total.obtained ?? "-"}
					</span>

					<MarksDivider />
					<span class="trim-both">{props.sub.total.max}</span>
				</div>
			</Show>
		</div>
	);
}
