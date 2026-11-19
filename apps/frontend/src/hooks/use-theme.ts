import { createSignal } from "solid-js";
import { storage } from "~/lib/storage";

export enum ThemePreference {
	SYSTEM = "system",
	LIGHT = "light",
	DARK = "dark",
}

// Keep in sync with the inline theme script in index.html
const STORAGE_KEY = "sbte_theme";

const NEXT_THEME: Record<ThemePreference, ThemePreference> = {
	[ThemePreference.SYSTEM]: ThemePreference.LIGHT,
	[ThemePreference.LIGHT]: ThemePreference.DARK,
	[ThemePreference.DARK]: ThemePreference.SYSTEM,
};

const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");

function loadPreference(): ThemePreference {
	const saved = storage.get(STORAGE_KEY);
	return Object.values(ThemePreference).includes(saved as ThemePreference)
		? (saved as ThemePreference)
		: ThemePreference.SYSTEM;
}

function applyTheme(pref: ThemePreference) {
	const isDark =
		pref === ThemePreference.DARK || (pref === ThemePreference.SYSTEM && darkMedia.matches);
	document.documentElement.classList.toggle("dark", isDark);
}

const [theme, setThemeSignal] = createSignal(loadPreference());

applyTheme(theme());
darkMedia.addEventListener("change", () => {
	if (theme() === ThemePreference.SYSTEM) applyTheme(ThemePreference.SYSTEM);
});

function setTheme(pref: ThemePreference) {
	storage.set(STORAGE_KEY, pref);
	setThemeSignal(pref);
	applyTheme(pref);
}

export function useTheme() {
	return {
		theme,
		setTheme,
		cycleTheme: () => setTheme(NEXT_THEME[theme()]),
	};
}
