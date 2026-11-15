export interface ExamSemester {
	semester: number;
	admissionYear: number;
}

export interface ExamConfig {
	name: string;
	semesters: ExamSemester[];
}

/**
 * Automatically determine the exam config based on the date.
 * - June to November (months 5 to 10): Odd semester preset (1st, 3rd, 5th).
 *   Admissions take place in July, so 1st semester students have admissionYear = current year.
 * - December to May: Even semester preset (2nd, 4th, 6th).
 *   Students are from the previous 3 admission years.
 */
export function getExamPreset(date: Date = new Date()): ExamConfig {
	const year = date.getFullYear();
	const month = date.getMonth(); // 0-indexed: 0 = Jan, 5 = June, 10 = Nov, 11 = Dec

	const isOdd = month >= 5 && month <= 10;

	if (isOdd) {
		return {
			name: `December ${year} Exam (Odd Semesters: 1st, 3rd, 5th)`,
			semesters: [
				{ semester: 1, admissionYear: year },
				{ semester: 3, admissionYear: year - 1 },
				{ semester: 5, admissionYear: year - 2 },
			],
		};
	}

	// Even semester exam (Dec through May)
	const examYear = month === 11 ? year + 1 : year;
	return {
		name: `May ${examYear} Exam (Even Semesters: 2nd, 4th, 6th)`,
		semesters: [
			{ semester: 2, admissionYear: examYear - 1 },
			{ semester: 4, admissionYear: examYear - 2 },
			{ semester: 6, admissionYear: examYear - 3 },
		],
	};
}

export const CURRENT_EXAM_CONFIG: ExamConfig = getExamPreset();
