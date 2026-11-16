import MoonIcon from "lucide-solid/icons/moon";
import SunIcon from "lucide-solid/icons/sun";
import SunMoonIcon from "lucide-solid/icons/sun-moon";
import { Match, Switch } from "solid-js";
import { ThemePreference, useTheme } from "~/hooks/use-theme";

export function ThemeToggle(props: { class?: string }) {
	const { theme, cycleTheme } = useTheme();

	const label = () => {
		switch (theme()) {
			case ThemePreference.LIGHT:
				return "Light Theme (switch to Dark)";
			case ThemePreference.DARK:
				return "Dark Theme (switch to System)";
			case ThemePreference.SYSTEM:
				return "System Theme (switch to Light)";
		}
	};

	return (
		<button
			type="button"
			onClick={cycleTheme}
			title={label()}
			aria-label={label()}
			class={`p-2 rounded-lg text-accent-bg-text hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer min-h-0 ${props.class ?? ""}`}
		>
			<Switch>
				<Match when={theme() === ThemePreference.LIGHT}>
					<SunIcon class="w-5 h-5" />
				</Match>
				<Match when={theme() === ThemePreference.DARK}>
					<MoonIcon class="w-5 h-5" />
				</Match>
				<Match when={theme() === ThemePreference.SYSTEM}>
					<SunMoonIcon class="w-5 h-5" />
				</Match>
			</Switch>
		</button>
	);
}
