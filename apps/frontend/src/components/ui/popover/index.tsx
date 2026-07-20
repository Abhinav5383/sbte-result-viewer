import { createEffect, type JSX } from "solid-js";
import { cn } from "~/components/utils";

import "./styles.css";

interface PopoverProps {
    id: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    trigger: (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => JSX.Element;
    class?: string;
    children: JSX.Element;
}

export default function Popover(props: PopoverProps) {
    let popoverRef: HTMLDivElement | undefined;

    createEffect(() => {
        if (!popoverRef) return;
        if (props.isOpen) {
            popoverRef.showPopover();
        } else {
            popoverRef.hidePopover();
        }
    });

    return (
        <>
            <props.trigger
                popovertarget={props.id}
                class="__popover-trigger"
                style={{ "anchor-name": `--popover-${props.id}` }}
            />

            <div
                id={props.id}
                popover
                ref={popoverRef}
                class={cn(props.class, "__popover")}
                style={{ "position-anchor": `--popover-${props.id}` }}
                onToggle={(e) => {
                    props.setIsOpen(e.newState === "open");
                }}
            >
                {props.children}
            </div>
        </>
    );
}
