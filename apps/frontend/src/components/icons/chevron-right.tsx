import type { ComponentProps } from "solid-js";

export function ChevronRightIcon(props: ComponentProps<'svg'>) {
    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: _-_
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            {...props}
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
