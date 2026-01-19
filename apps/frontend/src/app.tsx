import { type EncodedResult, decodeResult } from "@app/shared/encoder";
import type { ParsedResult } from "@app/shared/types";
import { Show, createResource } from "solid-js";
import Navbar from "./components/navbar";
import { ResultListPage } from "./pages/results";

// Declare the global embedded data (injected at build time) - gzip+base64 encoded string
declare const __EMBEDDED_RESULTS__: string | undefined;

async function decodeEmbeddedResults(base64: string): Promise<ParsedResult[]> {
    // base64 -> gzip -> JSON
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    // Decompress using DecompressionStream (browser native)
    const ds = new DecompressionStream("gzip");
    const writer = ds.writable.getWriter();
    writer.write(bytes);
    writer.close();

    const decompressed = await new Response(ds.readable).text();
    const encoded = JSON.parse(decompressed) as EncodedResult[];

    return encoded.map(decodeResult);
}

export default function App() {
    const [results, { refetch }] = createResource(async (): Promise<ParsedResult[]> => {
        if (typeof __EMBEDDED_RESULTS__ !== "undefined") {
            return decodeEmbeddedResults(__EMBEDDED_RESULTS__);
        }

        const res = await fetch("http://localhost:5500/students-data");
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        const data = (await res.json()) as ParsedResult[];
        return data;
    });

    return (
        <div class="grid grid-rows-[min-content_1fr_min-content]">
            <Navbar />

            <main class="min-h-screen">
                <Show when={results.error}>
                    <div class="flex flex-col items-center justify-center gap-4 p-8">
                        <span class="text-lg text-red-600 font-semibold">
                            Failed to load results
                        </span>
                        <span class="text-dim-fg text-sm">
                            {results.error?.message || "Unknown error occurred"}
                        </span>
                        <button
                            type="button"
                            class="bg-accent-bg text-white px-4 py-2 rounded-md hover:opacity-90"
                            onClick={() => refetch()}
                        >
                            Retry
                        </button>
                    </div>
                </Show>

                <Show when={results.loading}>
                    <div class="flex items-center justify-center p-8">
                        <span class="text-lg text-dim-fg font-semibold">Loading results...</span>
                    </div>
                </Show>

                <Show keyed when={!results.loading && !results.error && results()}>
                    {(list) => <ResultListPage studentResultList={list} />}
                </Show>
            </main>

            <Footer />
        </div>
    );
}

function Footer() {
    return (
        <footer class="bg-zinc-900 text-zinc-50 py-4 px-8 grid gap-3 place-items-center">
            <div class="grid place-items-center text-center">
                <span>
                    COPYRIGHT &copy; {new Date().getFullYear()}{" "}
                    <a href="https://github.com/Abhinav5383">Abhinav5383</a>;
                </span>
                <span>Licensed under the GNU Affero General Public License v3.0</span>
            </div>
        </footer>
    );
}
