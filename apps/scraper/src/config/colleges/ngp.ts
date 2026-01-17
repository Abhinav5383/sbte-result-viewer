import { generateBranchConfig } from "../utils";

const COLLEGE_CODE = 121;
export const BRANCHES = generateBranchConfig(COLLEGE_CODE, [
    { sem: 1, admissionYear: 2025 },
    { sem: 3, admissionYear: 2024 },
    { sem: 5, admissionYear: 2023 },
]);
