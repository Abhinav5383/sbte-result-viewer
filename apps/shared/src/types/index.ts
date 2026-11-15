import type { PAPER_TYPE } from "./subject";

export * from "./subject";

export interface ParsedResult {
	student: {
		name: string;
		roll: string;
		branch: number;
		college: number;
	};
	grandTotal: {
		maximum: number;
		passing: number;
		obtained: number;
	};
	subjects: SubjectResult[];
	sgpa: number;
	cgpa: number | null;
	remarks: string;
}

export interface SubjectResult {
	name: string;
	type: PAPER_TYPE;
	credits: number | null;
	internal: {
		max: number;
		obtained: number;
	};
	external: {
		max: number;
		passing: number;
		obtained: number;
	};
	total: {
		max: number;
		passing: number;
		obtained: number;
	};
	grade: string;
}
