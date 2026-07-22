import type { EncodedResultT } from "@app/shared/encoder";
import { getVal } from "@app/shared/encoder/helpers";
import { BRANCH_NAME, COLLEGE_NAME } from "@app/shared/types";
import {
    getBranchCodeStrFromRoll,
    getBranchFromRoll,
    getCollegeCodeStrFromRoll,
    getCollegeFromRoll,
    getSessionFromRoll,
} from "@app/shared/utils";
import { createMemo, type JSX, Show } from "solid-js";
import { BranchBadge } from "~/components/misc/badges";
import VirtualList from "~/components/misc/virtual-list";
import { cn } from "~/components/utils";
import { getStudentId } from "./helpers";

type PreviewTableProps = {
    results: EncodedResultT[];
    scrollElement?: HTMLElement;
    actionButton: (props: { item: EncodedResultT }) => JSX.Element;
} & (
    | {
          selectedStudentIds: string[];
          isSelectedList?: false;
      }
    | {
          isSelectedList: true;
      }
);

export function PreviewTable(props: PreviewTableProps) {
    const hasMultiple = createMemo(() => {
        const branches = new Set<string>();
        const colleges = new Set<string>();
        const sessions = new Set<string>();

        for (const result of props.results) {
            const roll = getVal(result, "roll");

            if (branches.size <= 1) {
                branches.add(getBranchCodeStrFromRoll(roll));
            }

            if (colleges.size <= 1) {
                colleges.add(getCollegeCodeStrFromRoll(roll));
            }

            if (sessions.size <= 1) {
                sessions.add(getSessionFromRoll(roll));
            }

            if (branches.size > 1 && colleges.size > 1 && sessions.size > 1) {
                break;
            }
        }

        return {
            branch: branches.size > 1,
            session: sessions.size > 1,
            college: colleges.size > 1,
        };
    });

    const gridCols = createMemo(() => {
        const _hasMultiple = hasMultiple();

        const cols = ["auto", "2fr", "1.5fr"];
        if (_hasMultiple.branch) cols.push("1fr");
        if (_hasMultiple.college) cols.push("2fr");
        if (_hasMultiple.session) cols.push("1fr");
        cols.push("auto");
        return cols.join(" ");
    });

    return (
        <div class="grid overflow-x-auto" style={{ "grid-template-columns": gridCols() }}>
            <div class="grid grid-cols-subgrid col-span-full bg-zinc-700 text-zinc-200 font-semibold *:px-4 *:py-3">
                <div class="text-end">#</div>
                <div>Name</div>
                <div>Roll No.</div>
                <Show when={hasMultiple().branch}>
                    <div>Branch</div>
                </Show>
                <Show when={hasMultiple().college}>
                    <div>College</div>
                </Show>
                <Show when={hasMultiple().session}>
                    <div>Session</div>
                </Show>
                <div class="text-end" />
            </div>

            <VirtualList
                items={props.results}
                defaultRowHeight={52}
                containerProps={{ class: "grid col-span-full grid-cols-subgrid" }}
                scrollElement={props.scrollElement}
                RowComponent={(args) => {
                    const result = args.item;
                    const roll = getVal(result, "roll");
                    const studentId = getStudentId(result);

                    return (
                        <div
                            class={cn(
                                args.class,
                                "grid grid-cols-subgrid col-span-full items-center text-sm text-dim-fg border-be-[0.07rem] border-border py-2 *:px-4 *:min-w-max",
                            )}
                        >
                            <div class="tabular-nums text-end min-w-[7ch] text-current/50">{args.index + 1}</div>
                            <div class="font-medium text-base text-normal-fg">{getVal(result, "name")}</div>
                            <div class="tabular-nums">{studentId}</div>
                            <Show when={hasMultiple().branch}>
                                <div>
                                    <BranchBadge branch={BRANCH_NAME[getBranchFromRoll(roll)]} />
                                </div>
                            </Show>
                            <Show when={hasMultiple().college}>
                                <div>{COLLEGE_NAME[getCollegeFromRoll(roll)]}</div>
                            </Show>
                            <Show when={hasMultiple().session}>
                                <div class="tabular-nums">
                                    <span class="opacity-75">20</span>
                                    {getSessionFromRoll(roll)}
                                </div>
                            </Show>
                            <div class="text-end flex justify-end">
                                <props.actionButton item={result} />
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
}
