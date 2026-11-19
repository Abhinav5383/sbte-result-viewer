import { type Accessor, createEffect, createSignal, on, onCleanup } from "solid-js";

export interface UseDebouncedStateOptions {
	delay?: number;
	immediate?: boolean;
}

export function useDebouncedState<T>(
	externalValue: Accessor<T>,
	onCommit: (val: T) => void,
	options?: UseDebouncedStateOptions,
) {
	const delay = options?.delay ?? 300;
	const immediate = options?.immediate ?? false;

	const [value, setInternalValue] = createSignal<T>(externalValue());
	let timer: ReturnType<typeof setTimeout> | undefined;

	function clearTimer() {
		clearTimeout(timer);
		timer = undefined;
	}

	createEffect(
		on(
			externalValue,
			(ext) => {
				clearTimer();
				setInternalValue(() => ext);
			},
			{ defer: true },
		),
	);

	function commit(val: T) {
		clearTimer();
		onCommit(val);
	}

	function setValue(next: T) {
		setInternalValue(() => next);

		if (immediate) {
			commit(next);
			return;
		}

		clearTimeout(timer);
		timer = setTimeout(() => commit(value()), delay);
	}

	function flush() {
		if (timer !== undefined) commit(value());
	}

	onCleanup(clearTimer);

	return { value, setValue, flush };
}
