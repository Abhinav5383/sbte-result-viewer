import GithubIcon from "./icons/github";

export default function Navbar() {
    return (
        <header class="grid bg-linear-to-r from-[lch(from_var(--color-accent-bg)_calc(l-10)_c_calc(h+10))] to-accent-bg py-4">
            <div class="flex flex-wrap gap-3 justify-between text-accent-bg-text text-center px-6">
                <span class="font-extrabold text-2xl">Semester Exam Results</span>

                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/Abhinav5383/sbte-result-viewer"
                    class="flex items-center justify-center gap-3 text-inherit px-4 py-2 rounded-md hover:bg-white/80 hover:text-accent-fg hover:no-underline transition-colors"
                >
                    <GithubIcon class="fill-current" />
                    <span class="font-semibold">Source Code</span>
                </a>
            </div>
        </header>
    );
}
