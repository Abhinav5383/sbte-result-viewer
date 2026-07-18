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
