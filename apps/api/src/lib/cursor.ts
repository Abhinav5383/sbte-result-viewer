export interface KeysetCursor<T = string | number> {
	sortVal: T;
	tieBreaker: string;
	version: number;
}

export function encodeCursor<T extends string | number>(
	sortVal: T,
	tieBreaker: string,
	version: number,
): string {
	const tuple = [sortVal, tieBreaker, version];
	return Buffer.from(JSON.stringify(tuple)).toString("base64url");
}

export function decodeCursor<T = string | number>(encoded: string): KeysetCursor<T> | null {
	try {
		const json = Buffer.from(encoded, "base64url").toString("utf8");
		const parsed = JSON.parse(json);
		if (!Array.isArray(parsed) || parsed.length !== 3) {
			return null;
		}
		return {
			sortVal: parsed[0] as T,
			tieBreaker: String(parsed[1]),
			version: Number(parsed[2]),
		};
	} catch {
		return null;
	}
}
