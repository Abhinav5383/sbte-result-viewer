import { PAPER_TYPE, type ParsedResult, type SubjectResult } from "@app/shared/types";
import { getCollegeCodeFromRoll } from "@app/shared/utils";

export function parseTxtToJson(txt: string): ParsedResult {
	const lines = txt.split("\n").map((line) => line.trim());

	const result: ParsedResult = {
		student: {
			name: "",
			roll: "",
			branch: 0,
			college: 0,
		},
		grandTotal: {
			maximum: 0,
			passing: 0,
			obtained: 0,
		},
		subjects: [],
		sgpa: -1,
		cgpa: null,
		remarks: "",
	};

	let parsingSubject: PAPER_TYPE | null = null;

	for (const line of lines) {
		if (line.length < 1) continue;
		if (line.split("-").length >= line.length / 2) {
			parsingSubject = null;
			continue;
		}

		const lineLower = line.toLowerCase();

		if (lineLower.startsWith("roll no")) {
			const roll = line.split(":")[1]?.trim();
			if (roll) result.student.roll = roll;
		} else if (lineLower.startsWith("following are the marks obtained by")) {
			const name = line.replace(/following are the marks obtained by/i, "").trim();
			const formattedName = name
				.split(" ")
				.map((p) => {
					return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
				})
				.join(" ");
			result.student.name = formattedName;
		}

		// subject sections
		else if (lineLower.includes("theory papers")) {
			parsingSubject = PAPER_TYPE.THEORY;
		} else if (lineLower.includes("practical papers")) {
			parsingSubject = PAPER_TYPE.PRACTICAL;
		} else if (lineLower.includes("term work papers")) {
			parsingSubject = PAPER_TYPE.TERM_WORK;
		} else if (parsingSubject) {
			const subjectResult = parseSubjectLine(line, parsingSubject);
			if (subjectResult) {
				result.subjects.push(subjectResult);
			}
		}

		// grand total
		else if (lineLower.startsWith("grand total")) {
			const parts = line
				.split(" ")
				.map((p) => p.trim())
				.filter((p) => p.length);
			const maxMarksStr = parts[parts.length - 2] || "0";
			const obtainedStr = parts[parts.length - 1] || "0";

			const maximum = Number.parseInt(maxMarksStr, 10);
			const obtained = Number.parseInt(obtainedStr, 10);

			result.grandTotal.maximum = maximum;
			result.grandTotal.obtained = obtained;
		}

		// sgpa
		else if (lineLower.startsWith("sgpa") || lineLower.startsWith("cgpa")) {
			const parts = line
				.split(" ")
				.map((p) => p.trim())
				.filter((p) => p.length);
			const gpaStr = parts[parts.length - 1] || "0";
			const gpa = Number.parseFloat(gpaStr);

			const isSGPA = lineLower.startsWith("sgpa");
			if (isSGPA) {
				result.sgpa = gpa || 0;
			} else {
				result.cgpa = gpa || 0;
			}
		}

		// remarks
		else if (lineLower.startsWith("remarks")) {
			const remarksPart = line.split(":")[1]?.trim();
			if (remarksPart) {
				result.remarks = remarksPart;
			}
		}
	}

	// either because SGPA wasn't parsed correctly or because it's a final sem result card
	if (result.sgpa === -1) {
		let totalPoints = 0;
		let totalCredits = 0;

		let failedAny = false;
		for (const sub of result.subjects) {
			const point = getGradePoint(sub.grade);
			const credits = sub.credits ?? 0;
			totalPoints += point * credits;
			totalCredits += credits;

			if (point === 0) failedAny = true;
		}

		// If failed in any subject, SGPA is considered 0
		if (failedAny) {
			result.sgpa = 0;
		} else if (totalCredits > 0) {
			result.sgpa = Math.round((totalPoints / totalCredits) * 100) / 100;
		}
	}

	for (const sub of result.subjects) {
		result.grandTotal.passing += sub.total.passing;
	}

	result.student.college = getCollegeCodeFromRoll(result.student.roll) || 0;
	return result;
}

function parseSubjectLine(line: string, paperType: PAPER_TYPE): SubjectResult | null {
	const parts = line
		.split(" ")
		.map((p) => p.trim())
		.filter((p) => p.length);

	const marksParts = parts.slice(-10);
	const subName = parts.slice(0, parts.length - 10).join(" ");
	const formattedSubName = subName.charAt(0).toUpperCase() + subName.slice(1).toLowerCase();

	if (marksParts.length < 10) return null;

	const parsedCredits = Number.parseFloat(marksParts[0]);
	const credits = Number.isNaN(parsedCredits) ? null : parsedCredits;

	// total
	const totalMax = parseMarks(marksParts[3]);
	const totalPassing = parseMarks(marksParts[5]);
	const totalObtained = parseMarks(marksParts[8]);

	// external
	const externalMax = parseMarks(marksParts[2]);
	const externalPassing = parseMarks(marksParts[4]);
	const externalObtained = parseMarks(marksParts[7]);

	// internal
	const internalMax = parseMarks(marksParts[1]);
	const internalObtained = parseMarks(marksParts[6]);

	const grade = marksParts[9]?.trim() ?? "";

	return {
		name: formattedSubName,
		type: paperType,

		total: {
			max: totalMax,
			passing: totalPassing,
			obtained: totalObtained,
		},
		external: {
			max: externalMax,
			passing: externalPassing,
			obtained: externalObtained,
		},
		internal: {
			max: internalMax,
			obtained: internalObtained,
		},

		credits: credits,
		grade: grade,
	} satisfies SubjectResult;
}

function parseMarks(marks: string) {
	if (marks === "-") return 0;

	const parsed = Number.parseInt(marks, 10);
	if (Number.isNaN(parsed)) return 0;

	return parsed;
}

function getGradePoint(grade: string): number {
	switch (grade.toUpperCase().trim()) {
		case "A+":
			return 10;
		case "A":
			return 9;
		case "B":
			return 8;
		case "C":
			return 7;
		case "D":
			return 6;
		case "P":
			return 5;
		case "F":
			return 0;
		default:
			return 0;
	}
}
