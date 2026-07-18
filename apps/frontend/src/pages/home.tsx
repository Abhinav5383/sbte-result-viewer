import { Show } from "solid-js";
import { useResults } from "~/providers/results";
import { ResultListPage } from "./results/page";

export default function HomePage() {
    const ctx = useResults();

    return (
        <>
            <main class="min-h-screen">
                <HeroSection
                    total={ctx.results()?.length ?? 0}
                    loading={ctx.results.loading}
                    error={ctx.results.error?.message}
                />

                <Show when={ctx.results.error}>
                    <div class="flex flex-col items-center justify-center gap-4 p-8">
                        <span class="text-lg text-red-600 font-semibold">Failed to load results</span>
                        <span class="text-dim-fg text-sm">
                            {ctx.results.error?.message || "Unknown error occurred"}
                        </span>
                        <button
                            type="button"
                            class="bg-accent-bg text-white px-4 py-2 rounded-md hover:opacity-90"
                            onClick={() => ctx.refetch()}
                        >
                            Retry
                        </button>
                    </div>
                </Show>

                <Show when={ctx.results.loading}>
                    <div class="flex items-center justify-center p-8">
                        <span class="text-lg text-dim-fg font-semibold">Loading results...</span>
                    </div>
                </Show>

                <Show keyed when={!ctx.results.loading && !ctx.results.error && ctx.results()}>
                    {(list) => <ResultListPage studentResultList={list} />}
                </Show>
            </main>

            <AboutSection />
        </>
    );
}

function HeroSection(props: { total: number; loading: boolean; error?: string }) {
    return (
        <section class="min-h-[80svb] grid place-items-center px-6 py-12 hero-surface">
            <div class="w-full max-w-3xl text-center grid gap-8">
                <header class="grid gap-4">
                    <p class="text-dim-fg text-sm font-semibold tracking-widest uppercase">SBTE Result Viewer</p>

                    <h1 class="text-bright-fg text-4xl sm:text-5xl leading-[1.15] font-semibold">
                        Search through SBTE results — <span class="text-accent-fg">fast</span>, clean, minimal.
                    </h1>

                    <p class="text-normal-fg text-base sm:text-lg">
                        Everything runs locally in your browser. No tracking, no noise.
                    </p>
                </header>

                <div class="grid place-content-center">
                    <div class="inline-flex items-baseline gap-3 px-5 py-3 border-2 border-border rounded-md bg-white">
                        <div class="text-3xl font-semibold text-bright-fg tabular-nums">
                            {props.loading ? "—" : props.total.toLocaleString()}
                        </div>
                        <span class="text-xs text-dim-fg font-semibold uppercase tracking-widest">Student records</span>
                    </div>
                </div>

                {props.error ? (
                    <div class="border-2 border-border rounded-md p-4 text-left bg-white">
                        <div class="text-sm font-semibold text-pink-600">Failed to load results</div>
                        <div class="text-sm text-dim-fg">{props.error}</div>
                    </div>
                ) : null}
            </div>
        </section>
    );
}

function AboutSection() {
    return (
        <aside id="about" class="mt-[4em] py-[6em] px-[2em] bg-zinc-50 about-surface">
            <div class="max-w-3xl mx-auto grid gap-5">
                <header class="grid gap-2">
                    <h2 class="text-3xl text-bright-fg font-semibold">Disclaimer</h2>
                    <p class="text-normal-fg leading-relaxed">
                        This project is an independent, unofficial viewer built for convenience. It is{" "}
                        <span class="font-semibold">not affiliated with</span>,{" "}
                        <span class="font-semibold">endorsed by</span>, or{" "}
                        <span class="font-semibold">connected to</span> SBTE (or any related institution/website).
                    </p>
                </header>

                <div class="grid gap-3 text-normal-fg leading-relaxed">
                    <div class="border-2 border-border rounded-md p-4 bg-white">
                        <p>
                            <span class="font-semibold">Data source & availability:</span> For past exams, results are
                            parsed from PDFs and stored as JSON during the build process, then embedded directly into
                            the website. The deployed site does not need any results API to show past results.
                        </p>
                    </div>

                    <div class="border-2 border-border rounded-md p-4 bg-white">
                        <p>
                            <span class="font-semibold">Privacy:</span> Results are loaded from the page itself
                            (embedded data). No API request is made to any third-party results server for normal usage.
                            Your searches/filters run locally in your browser.
                        </p>
                    </div>

                    <p class="text-sm text-dim-fg">
                        If you believe any information is inaccurate or should be removed, please{" "}
                        <a
                            class="underline hover:decoration-2"
                            href="https://github.com/Abhinav5383/sbte-result-viewer/issues"
                        >
                            open an issue on the repository
                        </a>
                        .
                    </p>
                </div>
            </div>
        </aside>
    );
}
