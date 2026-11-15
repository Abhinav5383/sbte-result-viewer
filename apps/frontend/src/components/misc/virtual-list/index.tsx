import {
	createEffect,
	createMemo,
	createSignal,
	For,
	type JSX,
	onCleanup,
	onMount,
} from "solid-js";

interface ResultTableContentsProps<T> {
	defaultRowHeight?: number;
	rowHeight?: number;
	items: T[];
	RowComponent?: (props: { item: T; index: number; class: string }) => JSX.Element;
	children?: (item: T, index: number) => JSX.Element;
	containerProps?: JSX.HTMLAttributes<HTMLDivElement>;
	scrollElement?: HTMLElement;
	onScrollBottom?: () => void;
}

const DEFAULT_ROW_HEIGHT = 52;
const ROW_CLASS = "virt-list-row";

export default function VirtualList<T>(props: ResultTableContentsProps<T>) {
	const initialHeight = props.rowHeight ?? props.defaultRowHeight ?? DEFAULT_ROW_HEIGHT;
	const [rowHeight, setRowHeight] = createSignal<number>(initialHeight);
	const [containerRef, setContainerRef] = createSignal<HTMLDivElement | undefined>();

	const initialRowsPerViewport = Math.ceil(
		(typeof window !== "undefined" ? window.innerHeight : 800) / initialHeight,
	);
	const initialOverscan = Math.max(initialRowsPerViewport * 2, 25);

	const [visibleIndices, setVisibleIndices] = createSignal({
		start: 0,
		end: initialRowsPerViewport + initialOverscan,
	});

	function handleResize(parent: HTMLDivElement) {
		const row = parent.querySelector<HTMLDivElement>(`.${ROW_CLASS}`);
		if (!row) return;

		const height = row.getBoundingClientRect().height;
		if (height && height !== rowHeight()) {
			setRowHeight(height);
			handleScroll(undefined, height);
		}
	}

	function handleScroll(_e?: Event, rHeight = rowHeight()) {
		const scrollContainer = containerRef();
		if (!scrollContainer) return;

		const containerTop = scrollContainer.getBoundingClientRect().top;
		const containerYScroll = Math.max(0, -containerTop);

		const rowsPerViewport = Math.ceil(window.innerHeight / rHeight);
		const overscan = Math.max(rowsPerViewport * 2, 25);

		const startIndex = Math.floor(containerYScroll / rHeight);
		const endIndex = Math.ceil((containerYScroll + window.innerHeight) / rHeight);

		const adjustedEndIndex = Math.min(props.items.length - 1, endIndex + overscan);
		const adjustedStartIndex = Math.min(adjustedEndIndex, Math.max(0, startIndex - overscan));

		if (
			adjustedStartIndex !== visibleIndices().start ||
			adjustedEndIndex !== visibleIndices().end
		) {
			setVisibleIndices({ start: adjustedStartIndex, end: adjustedEndIndex });
		}

		// Trigger loadMore proactively well before the bottom edge
		if (adjustedEndIndex >= props.items.length - 25 && props.items.length > 0) {
			props.onScrollBottom?.();
		}
	}

	onMount(() => {
		const scroller = props.scrollElement ?? window;
		scroller.addEventListener("scroll", handleScroll, { passive: true });

		const listContainer = containerRef();
		let observer: ResizeObserver | null = null;
		if (listContainer) {
			listContainer.style.overflowAnchor = "none";

			observer = new ResizeObserver(() => handleResize(listContainer));
			observer.observe(listContainer);
			handleResize(listContainer);
		}

		onCleanup(() => {
			scroller.removeEventListener("scroll", handleScroll);
			if (observer) observer.disconnect();
		});
	});

	createEffect(() => {
		const start = visibleIndices().start;
		const end = visibleIndices().end;
		const rH = rowHeight();
		const total = props.items.length;

		const paddingTop = start * rH;
		const paddingBottom = Math.max(0, (total - (end + 1)) * rH);

		const el = containerRef();
		if (el) {
			el.style.paddingTop = `${paddingTop}px`;
			el.style.paddingBottom = `${paddingBottom}px`;
		}
	});

	createEffect(() => {
		props.items.length;
		handleScroll();
	});

	// Return raw items directly — NO object wrappers so Solid preserves DOM nodes on scroll
	const visibleItems = createMemo(() => {
		const items: T[] = [];
		const start = visibleIndices().start;
		const end = Math.min(props.items.length - 1, visibleIndices().end);
		for (let i = start; i <= end; i++) {
			const item = props.items[i];
			if (item !== undefined) items.push(item);
		}
		return items;
	});

	return (
		<div {...props.containerProps} ref={setContainerRef}>
			<For each={visibleItems()}>
				{(item, localIdx) => {
					if (props.children) {
						return props.children(item, visibleIndices().start + localIdx());
					}
					if (props.RowComponent) {
						return (
							<props.RowComponent
								item={item}
								index={visibleIndices().start + localIdx()}
								class={ROW_CLASS}
							/>
						);
					}
					return null;
				}}
			</For>
		</div>
	);
}
