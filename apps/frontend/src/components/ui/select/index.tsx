import CheckIcon from "lucide-solid/icons/check";
import { For, Show } from "solid-js";
import ChevronDown from "~/components/icons/chevron-down";
import { cn } from "~/components/utils";

import "./styles.css";

interface SelectProps {
    id?: string;
    class?: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    triggerClass?: string;
}

export interface SelectOption {
    value: string;
    label?: string;
}

export function Select(props: SelectProps) {
    const supportsFancySelect = () => CSS.supports("appearance", "base-select");
    const defaultClass = "no-focus-ring border-border focus-within:border-accent-bg";

    return (
        <Show
            when={supportsFancySelect()}
            fallback={
                <RegularSelect
                    id={props.id}
                    class={cn(defaultClass, props.class)}
                    options={props.options}
                    value={props.value}
                    onChange={props.onChange}
                    triggerClass={props.triggerClass}
                />
            }
        >
            <FancySelect
                id={props.id}
                class={cn(defaultClass, props.class)}
                options={props.options}
                value={props.value}
                onChange={props.onChange}
                triggerClass={props.triggerClass}
            />
        </Show>
    );
}

function FancySelect(props: SelectProps) {
    let ignoreClick = false;

    return (
        <select
            id={props.id}
            class={`select ${props.class}`}
            onChange={(e) => {
                props.onChange(e.currentTarget.value);
            }}
            onTouchStart={(e) => {
                if (e.target.matches("select:open")) {
                    ignoreClick = true;
                }
            }}
            onTouchEnd={(e) => {
                if (ignoreClick) {
                    e.preventDefault();
                    ignoreClick = false;
                }
            }}
        >
            <button type="button" class={cn("select-trigger", props.triggerClass)}>
                {/* @ts-expect-error */}
                <selectedcontent></selectedcontent>
                <span class="arrow">
                    <ChevronDown />
                </span>
            </button>

            <For each={props.options}>
                {(option) => (
                    <option value={option.value} selected={option.value === props.value}>
                        <CheckIcon class="checkmark" stroke-width="3" />
                        <span class="opt-content">{option.label ?? option.value}</span>
                    </option>
                )}
            </For>
        </select>
    );
}

function RegularSelect(props: SelectProps) {
    return (
        <select
            id={props.id}
            class={`select ${props.class}`}
            onChange={(e) => {
                props.onChange(e.currentTarget.value);
            }}
        >
            <For each={props.options}>
                {(option) => (
                    <option value={option.value} selected={option.value === props.value}>
                        {option.label || option.value}
                    </option>
                )}
            </For>
        </select>
    );
}
