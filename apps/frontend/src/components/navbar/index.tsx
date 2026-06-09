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
                <span class="font-extrabold text-2xl">SBTE Exam Results</span>

                <div class="links flex flex-wrap justify-center items-center">
                    <a href="#results" class="nav-target" onMouseEnter={handleMouseEnter} onFocus={handleMouseEnter}>
                        Results
                    </a>
                    <a href="#about" class="nav-target" onMouseEnter={handleMouseEnter} onFocus={handleMouseEnter}>
                        About
                    </a>

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
