enum GradeClass {
    EXCELLENT = "class-excellent",
    GOOD = "class-good",
    AVERAGE = "class-average",
    PASS = "class-pass",
    FAIL = "class-fail",
}

export function sgpaClass(sgpa: number) {
    if (sgpa >= 8.5) {
        return GradeClass.EXCELLENT;
    } else if (sgpa >= 7.0) {
        return GradeClass.GOOD;
    } else if (sgpa >= 5.5) {
        return GradeClass.AVERAGE;
    } else if (sgpa >= 4.0) {
        return GradeClass.PASS;
    } else {
        return GradeClass.FAIL;
    }
}

export function marksClass(obtained: number, total: number) {
    const percentage = (obtained / total) * 100;

    if (percentage >= 85) {
        return GradeClass.EXCELLENT;
    } else if (percentage >= 70) {
        return GradeClass.GOOD;
    } else if (percentage >= 55) {
        return GradeClass.AVERAGE;
    } else if (percentage >= 40) {
        return GradeClass.PASS;
    } else {
        return GradeClass.FAIL;
    }
}

export function alphabeticalGradeClass(grade: string) {
    switch (grade.toUpperCase()) {
        case "A+":
        case "A":
        case "A-":
            return GradeClass.EXCELLENT;
        case "B+":
        case "B":
        case "B-":
            return GradeClass.GOOD;
        case "C+":
        case "C":
        case "C-":
            return GradeClass.AVERAGE;
        case "D":
            return GradeClass.PASS;
        case "F":
            return GradeClass.FAIL;
        default:
            return GradeClass.FAIL;
    }
}
