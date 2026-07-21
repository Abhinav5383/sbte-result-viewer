import { useLocation } from "@solidjs/router";
import { createEffect, type JSX } from "solid-js";
import Navbar from "~/components/navbar";

export default function RootLayout(props: { children: JSX.Element }) {
    const loc = useLocation();

    createEffect(() => {
        let query = "";
        for (const [key, val] of Object.entries(loc.query)) {
            query += `${key}=${val}&`;
        }
        if (query) query = query.slice(0, -1);

        let url = `https://sbte-result-viewer.vercel.app/#${loc.pathname}`;
        if (query) url += `?${query}`;
        if (loc.hash) url += loc.hash;

        if (window.location.hostname === "abhinav5383.github.io") {
            window.location.href = url;
            console.log("Redirecting to: ", url);
        }
    });

    return (
        <div class="min-h-screen min-h-lvh grid grid-cols-1 grid-rows-[auto_1fr_auto]">
            <Navbar />
            {props.children}
            <Footer />
        </div>
    );
}

function Footer() {
    return (
        <footer id="footer" class="bg-zinc-900 text-zinc-50 py-4 px-8 grid gap-3 place-items-center">
            <div class="grid place-items-center text-center">
                <span>
                    COPYRIGHT &copy; {new Date().getFullYear()}{" "}
                    <a class="text-accent-fg-light" href="https://github.com/Abhinav5383">
                        Abhinav5383
                    </a>
                </span>
                <span>Licensed under the GNU Affero General Public License v3.0</span>
            </div>
        </footer>
    );
}
