import type { ApiResponse } from "@app/shared/dto";

const API_BASE = import.meta.env.VITE_API_URL
	? import.meta.env.VITE_API_URL.replace(/\/$/, "")
	: "/api";

export class ApiError extends Error {
	constructor(
		message: string,
		public status?: number,
	) {
		super(message);
		this.name = "ApiError";
	}
}

export type QueryParams = Record<
	string,
	string | number | boolean | (string | number)[] | undefined | null
>;

function appendSortedSearchParams(searchParams: URLSearchParams, query?: QueryParams) {
	if (!query) return;

	const sortedKeys = Object.keys(query).sort();
	for (const key of sortedKeys) {
		const value = query[key];
		if (value !== undefined && value !== null && value !== "") {
			if (Array.isArray(value)) {
				if (value.length > 0) {
					const sortedArr = [...value].sort((a, b) => String(a).localeCompare(String(b)));
					searchParams.set(key, sortedArr.join(","));
				}
			} else {
				searchParams.set(key, String(value));
			}
		}
	}

	searchParams.sort();
}

export async function request<T>(
	endpoint: string,
	options?: {
		query?: QueryParams;
		signal?: AbortSignal;
		headers?: Record<string, string>;
	},
): Promise<T> {
	const url = new URL(
		`${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`,
		window.location.origin,
	);

	appendSortedSearchParams(url.searchParams, options?.query);

	const res = await fetch(url.toString(), {
		headers: {
			Accept: "application/json",
			...options?.headers,
		},
		signal: options?.signal,
	});

	if (res.status === 304) {
		return null as unknown as T;
	}

	let json: ApiResponse<T>;
	try {
		json = await res.json();
	} catch {
		throw new ApiError(`Invalid response from server (${res.status})`, res.status);
	}

	if (!json.success) {
		throw new ApiError(json.error || "Unknown server error", res.status);
	}

	return json.data;
}

export function buildApiUrl(endpoint: string, query?: QueryParams): string {
	const url = new URL(
		`${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`,
		window.location.origin,
	);

	appendSortedSearchParams(url.searchParams, query);

	return url.toString();
}
