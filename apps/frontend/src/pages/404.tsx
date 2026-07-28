import { A } from "@solidjs/router";

export default function NotFoundPage() {
    return (
        <main class="grid place-content-center place-items-center gap-6">
            <h1 class="text-center text-4xl font-bold text-dim-fg">404 | Page Not Found!</h1>

            <A href="/" class="text-xl">
                Home Page
            </A>
        </main>
    );
}
