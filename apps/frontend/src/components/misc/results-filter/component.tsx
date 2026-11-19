import SearchIcon from "lucide-solid/icons/search";
import { Button } from "~/components/ui/button";
import MultiSelect from "~/components/ui/multi-select";
import { Select } from "~/components/ui/select";
import { OrdinalSuffix } from "~/components/utils";
import { useDebouncedState } from "~/hooks/use-debounce";
import { useMeta } from "~/hooks/use-meta";
import { type FilterControls, SortBy, SortDirection } from "./types";
import { untrack } from "solid-js";

export interface ResultsFilterProps {
	hook: FilterControls;
	hideFilters?: string[];
	alwaysShowSort?: boolean;
	sortOptions?: { value: SortBy; label: string }[];
}

export function ResultsFilter(props: ResultsFilterProps) {
	const meta = useMeta();
	const res = props.hook;

	const collegeOptions = () => {
		const selectedBranches = new Set(res.branch());
		const selectedColleges = new Set(untrack(res.college));

		return meta
			.colleges()
			.filter(
				(c) =>
					selectedBranches.size === 0 ||
					selectedColleges.has(c.code) ||
					c.branches.some((b) => selectedBranches.has(b.code)),
			)
			.map((c) => ({
				value: c.short_name,
				label: c.short_name,
				keywords: [c.full_name, String(c.code)],
			}));
	};

	const branchOptions = () => {
		const selectedColleges = new Set(res.college());
		const selectedBranches = new Set(untrack(res.branch));

		const available = new Set<number>();
		for (const c of meta.colleges()) {
			if (selectedColleges.has(c.code)) {
				for (const b of c.branches) available.add(b.code);
			}
		}

		return meta
			.branches()
			.filter(
				(b) =>
					selectedColleges.size === 0 ||
					available.has(b.code) ||
					selectedBranches.has(b.code),
			)
			.map((b) => ({
				value: b.name,
				label: b.name,
			}));
	};

	const semesterOptions = () =>
		meta.semesters().map((sem) => ({
			value: sem.toString(),
			label: `${sem}${OrdinalSuffix(sem.toString())} Semester`,
		}));

	const sessionOptions = () =>
		meta
			.sessions()
			.slice()
			.sort((a, b) => b.localeCompare(a))
			.map((s) => ({
				value: s,
				label: s.length === 2 ? `20${s}` : s,
			}));

	const debouncedSearch = useDebouncedState(
		() => res.query(),
		(val) => res.setQuery(val),
		{ delay: 2000 },
	);

	return (
		<>
			<div hidden={props.hideFilters?.includes("query")}>
				<label for="search-input" class="w-fit">
					Search
				</label>
				<div class="relative">
					<input
						id="search-input"
						type="text"
						autocomplete="off"
						spellcheck={false}
						placeholder="Search by name or roll..."
						value={debouncedSearch.value()}
						onInput={(e) => debouncedSearch.setValue(e.currentTarget.value)}
						onBlur={() => debouncedSearch.flush()}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								debouncedSearch.flush();
							}
						}}
						class="no-focus-ring border-border focus:border-accent-bg w-full"
					/>
					<Button
						variant="primary-alt"
						size="icon-sm"
						onClick={debouncedSearch.flush}
						class="grid place-content-center absolute rounded aspect-square inset-y-1 inset-e-1"
					>
						<SearchIcon />
					</Button>
				</div>
			</div>

			<div hidden={props.hideFilters?.includes("college")}>
				<label for="college-filter">College</label>
				<MultiSelect
					id="college-filter"
					selected={res.collegeNames()}
					onChange={res.setCollege}
					options={collegeOptions()}
					placeholder="All Colleges"
					immediate={false}
				/>
			</div>

			<div hidden={props.hideFilters?.includes("branch")}>
				<label for="branch-filter">Branch</label>
				<MultiSelect
					id="branch-filter"
					selected={res.branchNames()}
					onChange={res.setBranch}
					options={branchOptions()}
					placeholder="All Branches"
					immediate={false}
				/>
			</div>

			<div hidden={props.hideFilters?.includes("session")}>
				<label for="session-filter">Admission year</label>
				<MultiSelect
					id="session-filter"
					selected={res.session()}
					onChange={res.setSession}
					options={sessionOptions()}
					placeholder="All Sessions"
					immediate={false}
				/>
			</div>

			<div hidden={props.hideFilters?.includes("semester")}>
				<label for="semester-filter">Semester</label>
				<MultiSelect
					id="semester-filter"
					selected={res.semester().map((s) => s.toString())}
					onChange={(list) =>
						res.setSemester(
							list.map((v) => Number.parseInt(v, 10)).filter((n) => !Number.isNaN(n)),
						)
					}
					options={semesterOptions()}
					placeholder="All Semesters"
					immediate={false}
				/>
			</div>

			<div class={props.alwaysShowSort ? "" : "@min-desktop:hidden"}>
				<label for="mb-sort">Sort By</label>
				<div class="grid gap-y-3 grid-cols-1 @min-mobile:grid-cols-[3fr_max-content]">
					<Select
						id="mb-sort"
						value={res.sortBy()}
						onChange={(v) => res.setSortFilter(v as SortBy, res.sortOrder())}
						options={
							props.sortOptions ?? [
								{ value: SortBy.MARKS, label: "Marks" },
								{ value: SortBy.SGPA, label: "SGPA" },
								{ value: SortBy.NAME, label: "Name" },
								{ value: SortBy.ROLL, label: "Roll" },
							]
						}
						class="@min-mobile:rounded-e-none"
					/>

					<Select
						id="mb-order"
						value={res.sortOrder()}
						onChange={(v) => res.setSortFilter(res.sortBy(), v as SortDirection)}
						options={[
							{ value: SortDirection.DESC, label: "Descending" },
							{ value: SortDirection.ASC, label: "Ascending" },
						]}
						class="@min-mobile:rounded-s-none @min-mobile:border-s-0"
					/>
				</div>
			</div>
		</>
	);
}
