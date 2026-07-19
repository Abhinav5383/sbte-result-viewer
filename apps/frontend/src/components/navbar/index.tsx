import { A } from "@solidjs/router";
import GithubIcon from "~/components/icons/github";

import "./styles.css";

export default function Navbar() {
    let headerRef: HTMLElement | null = null;

    function handleMouseEnter(e: Event & { currentTarget: HTMLAnchorElement }) {
        const _header = headerRef ?? document.querySelector("header.page-header");
        if (!_header) return;

        const last = _header.querySelector("a.curr-focus");
        const curr = e.currentTarget;

        if (last && last !== curr) {
            last.classList.remove("curr-focus");
        }

        curr.classList.add("curr-focus");
    }

    return (
        <header class="page-header grid py-4" ref={(el) => (headerRef = el)}>
            <nav class="flex items-center justify-between gap-x-4 flex-wrap px-8 text-accent-bg-text">
                <A
                    href="/"
                    style="color: unset; text-decoration: unset;"
                    onMouseEnter={handleMouseEnter}
                    onFocus={handleMouseEnter}
                >
                    <span class="block py-1 px-2 font-extrabold text-2xl">SBTE Exam Results</span>
                </A>

                <div class="links flex flex-wrap justify-center items-center">
                    <A
                        href="/tools"
                        class="nav-target"
                        onMouseEnter={handleMouseEnter}
                        onFocus={handleMouseEnter}
                    >
                        Tools
                    </A>
                    <A href="/#about" class="nav-target" onMouseEnter={handleMouseEnter} onFocus={handleMouseEnter}>
                        About
                    </A>

                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/Abhinav5383/sbte-result-viewer"
                        class="nav-target"
                        onMouseEnter={handleMouseEnter}
                        onFocus={handleMouseEnter}
                    >
                        <GithubIcon class="fill-current" />
                        <span class="font-semibold">Source Code</span>
                    </a>
                </div>
            </nav>
        </header>
    );
}
