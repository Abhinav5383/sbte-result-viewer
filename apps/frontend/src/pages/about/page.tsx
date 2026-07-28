import { A } from "@solidjs/router";

export default function AboutPage() {
    return (
        <main class="grid mx-auto p-8 content-center gap-8 max-w-[70ch]">
            <FeaturesSection />
            <div class="border-be-[0.13rem] border-border" />
            <DisclaimerSection />
        </main>
    );
}

export function FeaturesSection() {
    return (
        <section class="grid gap-5">
            <header class="grid gap-2">
                <h2 class="text-2xl text-bright-fg font-semibold">Features</h2>
            </header>

            <ul class="grid gap-4 list-none text-normal-fg">
                <li class="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-dim-fg">
                    <span class="text-bright-fg font-semibold">Instant Search:</span> Find exact roll numbers, names, or
                    colleges immediately without waiting for pages to load.
                </li>
                <li class="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-dim-fg">
                    <span class="text-bright-fg font-semibold">Offline Support:</span> Once the site loads, everything
                    works directly in your browser. You can keep searching and filtering even if your internet
                    connection drops.
                </li>
                <li class="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-dim-fg">
                    <span class="text-bright-fg font-semibold">Advanced Filtering:</span> Easily sort and filter the
                    data to find specific branches, colleges, or organize the results exactly how you need them.
                </li>
                <li class="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-dim-fg">
                    <A href="/tools/csv-export" class="text-bright-fg underline font-semibold">CSV Export:</A> Download your customized list of
                    results as a standard spreadsheet file with a single click.
                </li>
            </ul>
        </section>
    );
}

export function DisclaimerSection() {
    return (
        <section class="max-w-3xl mx-auto grid gap-5">
            <header class="grid gap-2">
                <h2 class="text-2xl text-bright-fg font-semibold">Disclaimer</h2>
                <p class="text-normal-fg leading-relaxed">
                    This project is an independent, unofficial viewer built for convenience. It is{" "}
                    <span class="font-semibold">not affiliated with</span>,{" "}
                    <span class="font-semibold">endorsed by</span>, or <span class="font-semibold">connected to</span>{" "}
                    SBTE (or any related institution/website).
                </p>
            </header>

            <div class="grid gap-3 text-normal-fg leading-relaxed">
                <div class="border-[0.13rem] border-border rounded-md p-4 bg-white">
                    <p>
                        <span class="font-semibold">Data source & availability:</span> Exam results are gathered from
                        the official SBTE API. So long as the API remains open, new exam results will continue being
                        added. In case the website goes offline or is not accessible for any reason, all the results
                        data is available in the git repo.
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
        </section>
    );
}
