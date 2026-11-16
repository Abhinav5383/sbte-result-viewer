import { A } from "@solidjs/router";
import GithubIcon from "~/components/icons/github";
import { ThemeToggle } from "~/components/misc/theme-toggle";

import "./styles.css";

export default function Navbar() {
	return (
		<header class="page-header grid py-4">
			<nav class="flex items-center justify-between gap-x-4 flex-wrap px-8 text-accent-bg-text">
				<A href="/" style="color: unset; text-decoration: unset;">
					<span class="block py-1 px-2 font-extrabold text-2xl">SBTE Exam Results</span>
				</A>

				<div class="links flex flex-wrap justify-center items-center">
					<A href="/" end class="nav-target">
						Results
					</A>

					<A href="/leaderboard" class="nav-target">
						Leaderboard
					</A>

					<A href="/about" class="nav-target">
						About
					</A>

					<A href="/tools" class="nav-target">
						Tools
					</A>

					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://github.com/Abhinav5383/sbte-result-viewer"
						class="nav-target"
					>
						<GithubIcon class="fill-current" />
						<span class="font-semibold">Source Code</span>
					</a>

					<div class="ps-2 flex items-center">
						<ThemeToggle />
					</div>
				</div>
			</nav>
		</header>
	);
}
