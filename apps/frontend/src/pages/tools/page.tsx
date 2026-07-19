import { A } from "@solidjs/router";
import { For } from "solid-js";
import { ChevronRightIcon } from "~/components/icons/chevron-right";

import "./styles.css";

export function ToolsPage() {
    const tools = [
        {
            name: "CSV Export",
            path: "/tools/csv-export",
            desc: "Export results to CSV format for further analysis or record-keeping.",
        },
        {
            name: "Group Generator",
            path: "/tools/group-creator",
            desc: "Generate randomized class groups of students and export the groups as CSV files.",
        },
    ];

    return (
        <main class="p-8 grid gap-4 content-start bg-zinc-100">
            <h1 class="text-5xl font-bold text-normal-fg">Tools</h1>
            <ul class="tools-list grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]">
                <For each={tools}>
                    {(tool) => (
                        <li class="grid">
                            <A href={tool.path} class="tool-link grid p-1">
                                <div class="grid p-4 bg-white hover:shadow-xl focus-visible:shadow-xl">
                                    <h2 class="flex justify-between text-lg font-semibold">
                                        {tool.name}
                                        <ChevronRightIcon />
                                    </h2>

                                    <p class="text-dim-fg">{tool.desc}</p>
                                </div>
                            </A>
                        </li>
                    )}
                </For>
            </ul>
        </main>
    );
}
