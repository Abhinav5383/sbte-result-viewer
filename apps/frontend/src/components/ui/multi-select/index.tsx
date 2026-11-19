import CheckIcon from "lucide-solid/icons/check";
import { createMemo, createSignal, For, Show } from "solid-js";
import ChevronDown from "~/components/icons/chevron-down";
import Popover from "~/components/ui/popover";
import { cn } from "~/components/utils";
import { useDebouncedState } from "~/hooks/use-debounce";

import "./styles.css";

interface SelectOption {
	value: string;
	label?: string;
	description?: string;
	// extra strings that can be matched with this item (used for search)
	keywords?: string[];
}

interface SelectProps {
	id?: string;
	class?: string;
	options: SelectOption[];
	selected: string[];
	placeholder?: string;
	onChange: (selected: string[]) => void;
	immediate?: boolean;
	debounceDelay?: number;
	searchThreshold?: number | null;
}

export default function MultiSelect(props: SelectProps) {
	const [isOpen, setIsOpen] = createSignal(false);
	const [searchQuery, setSearchQuery] = createSignal("");
	let contentRef: HTMLDivElement | undefined;
	let searchRef: HTMLInputElement | undefined;

	const showSearch = () => {
		if (props.searchThreshold === null) return false;
		return props.options.length > (props.searchThreshold ?? 7);
	};

	const filteredOptions = createMemo(() => {
		const q = searchQuery().trim().toLowerCase();
		if (!q || !showSearch()) return props.options;
		return props.options.filter((o) =>
			[o.label ?? o.value, o.value, ...(o.keywords ?? [])].some((text) =>
				text.toLowerCase().includes(q),
			),
		);
	});

	const debounced = useDebouncedState(
		() => props.selected,
		(items) => props.onChange(items),
		{
			immediate: props.immediate ?? true,
			delay: props.debounceDelay ?? 500,
		},
	);

	const selectedLabels = () =>
		debounced.value().map((v) => props.options.find((o) => o.value === v)?.label || v);

	function handleChange(value: string, checked: boolean) {
		const current = debounced.value();
		const next = checked ? [...current, value] : current.filter((v) => v !== value);
		debounced.setValue(next);
	}

	function scrollToFirstChecked() {
		const target = contentRef?.querySelector<HTMLElement>(
			'.multi-select-option[data-checked="true"]',
		);

		target?.scrollIntoView({ behavior: "instant", block: "nearest" });
	}

	function setPopoverState(openState: boolean) {
		setIsOpen(openState);

		if (openState) {
			requestAnimationFrame(() => {
				(showSearch() ? searchRef : contentRef)?.focus({ preventScroll: true });
				scrollToFirstChecked();
			});
		} else {
			setSearchQuery("");
			debounced.flush();
		}
	}

	function handleSearchKeyDown(e: KeyboardEvent) {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			contentRef?.querySelector<HTMLElement>(".multi-select-option")?.focus();
		} else if (e.key === "Enter") {
			e.preventDefault();
			const matches = filteredOptions();
			if (matches.length === 1) {
				const value = matches[0].value;
				handleChange(value, !debounced.value().includes(value));
			}
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (!contentRef) return;

		const options = Array.from(
			contentRef.querySelectorAll<HTMLElement>(".multi-select-option"),
		);
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
				} else if (searchRef) {
					searchRef.focus();
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
				setPopoverState(false);
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

	return (
		<Popover
			id={`multi-select-popover-${props.id}`}
			class="multi-select-popover"
			trigger={(args) => (
				<button
					type="button"
					{...args}
					class={cn(props.class, args.class, "no-focus-ring")}
				>
					<span class="text-start text-ellipsis overflow-hidden whitespace-nowrap">
						<Show when={selectedLabels().length === 0}>
							{props.placeholder || "Select..."}
						</Show>
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
			onChange={setPopoverState}
		>
			<Show when={showSearch()}>
				<div class="multi-select-search">
					<input
						ref={searchRef}
						type="text"
						autocomplete="off"
						spellcheck={false}
						placeholder="Search..."
						aria-label="Search options"
						value={searchQuery()}
						onInput={(e) => setSearchQuery(e.currentTarget.value)}
						onKeyDown={handleSearchKeyDown}
						class="no-focus-ring border-border focus:border-accent-bg w-full text-sm"
					/>
				</div>
			</Show>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: meh */}
			<div
				class="multi-select-content"
				ref={contentRef}
				onKeyDown={handleKeyDown}
				tabindex={0}
			>
				<Show when={filteredOptions().length === 0}>
					<div class="px-3 py-2 text-sm text-dim-fg">No matches</div>
				</Show>
				<For each={filteredOptions()}>
					{(option) => (
						<Option
							value={option.value}
							label={option.label}
							selected={debounced.value()}
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
		<label class="multi-select-option" tabindex={0} data-checked={checked()}>
			<input
				role="option"
				type="checkbox"
				checked={checked()}
				onInput={() => props.onChange(!checked())}
			/>

			<CheckIcon class="checkmark" stroke-width="3" />

			<span>{props.label ?? props.value}</span>
		</label>
	);
}
