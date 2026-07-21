export interface GroupStudent {
    id: string;
    name: string;
    roll: string;
}

export interface GeneratedGroup {
    groupId: number;
    students: GroupStudent[];
}
