import type { JSX } from "solid-js";
import "./styles.css";
import ChevronDown from "~/components/icons/chevron-down";
import { cn } from "~/components/utils";

interface PopoverProps {
    id: string;
    trigger: (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => JSX.Element;
    children: JSX.Element;
    class?: string;
    onChange?: (open: boolean) => void;
}

export default function Popover(props: PopoverProps) {
    return (
        <>
            <props.trigger
                popovertarget={props.id}
                class="__popover-trigger"
                style={{ "anchor-name": `--popover-${props.id}` }}
            >
                <span class="arrow">
                    <ChevronDown />
                </span>
            </props.trigger>

            <div
                id={props.id}
                popover
                class={cn(props.class, "__popover")}
                style={{ "position-anchor": `--popover-${props.id}` }}
                onToggle={(e) => {
                    if (!props.onChange) return;
                    props.onChange(e.newState === "open");
                }}
            >
                {props.children}
            </div>
        </>
    );
}
