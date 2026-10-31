import ChevronUpIcon from "lucide-solid/icons/chevron-up";
import { createSignal, onCleanup, onMount } from "solid-js";

export function ScrollToTopButton() {
    const [scrollToTopVisible, setScrollToTopVisible] = createSignal(false);

    function handleScroll() {
        if (
            window.scrollY > window.innerHeight * 4 &&
            document.body.scrollHeight - window.scrollY > 3 * window.innerHeight
        ) {
            setScrollToTopVisible(true);
        } else {
            setScrollToTopVisible(false);
        }
    }

    onMount(() => {
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        onCleanup(() => {
            window.removeEventListener("scroll", handleScroll);
        });
    });

    return (
        <div
            class="fixed bottom-4 inset-e-4 z-50"
            style={{
                visibility: scrollToTopVisible() ? "visible" : "hidden",
            }}
        >
            <button
                type="button"
                class="flex items-center justify-center bg-accent-bg text-white h-12 aspect-square rounded-full shadow-lg"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
                <ChevronUpIcon class="size-6" />
            </button>
        </div>
    );
}
