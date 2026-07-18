import type { PAPER_TYPE } from "~/types";
import type { SchemaToTuple } from "./helpers";

export type EncodedResultT = SchemaToTuple<typeof EncodedResult>;
export const EncodedResult = {
    name: { loc: 0, _type: 0 as unknown as string },
    roll: { loc: 1, _type: 0 as unknown as string },
    grandTotalMax: { loc: 2, _type: 0 as unknown as number },
    grandTotalPassing: { loc: 3, _type: 0 as unknown as number },
    grandTotalObtained: { loc: 4, _type: 0 as unknown as number },
    subjects: { loc: 5, _type: 0 as unknown as EncodedSubjectT[] },
    sgpa: { loc: 6, _type: 0 as unknown as number },
    cgpa: { loc: 7, _type: 0 as unknown as null | number },
    remarks: { loc: 8, _type: 0 as unknown as number },
} as const;

export type EncodedSubjectT = SchemaToTuple<typeof EncodedSubject>;
export const EncodedSubject = {
    name: { loc: 0, _type: 0 as unknown as number },
    type: { loc: 1, _type: 0 as unknown as PAPER_TYPE },
    credits: { loc: 2, _type: 0 as unknown as number },

    internalMax: { loc: 3, _type: 0 as unknown as number },
    internalObtained: { loc: 4, _type: 0 as unknown as number },

    externalMax: { loc: 5, _type: 0 as unknown as number },
    externalPassing: { loc: 6, _type: 0 as unknown as number },
    externalObtained: { loc: 7, _type: 0 as unknown as number },

    totalMax: { loc: 8, _type: 0 as unknown as number },
    totalPassing: { loc: 9, _type: 0 as unknown as number },
    totalObtained: { loc: 10, _type: 0 as unknown as number },

    grade: { loc: 11, _type: 0 as unknown as string },
} as const;
