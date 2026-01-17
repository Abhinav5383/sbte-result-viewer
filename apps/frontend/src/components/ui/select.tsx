import { For } from "solid-js";
import { cn } from "~/components/utils";

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: {
        value: string;
        label: string;
    }[];
    class?: string;
    id?: string;
}

export function Select(props: SelectProps) {
    return (
        <select
            id={props.id}
            value={props.value}
            onChange={(e) => {
                props.onChange(e.target.value);
            }}
            class={cn(
                "no-focus-ring border-2 border-border focus-within:border-accent-bg rounded-md",
                props.class,
            )}
        >
            <For each={props.options}>
                {(option) => <option value={option.value}>{option.label}</option>}
            </For>
        </select>
    );
}
