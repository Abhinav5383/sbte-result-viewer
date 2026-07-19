import { createEffect, createMemo, createSignal, For, type JSX, onCleanup, onMount } from "solid-js";

interface ResultTableContentsProps<T> {
    defaultRowHeight?: number;
    items: T[];
    RowComponent: (props: { item: T; index: number; class: string }) => JSX.Element;
    containerProps?: JSX.HTMLAttributes<HTMLDivElement>;
    scrollContainer?: HTMLElement;
}

const DEFAULT_ROW_HEIGHT = 52;
const ROW_CLASS = "virt-list-row";
export default function VirtualList<T>(props: ResultTableContentsProps<T>) {
    const [rowHeight, setRowHeight] = createSignal<number>(DEFAULT_ROW_HEIGHT);
    const [containerRef, setContainerRef] = createSignal<HTMLDivElement | undefined>();
    const [visibleIndices, setVisibleIndices] = createSignal({
        start: 0,
        end: 0,
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

        const containerTop = scrollContainer?.getBoundingClientRect().top ?? 0;
        const containerYScroll = Math.max(0, -containerTop);

        const startIndex = Math.floor(containerYScroll / rHeight);
        const endIndex = Math.ceil((containerYScroll + window.innerHeight) / rHeight);

        const overscan = Math.max(30, endIndex - startIndex); // overscan by one viewport height
        const adjustedStartIndex = Math.max(0, startIndex - overscan);
        const adjustedEndIndex = Math.min(props.items.length - 1, endIndex + overscan);

        setVisibleIndices({ start: adjustedStartIndex, end: adjustedEndIndex });
    }

    onMount(() => {
        const scroller = props.scrollContainer ?? window;
        scroller.addEventListener("scroll", handleScroll, { passive: true });

        const container = containerRef();
        let observer: ResizeObserver | null = null;
        if (container) {
            observer = new ResizeObserver(() => handleResize(container));
            observer.observe(container);
            handleResize(container);
        }

        onCleanup(() => {
            scroller.removeEventListener("scroll", handleScroll);
            if (observer) observer.disconnect();
        });
    });

    createEffect(() => {
        const paddingTop = visibleIndices().start * rowHeight();
        const paddingBottom = (props.items.length - (visibleIndices().end + 1)) * rowHeight();

        const el = containerRef();
        if (el) {
            el.style.paddingTop = `${paddingTop}px`;
            el.style.paddingBottom = `${paddingBottom}px`;
        }
    });

    createEffect(() => {
        props.items;
        handleScroll();
    });

    // computed values
    const visibleItems = createMemo(() => {
        const items = [];
        for (let i = visibleIndices().start; i <= visibleIndices().end; i++) {
            const item = props.items[i];
            if (item) items.push(item);
        }
        return items;
    });

    return (
        <div {...props.containerProps} ref={setContainerRef}>
            <For each={visibleItems()}>
                {(item, index) => (
                    <props.RowComponent item={item} index={visibleIndices().start + index()} class={ROW_CLASS} />
                )}
            </For>
        </div>
    );
}
