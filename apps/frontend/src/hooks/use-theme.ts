import { createSignal } from "solid-js";
import { storage } from "~/lib/storage";

export enum ThemePreference {
	SYSTEM = "system",
	LIGHT = "light",
	DARK = "dark",
}

export enum ThemeVariant {
	LIGHT = "light",
	DARK = "dark",
}

export interface ThemeObj {
	label?: string;
	name: ThemePreference;
	variant: ThemeVariant | undefined;
}

export const Themes: ThemeObj[] = [
	{
		name: ThemePreference.SYSTEM,
		label: "System",
		variant: undefined,
	},
	{
		name: ThemePreference.LIGHT,
		label: "Light",
		variant: ThemeVariant.LIGHT,
	},
	{
		name: ThemePreference.DARK,
		label: "Dark",
		variant: ThemeVariant.DARK,
	},
];

export const DefaultTheme = Themes[0];

export function findTheme(name: ThemePreference | undefined): ThemeObj {
	if (!name) return DefaultTheme;
	return Themes.find((t) => t.name === name) ?? DefaultTheme;
}

export function isValidThemePreference(val: unknown): val is ThemePreference {
	return (
		typeof val === "string" && Object.values(ThemePreference).includes(val as ThemePreference)
	);
}

export const STORAGE_KEY = "sbte_theme";
export const MEDIA_PREFERS_DARK = "(prefers-color-scheme: dark)";

export function resolveThemePreference(
	preference: ThemePreference,
	isMediaDark?: boolean,
): ThemePreference.LIGHT | ThemePreference.DARK {
	if (preference !== ThemePreference.SYSTEM) {
		return preference as ThemePreference.LIGHT | ThemePreference.DARK;
	}
	const isDark =
		isMediaDark ??
		(typeof window !== "undefined" && window.matchMedia(MEDIA_PREFERS_DARK).matches);
	return isDark ? ThemePreference.DARK : ThemePreference.LIGHT;
}

export function getThemeVariant(preference: ThemePreference, isMediaDark?: boolean): ThemeVariant {
	const themeInfo = findTheme(preference);
	if (themeInfo.variant) return themeInfo.variant;
	const resolved = resolveThemePreference(preference, isMediaDark);
	return findTheme(resolved).variant ?? ThemeVariant.LIGHT;
}

const allThemesClasses = [...Object.values(ThemeVariant), ...Object.values(ThemePreference)];

export function applyTheme(
	preference: ThemePreference,
	doc: HTMLElement | null = typeof document !== "undefined" ? document.documentElement : null,
) {
	if (!doc) return;
	const resolved = resolveThemePreference(preference);
	const themeInfo = findTheme(resolved);

	doc.classList.remove(...allThemesClasses);
	if (themeInfo.variant === ThemeVariant.DARK) {
		doc.classList.add("dark");
	}
	doc.setAttribute("data-theme-variant", themeInfo.variant ?? "light");
}

function getInitialTheme(): ThemePreference {
	const saved = storage.get(STORAGE_KEY);
	return isValidThemePreference(saved) ? saved : ThemePreference.SYSTEM;
}

// Module-level reactive singleton
const [theme, setThemeState] = createSignal<ThemePreference>(getInitialTheme());
const [resolvedVariant, setResolvedVariant] = createSignal<ThemeVariant>(getThemeVariant(theme()));

function updateState(pref: ThemePreference) {
	setThemeState(pref);
	const variant = getThemeVariant(pref);
	setResolvedVariant(variant);
	applyTheme(pref);
}

// Setup browser listeners once
if (typeof window !== "undefined") {
	const media = window.matchMedia(MEDIA_PREFERS_DARK);

	// Sync DOM initially
	applyTheme(theme());

	media.addEventListener("change", (e) => {
		if (theme() === ThemePreference.SYSTEM) {
			const variant = e.matches ? ThemeVariant.DARK : ThemeVariant.LIGHT;
			setResolvedVariant(variant);
			applyTheme(ThemePreference.SYSTEM);
		}
	});
}

export function useTheme() {
	function setTheme(newTheme: ThemePreference) {
		storage.set(STORAGE_KEY, newTheme);
		updateState(newTheme);
	}

	function cycleTheme() {
		const curr = theme();
		if (curr === ThemePreference.SYSTEM) {
			setTheme(ThemePreference.LIGHT);
		} else if (curr === ThemePreference.LIGHT) {
			setTheme(ThemePreference.DARK);
		} else {
			setTheme(ThemePreference.SYSTEM);
		}
	}

	return {
		theme,
		resolvedVariant,
		setTheme,
		cycleTheme,
	};
}
