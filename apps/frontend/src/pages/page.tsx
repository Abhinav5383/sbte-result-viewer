import { A } from "@solidjs/router";
import { Show } from "solid-js";
import { useMeta } from "~/hooks/use-meta";
import { ResultListPage } from "./results/page";

export default function HomePage() {
	const meta = useMeta();

	return (
		<main class="grid">
			<HeroSection
				total={meta.totalResults()}
				loading={meta.loading()}
				error={meta.error() ? String(meta.error()) : undefined}
			/>
			<ResultListPage />
		</main>
	);
}

function HeroSection(props: { total: number; loading: boolean; error?: string }) {
	return (
		<section class="@container min-h-[80svb] grid place-items-center px-6 py-12 hero-surface">
			<div class="w-full max-w-3xl text-center grid gap-8">
				<header class="grid place-items-center gap-4">
					<p class="text-dim-fg text-sm font-semibold tracking-widest uppercase">
						SBTE Result Viewer
					</p>

					<h1 class="text-bright-fg text-4xl @min-mobile:text-5xl leading-[1.15] font-semibold">
						Search Bihar SBTE results — <span class="text-accent-fg">fast</span>, clean,
						minimal.
					</h1>

					<p class="max-w-[48ch] text-normal-fg text-base @min-mobile:text-lg">
						Instantly search, filter, check the{" "}
						<A href="/leaderboard" class="text-accent-fg-dark">
							leaderboard
						</A>
						, and{" "}
						<A href="/tools/csv-export" class="text-accent-fg-dark">
							export
						</A>{" "}
						detailed student results from any government polytechnic college in Bihar.
					</p>
				</header>

				<div class="grid place-content-center">
					<div class="inline-flex flex-wrap items-baseline justify-center gap-3 px-5 py-3 border-[0.13rem] border-border rounded-md bg-white">
						<div class="text-3xl font-semibold text-bright-fg tabular-nums">
							<Show
								when={!props.loading && !props.error && props.total > 0}
								fallback="—"
							>
								{props.total.toLocaleString()}
							</Show>
						</div>
						<span class="text-xs text-dim-fg font-semibold uppercase tracking-widest">
							Results total
						</span>
					</div>
				</div>

				<Show when={props.error}>
					{(err) => (
						<div class="border-[0.13rem] border-border rounded-md p-4 text-left bg-white">
							<div class="text-sm font-semibold text-pink-600">
								Failed to load results
							</div>
							<div class="text-sm text-dim-fg">{err()}</div>
						</div>
					)}
				</Show>
			</div>
		</section>
	);
}
