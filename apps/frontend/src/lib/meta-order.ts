import { type BranchMeta, type CollegeMeta, CollegeType } from "@app/shared/dto";

const PINNED_COLLEGE = "NGP Patna-13";
export const PRIORITY_BRANCH_COUNT = 7;

export function sortColleges(colleges: CollegeMeta[]): CollegeMeta[] {
	return colleges
		.slice()
		.sort(
			(a, b) =>
				Number(b.short_name === PINNED_COLLEGE) - Number(a.short_name === PINNED_COLLEGE) ||
				Number(b.type === CollegeType.GOVT) - Number(a.type === CollegeType.GOVT) ||
				a.short_name.localeCompare(b.short_name),
		);
}

export function totalSeatsByBranch(colleges: CollegeMeta[]): Map<number, number> {
	const seats = new Map<number, number>();
	for (const c of colleges) {
		for (const b of c.branches) {
			seats.set(b.code, (seats.get(b.code) ?? 0) + b.seats + b.extra_seats);
		}
	}
	return seats;
}

export function sortBranches(branches: BranchMeta[], colleges: CollegeMeta[]): BranchMeta[] {
	const seats = totalSeatsByBranch(colleges);
	const seatsOf = (b: BranchMeta) => seats.get(b.code) ?? 0;
	const byName = (a: BranchMeta, b: BranchMeta) => a.name.localeCompare(b.name);

	const bySeats = branches.slice().sort((a, b) => seatsOf(b) - seatsOf(a) || byName(a, b));

	return [
		...bySeats.slice(0, PRIORITY_BRANCH_COUNT).sort(byName),
		...bySeats.slice(PRIORITY_BRANCH_COUNT).sort(byName),
	];
}
