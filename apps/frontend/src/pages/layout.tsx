import Navbar from "~/components/navbar";

export default function RootLayout(props: { children: Element }) {
    return (
        <div class="grid grid-rows-[min-content_1fr_min-content]">
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
