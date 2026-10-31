import type { EncodedResultT } from "@app/shared/encoder";
import type { SortBy, SortOrder } from "~/lib/types";

export interface LeaderboardStudent {
    id: string; // registration number: roll.slice(2)
    results: EncodedResultT[];
}

export interface LeaderboardEntry {
    student: LeaderboardStudent;
    matchedResults: EncodedResultT[];
    totalObtained: number;
    totalMax: number;
    percentage: number;
    avgSgpa: number;
}

export interface SortedLeaderboard {
    results: LeaderboardEntry[];
    sortedBy: SortBy;
    sortOrder: SortOrder;
}
