import type { Enumify } from "./helpers";

export type PAPER_TYPE = Enumify<typeof PAPER_TYPE>;
export const PAPER_TYPE = {
    THEORY: 1,
    PRACTICAL: 2,
    TERM_WORK: 3,
} as const;

export type PAPER_NAME = Enumify<typeof PAPER_NAME>;
export const PAPER_NAME = {
    [PAPER_TYPE.THEORY]: "Theory",
    [PAPER_TYPE.PRACTICAL]: "Practical",
    [PAPER_TYPE.TERM_WORK]: "Term Work",
} as const satisfies Record<PAPER_TYPE, string>;
