import type { JSX } from "solid-js";
import { cn } from "~/components/utils";

const SIZES = {
    default: "min-h-10 text-base px-4",
    sm: "min-h-9 text-sm px-4",
    icon: "min-h-10 grid place-content-center aspect-square text-base p-0",
    "icon-sm": "min-h-9 grid place-content-center aspect-square text-sm p-0",
} as const;

const VARIANTS = {
    primary: "bg-accent-bg text-accent-bg-text hover:bg-accent-bg/90",
    "primary-alt": "bg-accent-fg/15 text-accent-fg hover:bg-accent-bg hover:text-accent-bg-text",
    "primary-alt-hover": "text-accent-fg hover:bg-accent-bg/15",
    secondary: "text-dim-fg hover:text-normal-fg hover:bg-zinc-100",
    danger: "bg-rose-500 text-rose-50 hover:bg-rose-500/90",
    "danger-alt": "bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-rose-50",
    "danger-alt-hover": "text-rose-500 hover:bg-rose-100",
    "danger-muted": "text-dim-fg hover:bg-rose-100 hover:text-rose-500 focus-visible:text-rose-500",
} as const;

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: keyof typeof SIZES;
    variant: keyof typeof VARIANTS;
}

export function Button(props: ButtonProps) {
    return (
        <button
            type="button"
            {...props}
            class={cn(
                "flex items-center gap-[0.37em] font-medium",
                VARIANTS[props.variant],
                SIZES[props.size ?? "default"],
                props.class,
            )}
            style={{
                "transition-property": "color, background, scale, transform",
                "transition-duration": "0.15s",
            }}
        >
            {props.children}
        </button>
    );
}
