import { decodeResult, type EncodedResult } from "@app/shared/encoder";
import type { ParsedResult } from "@app/shared/types";
import { createResource, Show } from "solid-js";
import Navbar from "./components/navbar";
import { ResultListPage } from "./pages/results";

// Declare the global embedded data (injected at build time) - gzip+base64 encoded string
declare const __EMBEDDED_RESULTS__: string | undefined;

async function decodeEmbeddedResults(base64: string): Promise<ParsedResult[]> {
	if (typeof DecompressionStream === "undefined") {
		throw new Error("DecompressionStream is not supported in this browser");
	}

	// base64 -> gzip -> JSON
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}

	// Decompress using DecompressionStream (browser native)
	const ds = new DecompressionStream("gzip");
	const decompressed = new Response(ds.readable).text();

	const writer = ds.writable.getWriter();
	await writer.write(bytes);
	await writer.close();

	const encoded = JSON.parse(await decompressed) as EncodedResult[];
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
				<HeroSection total={results()?.length ?? 0} loading={results.loading} error={results.error?.message} />

				<Show when={results.error}>
					<div class="flex flex-col items-center justify-center gap-4 p-8">
						<span class="text-lg text-red-600 font-semibold">Failed to load results</span>
						<span class="text-dim-fg text-sm">{results.error?.message || "Unknown error occurred"}</span>
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

			<AboutSection />

			<Footer />
		</div>
	);
}

function HeroSection(props: { total: number; loading: boolean; error?: string }) {
	return (
		<section class="min-h-[80svb] grid place-items-center px-6 py-12">
			<div class="w-full max-w-3xl text-center grid gap-8">
				<div class="grid gap-3">
					<p class="text-dim-fg text-sm font-semibold tracking-widest uppercase">SBTE Result Viewer</p>

					<h1 class="text-bright-fg text-4xl sm:text-5xl leading-tight font-semibold flex flex-col">
						<span>Search through SBTE results — </span>
						<span>
							<span class="text-accent-fg">Fast</span>, clean, minimal.
						</span>
					</h1>
				</div>

				<div class="grid place-content-center">
					<div class="space-x-3 px-4 py-2 bg-accent-bg rounded-md">
						<div class="text-3xl font-semibold text-white tabular-nums">
							{props.loading ? "—" : props.total.toLocaleString()}
						</div>
						<span class="text-xs text-accent-bg-text font-medium uppercase tracking-widest">Student records</span>
					</div>
				</div>

				{props.error ? (
					<div class="border-2 border-border rounded-md p-4 text-left">
						<div class="text-sm font-semibold text-pink-600">Failed to load</div>
						<div class="text-sm text-dim-fg">{props.error}</div>
					</div>
				) : null}

				<div class="pt-2 text-xs text-dim-fg">
					Tip: Use the filters below to narrow results by college, branch, and semester.
				</div>
			</div>
		</section>
	);
}

function AboutSection() {
	return (
		<aside id="about" class="mt-[4em] py-[6em] px-[2em] bg-zinc-100 text-zinc-800">
			<div class="max-w-3xl mx-auto">
				<h2 class="text-3xl">Disclaimer</h2>

				<div class="leading-relaxed space-y-4 mt-4">
					<p>
						This project is an independent, unofficial viewer built for convenience. It is{" "}
						<span>not affiliated with</span>, <span>endorsed by</span>, or <span>connected to</span> SBTE (or any
						related institution/website).
					</p>

					<p>
						<span class="font-medium">Data source & availability:</span> For past exams, results are parsed from PDFs
						and stored as JSON during the build process, then embedded directly into the website. Because of this, the
						deployed site does not need any results API to show past results.
					</p>

					<p>
						<span class="font-medium">Privacy:</span> When viewing the deployed site, results are loaded from the page
						itself (embedded data) and no API request is made to any third-party results server for normal usage. Your
						searches/filters run locally in your browser.
					</p>

					<p class="text-sm">
						If you believe any information is inaccurate or should be removed, please{" "}
						<a class="underline hover:decoration-2" href="https://github.com/Abhinav5383/sbte-result-viewer/issues">
							open an issue on the repository
						</a>
						.
					</p>
				</div>
			</div>
		</aside>
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
