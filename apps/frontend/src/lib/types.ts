export enum SearchBy {
    Roll = "Roll",
    Name = "Name",
}

export enum SortBy {
    Marks = "Marks",
    sgpa = "SGPA",
    Name = "Name",
    Roll = "Roll No",
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
