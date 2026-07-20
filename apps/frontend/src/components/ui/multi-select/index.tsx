import { createEffect, createSignal, For, Show } from "solid-js";
import { cn } from "~/components/utils";
import Popover from "../popover";

import "./styles.css";

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
    const [selectedItems, setSelectedItems] = createSignal(props.selected);

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
        if (isOpen) return;
        if (!props.immediate) {
            props.onChange(selectedItems());
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
                    {args.children}
                </button>
            )}
            onChange={handlePopoverChange}
        >
            <div class="multi-select-content">
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
        <label class="multi-select-option select-none">
            <span>{props.label ?? props.value}</span>
            <input role="option" type="checkbox" checked={checked()} onInput={() => props.onChange(!checked())} />

            <Show when={checked()}>
                <span class="checkmark">✓</span>
            </Show>
        </label>
    );
}
