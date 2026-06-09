import { getAllCollegeBranches } from "./utils";

export default {
    STORE_DIR: "./../../generated",
    RESULTS_DATABASE: "saved-results.json",
    INVALID_ROLLS_STORE: "invalid-rolls.txt",
    BRANCHES_LIST: getAllCollegeBranches(),
};
