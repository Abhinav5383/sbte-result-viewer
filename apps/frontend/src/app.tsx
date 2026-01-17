import type { ParsedResult } from "@app/shared/types";
import { Show, createResource } from "solid-js";
import Navbar from "./components/navbar";
import { ResultListPage } from "./pages/results";

export default function App() {
    const [results] = createResource(async () => {
        const res = await fetch("http://localhost:5500/students-data");
        return (await res.json()) as Record<string, ParsedResult>;
    });

    return (
        <div class="grid grid-rows-[min-content_1fr_min-content]">
            <Navbar />

            <main class="min-h-screen">
                <Show
                    keyed
                    when={results()}
                    fallback={
                        <div class="flex items-center justify-center">
                            <span class="text-lg text-dim-fg font-semibold">
                                Loading results...
                            </span>
                        </div>
                    }
                >
                    {(list) => <ResultListPage studentResultList={list} />}
                </Show>
            </main>

            <Footer />
        </div>
    );
}

function Footer() {
    return (
        <footer class="bg-zinc-900 text-zinc-50 py-4 grid gap-3 place-items-center">
            <div class="grid place-items-center">
                <span>
                    COPYRIGHT &copy; {new Date().getFullYear()}{" "}
                    <a href="https://github.com/Abhinav5383">Abhinav5383</a>;
                </span>
                <span>Licensed under the GNU Affero General Public License v3.0</span>
            </div>
            <a
                href="https://github.com/Abhinav5383/sbte-result-viewer"
                class="flex items-center justify-center gap-3"
            >
                <GithubIcon />
                <span>Source Code</span>
            </a>
        </footer>
    );
}

function GithubIcon() {
    return (
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title>GitHub</title>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    );
}
