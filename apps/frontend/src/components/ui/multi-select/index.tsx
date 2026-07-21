import { createEffect, createSignal, For, Show } from "solid-js";
import { cn } from "~/components/utils";
import Popover from "../popover";

import "./styles.css";
import ChevronDown from "~/components/icons/chevron-down";

interface SelectOption {
    value: string;
    label?: string;
    description?: string;
}

interface SelectProps {
    id?: string;
    class?: string;
    options: SelectOption[];
    selected: string[];
    placeholder?: string;
    onChange: (selected: string[]) => void;
    immediate?: boolean;
}

export default function MultiSelect(props: SelectProps) {
    const [isOpen, setIsOpen] = createSignal(false);
    const [selectedItems, setSelectedItems] = createSignal(props.selected);
    let contentRef: HTMLDivElement | undefined;

    const selectedLabels = () => {
        const list: string[] = [];
        for (const op of selectedItems()) {
            const option = props.options.find((o) => o.value === op);

            if (option?.label) {
                list.push(option.label);
            } else {
                list.push(op);
            }
        }
        return list;
    };

    function handleChange(value: string, checked: boolean) {
        const setter = props.immediate ? props.onChange : setSelectedItems;

        if (checked) {
            setter([...selectedItems(), value]);
        } else {
            setter(selectedItems().filter((v) => v !== value));
        }
    }

    function handlePopoverChange(isOpen: boolean) {
        if (isOpen) {
            requestAnimationFrame(() => {
                // const firstOption = contentRef?.querySelector<HTMLElement>(".multi-select-option");
                // firstOption?.focus();
                contentRef?.focus();
            });
        }

        if (!isOpen && !props.immediate) {
            props.onChange(selectedItems());
        }
    }
    createEffect(() => {
        handlePopoverChange(isOpen());
    });

    function handleKeyDown(e: KeyboardEvent) {
        if (!contentRef) return;

        const options = Array.from(contentRef.querySelectorAll<HTMLElement>(".multi-select-option"));
        if (!options.length) return;

        const currentIndex = options.indexOf(document.activeElement as HTMLElement);

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                if (currentIndex < options.length - 1) {
                    options[currentIndex + 1]?.focus();
                }
                break;

            case "ArrowUp": {
                e.preventDefault();
                if (currentIndex > 0) {
                    options[currentIndex - 1]?.focus();
                }
                break;
            }

            case "Home":
                e.preventDefault();
                options[0]?.focus();
                break;

            case "End":
                e.preventDefault();
                options[options.length - 1]?.focus();
                break;

            case "Tab":
                e.preventDefault();
                setIsOpen(false);
                break;

            case "Enter":
            case " ":
                if (currentIndex !== -1) {
                    e.preventDefault();
                    options[currentIndex].click();
                }
                break;

            case "Escape":
                e.stopImmediatePropagation();
                break;
        }
    }

    createEffect(() => {
        setSelectedItems(props.selected);
    });

    return (
        <Popover
            id={`"multi-select-popover-${props.id}`}
            class="multi-select-popover"
            trigger={(args) => (
                <button type="button" {...args} class={cn(props.class, args.class)}>
                    <span class="text-start text-ellipsis overflow-hidden whitespace-nowrap">
                        <Show when={selectedLabels().length === 0}>{props.placeholder || "Select..."}</Show>
                        <Show when={selectedLabels().length === 1}>{selectedLabels()[0]}</Show>
                        <Show when={selectedLabels().length > 1}>
                            <span class="text-sm text-dim-fg">[{selectedLabels().length}] </span>
                            {selectedLabels().join(", ")}
                        </Show>
                    </span>

                    <span class="arrow">
                        <ChevronDown />
                    </span>
                </button>
            )}
            isOpen={isOpen()}
            setIsOpen={setIsOpen}
        >
            {/** biome-ignore lint/a11y/noStaticElementInteractions: meh */}
            <div class="multi-select-content" ref={contentRef} onKeyDown={handleKeyDown} tabindex={0}>
                <For each={props.options}>
                    {(option) => (
                        <Option
                            value={option.value}
                            label={option.label}
                            selected={selectedItems()}
                            onChange={(checked) => handleChange(option.value, checked)}
                        />
                    )}
                </For>
            </div>
        </Popover>
    );
}

interface OptionProps {
    value: string;
    label?: string;
    selected: string[];
    onChange: (checked: boolean) => void;
}

function Option(props: OptionProps) {
    const checked = () => props.selected.includes(props.value);

    return (
        <label class="multi-select-option select-none" tabindex={0}>
            <span>{props.label ?? props.value}</span>
            <input role="option" type="checkbox" checked={checked()} onInput={() => props.onChange(!checked())} />

            <Show when={checked()}>
                <span class="checkmark">✓</span>
            </Show>
        </label>
    );
}
