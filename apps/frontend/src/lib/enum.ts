export function getValidEntry<T, F>(val: unknown, enumObj: Record<string, T>, fallback: F) {
    for (const v of Object.values(enumObj)) {
        if (val === v) return v;
    }

    return fallback;
}
