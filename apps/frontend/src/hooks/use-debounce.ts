import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface UseDebouncedStateOptions {
	delay?: number;
	immediate?: boolean;
}

export function useDebouncedState<T>(
	externalValue: Accessor<T>,
	onCommit: (val: T) => void,
	options?: UseDebouncedStateOptions,
) {
	const delay = () => options?.delay ?? 300;
	const isImmediate = () => options?.immediate ?? false;

	const [internalValue, setInternalValue] = createSignal<T>(externalValue());
	let timer: ReturnType<typeof setTimeout> | undefined;

	createEffect(() => {
		const ext = externalValue();
		if (timer !== undefined) {
			clearTimeout(timer);
			timer = undefined;
		}
		setInternalValue(ext as never);
	});

	function commit(val: T) {
		if (timer !== undefined) {
			clearTimeout(timer);
			timer = undefined;
		}
		onCommit(val);
	}

	function setValue(next: T | ((prev: T) => T)) {
		const nextVal =
			typeof next === "function" ? (next as (prev: T) => T)(internalValue()) : next;
		setInternalValue(nextVal as never);

		if (isImmediate()) {
			commit(nextVal);
		} else {
			if (timer !== undefined) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				commit(internalValue());
			}, delay());
		}
	}

	function flush() {
		if (timer !== undefined) {
			commit(internalValue());
		}
	}

	function cancel() {
		if (timer !== undefined) {
			clearTimeout(timer);
			timer = undefined;
		}
	}

	onCleanup(() => {
		if (timer !== undefined) {
			clearTimeout(timer);
		}
	});

	return {
		value: internalValue,
		setValue,
		flush,
		cancel,
		isPending: () => timer !== undefined,
	};
}
