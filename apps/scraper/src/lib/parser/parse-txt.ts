import { BRANCH_NAME, COLLEGE_NAME, PAPER_TYPE, type ParsedResult, type SubjectResult } from "@app/shared/types";
import { getCollegeFromRoll } from "@app/shared/utils";

export function parseTxtToJson(txt: string): ParsedResult {
    const lines = txt.split("\n").map((line) => line.trim());

    const result: ParsedResult = {
        student: {
            name: "",
            roll: "",
            branch: BRANCH_NAME.UNKNOWN,
            college: COLLEGE_NAME.UNKNOWN,
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
        } else if (lineLower.includes("of diploma in")) {
            const branchPart = lineLower.split("of diploma in")[1];
            if (branchPart) {
                result.student.branch = mapBranchStrToEnum(branchPart);
            }
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
            totalPoints += point * sub.credits;
            totalCredits += sub.credits;

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

    result.student.college = getCollegeFromRoll(result.student.roll);
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

    const credits = Number.parseFloat(marksParts[0]);

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

function mapBranchStrToEnum(_str: string) {
    const str = _str.toLowerCase().trim();

    if (str.includes("civil")) return BRANCH_NAME.CIVIL;
    if (str.includes("computer")) return BRANCH_NAME.CSE;
    if (str.includes("electrical")) return BRANCH_NAME.ELECTRICAL;
    if (str.includes("electronics")) return BRANCH_NAME.ELECTRONICS;
    if (str.includes("automobile")) return BRANCH_NAME.AUTOMOBILE;
    if (str.includes("mechanical")) return BRANCH_NAME.MECHANICAL;

    return BRANCH_NAME.UNKNOWN;
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

// ---- example text that is to be parsed ------

// Registration No : 1211825301
// Roll No : 111211825301
// Following are the marks obtained by ABHINAV KUMAR
// of New Government Polytechnic, Patna - 13
// at Semester I of Diploma in Computer Science and Engineering
// Examination 2025 (ODD) held in the month of DEC, 2025
// Result Published On: 16/01/2026
// STATE BOARD OF TECHNICAL EDUCATION
// BIHAR
// (PROVISIONAL)
// -------------------------------------------------------------------------------------------
// SUBJECT FULL MARKS PASS MARKS MARKS OBTAINED
// NAME OF SUBJECTS CREDITS INT FIN TOTAL FIN TOTAL INT FIN TOTAL GRADE
// -------------------------------------------------------------------------------------------
// THEORY PAPERS
// INDIAN CONSTITUTION 1.0 25 - 025 - 10 24 - 24 A+
// OPEN EDUCATIONAL RESOURCES 1.0 25 - 025 - 10 23 - 23 A+
// BASIC ENGG. MATHEMATICS 3.0 30 70 100 28 40 28 64 92 A+
// APPLIED PHYSICS -B 3.0 30 70 100 28 40 21 55 76 B
// FUNDAMENTAL OF IT SYSTEM 3.0 30 70 100 28 40 29 58 87 A
// FUND. OF ELECT & ELECTRO ENGG. 3.0 30 70 100 28 40 28 46 74 B
// -------------------------------------------------------------------------------------------
// PRACTICAL PAPERS
// APPLIED PHYSICS -B 2.0 20 30 050 - 20 16 27 43 A
// FUNDAMENTAL OF IT SYSTEM 2.0 20 30 050 - 20 19 28 47 A+
// ICT TOOLS 2.0 20 30 050 - 20 18 27 45 A+
// FUND. OF ELECT & ELECTRO ENGG. 2.0 20 30 050 - 20 18 26 44 A
// ELECTRICAL & ELECTRONICS W/P 2.0 20 30 050 - 20 18 27 45 A+
// -------------------------------------------------------------------------------------------
// TERM WORK PAPERS
// BASIC ENGG. MATHEMATICS 1.0 20 30 050 - 20 20 28 48 A+
// APPLIED PHYSICS -B 1.0 20 30 050 - 20 18 28 46 A+
// FUNDAMENTAL OF IT SYSTEM 1.0 20 30 050 - 20 20 28 48 A+
// ICT TOOLS 1.0 20 30 050 - 20 18 27 45 A+
// FUND. OF ELECT & ELECTRO ENGG. 1.0 20 30 050 - 20 18 26 44 A
// ELECTRICAL & ELECTRONICS W/P 1.0 20 30 050 - 20 17 27 44 A
// -------------------------------------------------------------------------------------------
// GRAND TOTAL 30 1000 875
// -------------------------------------------------------------------------------------------
// SGPA 9.30
// -------------------------------------------------------------------------------------------
// REMARKS : First Class with Distinction
// .

// ++++++++++++============================================+++++++++++

// ----------------- Final semester students have a bit different result card -----------------

// Registration No : 1211823005
// Roll No : 611211823005
// Following are the marks obtained by PARMANAND KUMAR
// of New Government Polytechnic, Patna - 13
// at Semester VI of Diploma in Computer Science & Engineering
// Examination 2026 (EVEN) held in the month of MAY, 2026
// Result Published On: 09/06/2026
// STATE BOARD OF TECHNICAL EDUCATION
// BIHAR
// (PROVISIONAL)
// -----------------------------------------------------------------------------------------------
// SUBJECT FULL MARKS PASS MARKS MARKS OBTAINED
// NAME OF SUBJECTS CREDITS INT FIN TOTAL FIN TOTAL INT FIN TOTAL GRADE
// -----------------------------------------------------------------------------------------------
// THEORY PAPERS
// ENTREPRENEURSHIP AND START-UPS 3 30 70 100 28 40 25 56 81 A
// SOFTWARE ENGINEERING 4 30 70 100 28 40 25 55 80 A
// DATA SC. ,D.W & D.M 3 30 70 100 28 40 24 62 86 A
// INTRODUCTION TO E-GOVERNANCE 3 30 70 100 28 40 30 55 85 A
// INTERNET OF THINGS (ADVANCE) 2 30 70 100 28 40 28 55 83 A
// -----------------------------------------------------------------------------------------------
// PRACTICAL PAPERS
// I.O.T.(ADV. LAB. 2 20 30 050 - 20 20 29 49 A+
// -----------------------------------------------------------------------------------------------
// TERM WORK PAPERS
// ENTREPRENEURSHIP & START UP 2 15 35 050 - 20 13 33 46 A+
// SOFTWARE ENGINEERING 2 15 35 050 - 20 13 32 45 A+
// INTERNET OF THINGS (ADVANCE) 1 20 30 050 - 20 20 29 49 A+
// MAJOR PROJECT & SEMINAR 2 15 35 050 - 20 15 34 49 A+
// -----------------------------------------------------------------------------------------------
// GRAND TOTAL 24 750 653
// -----------------------------------------------------------------------------------------------
// 40% of SEMESTER - I TO V EXAMS 1500 1186
// -----------------------------------------------------------------------------------------------
// AGGREGATE 2250 1839
// -----------------------------------------------------------------------------------------------
// CGPA 8.92
// -----------------------------------------------------------------------------------------------
// REMARKS : First Class with Distinction
