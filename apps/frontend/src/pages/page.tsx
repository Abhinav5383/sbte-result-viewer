import { A } from "@solidjs/router";
import { Show } from "solid-js";
import { useResults } from "~/providers/results";
import { DisclaimerSection, FeaturesSection } from "./about/page";
import { ResultListPage } from "./results/page";

export default function HomePage() {
    const ctx = useResults();

    return (
        <div class="grid">
            <main>
                <HeroSection
                    total={ctx.data()?.results.length ?? 0}
                    loading={ctx.data.loading}
                    error={ctx.data.error?.message}
                />

                <Show when={ctx.data.loading}>
                    <div class="flex items-center justify-center p-8">
                        <span class="text-lg text-dim-fg font-semibold">Loading results...</span>
                    </div>
                </Show>

                <Show keyed when={!ctx.data.loading && !ctx.data.error && ctx.data()}>
                    {(data) => <ResultListPage encodedData={data} />}
                </Show>
            </main>

            <AboutSection />
        </div>
    );
}

function HeroSection(props: { total: number; loading: boolean; error?: string }) {
    return (
        <section class="@container min-h-[80svb] grid place-items-center px-6 py-12 hero-surface">
            <div class="w-full max-w-3xl text-center grid gap-8">
                <header class="grid place-items-center gap-4">
                    <p class="text-dim-fg text-sm font-semibold tracking-widest uppercase">SBTE Result Viewer</p>

                    <h1 class="text-bright-fg text-4xl @min-mobile:text-5xl leading-[1.15] font-semibold">
                        Search Bihar SBTE results — <span class="text-accent-fg">fast</span>, clean, minimal.
                    </h1>

                    <p class="max-w-[48ch] text-normal-fg text-base @min-mobile:text-lg">
                        Instantly search, filter, and{" "}
                        <A href="/tools/csv-export" class="text-accent-fg-dark">
                            export
                        </A>{" "}
                        detailed student results from any government polytechnic college in Bihar.
                    </p>
                </header>

                <div class="grid place-content-center">
                    <div class="inline-flex flex-wrap items-baseline justify-center gap-3 px-5 py-3 border-[0.13rem] border-border rounded-md bg-white">
                        <div class="text-3xl font-semibold text-bright-fg tabular-nums">
                            <Show when={!props.loading} fallback="—">
                                {props.total.toLocaleString()}
                            </Show>
                        </div>
                        <span class="text-xs text-dim-fg font-semibold uppercase tracking-widest">Results total</span>
                    </div>
                </div>

                {props.error ? (
                    <div class="border-[0.13rem] border-border rounded-md p-4 text-left bg-white">
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
        <aside id="about" class="py-[6em] bg-zinc-50 about-surface">
            <div class="grid mx-auto content-center gap-8 max-w-[70ch] *:px-6">
                <FeaturesSection />
                <div class="border-be-[0.13rem] border-border" />
                <DisclaimerSection />
            </div>
        </aside>
    );
}
