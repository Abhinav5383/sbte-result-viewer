export function getCollegeCodeStrFromRoll(roll: string): string {
	return roll.substring(2, 5);
}

export function getCollegeCodeFromRoll(roll: string): number {
	return Number.parseInt(getCollegeCodeStrFromRoll(roll), 10);
}

export function getBranchCodeStrFromRoll(roll: string): string {
	return roll.substring(5, 7);
}

export function getBranchCodeFromRoll(roll: string): number {
	return Number.parseInt(getBranchCodeStrFromRoll(roll), 10);
}

export function getSemesterFromRoll(roll: string): number {
	return Number.parseInt(roll.substring(0, 1), 10);
}

export function getSessionFromRoll(roll: string): string {
	return roll.substring(7, 9);
}

export function getRegNoFromRoll(roll: string) {
	return roll.slice(2);
}
