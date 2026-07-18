import { EncodedResult, type EncodedResultT, EncodedSubject, type EncodedSubjectT } from "./schema";

type FindByLoc<Schema, Loc extends number> = {
    [Key in keyof Schema]: Schema[Key] extends { loc: Loc; _type: infer T } ? T : never;
}[keyof Schema];

export type SchemaToTuple<Schema, CurrentLoc extends number = 0, ResultTuple extends unknown[] = []> =
    FindByLoc<Schema, CurrentLoc> extends never
        ? ResultTuple
        : SchemaToTuple<
              Schema,
              [...ResultTuple, unknown]["length"] & number,
              [...ResultTuple, FindByLoc<Schema, CurrentLoc>]
          >;

export function mapToArray<T>(map: Map<number, T>): T[] {
    const arr: T[] = [];
    for (let i = 0; i < map.size; i++) {
        const value = map.get(i);
        if (value === undefined) throw new Error(`Missing value for index ${i}`);
        arr.push(value);
    }

    return arr;
}

export function getVal<Key extends keyof typeof EncodedResult>(
    item: unknown[],
    field: Key,
): (typeof EncodedResult)[Key]["_type"] {
    const idx = EncodedResult[field].loc;
    return item[idx as number] as any;
}

export function getValSub<Key extends keyof typeof EncodedSubject>(
    item: unknown[],
    field: Key,
): (typeof EncodedSubject)[Key]["_type"] {
    const idx = EncodedSubject[field].loc;
    return item[idx as number] as any;
}
