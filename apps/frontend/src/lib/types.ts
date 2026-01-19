export enum SearchBy {
    Roll = "Roll",
    Name = "Name",
}

export enum SortBy {
    Roll = "Roll",
    Name = "Name",
    Marks = "Marks",
    sgpa = "SGPA",
}

export enum SortOrder {
    Ascending = "Ascending",
    Descending = "Descending",
}

export interface Filters {
    college: string;
    branch: string;
    semester: string;
}
