import type { ResultDetailData } from "@app/shared/dto";
import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import { fetchResultDetail } from "~/lib/api/results";

const detailCache = new Map<string, ResultDetailData>();

export function useResultDetail(roll: Accessor<string | null | undefined>) {
	const [data, setData] = createSignal<ResultDetailData | null>(null);
	const [loading, setLoading] = createSignal(false);
	const [error, setError] = createSignal<string | null>(null);

	let abortCtrl: AbortController | null = null;

	async function load() {
		const currentRoll = roll();
		if (!currentRoll) {
			if (abortCtrl) {
				abortCtrl.abort();
				abortCtrl = null;
			}
			setData(null);
			setLoading(false);
			setError(null);
			return;
		}

		const cached = detailCache.get(currentRoll);
		if (cached) {
			if (abortCtrl) {
				abortCtrl.abort();
				abortCtrl = null;
			}
			setData(cached);
			setLoading(false);
			setError(null);
			return;
		}

		if (abortCtrl) {
			abortCtrl.abort();
		}
		abortCtrl = new AbortController();

		setData(null);
		setLoading(true);
		setError(null);

		try {
			const detail = await fetchResultDetail(currentRoll, abortCtrl.signal);
			detailCache.set(currentRoll, detail);
			if (detail.student.reg_no) {
				detailCache.set(detail.student.reg_no, detail);
			}
			for (const res of detail.results ?? []) {
				detailCache.set(res.roll, detail);
			}
			setData(detail);
		} catch (err: unknown) {
			if (err instanceof Error && err.name === "AbortError") return;
			setError(err instanceof Error ? err.message : "Failed to load result");
		} finally {
			setLoading(false);
		}
	}

	createEffect(() => {
		load();
	});

	onCleanup(() => {
		if (abortCtrl) {
			abortCtrl.abort();
		}
	});

	return {
		data,
		loading,
		error,
		refetch: load,
	};
}
