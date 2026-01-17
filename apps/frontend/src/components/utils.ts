import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function OrdinalSuffix(value: string | number): string {
    const num = typeof value === "string" ? Number.parseInt(value, 10) : value;

    if (Number.isNaN(num)) return "";

    // Handle 11, 12, 13 specially (they use "th")
    const lastTwo = num % 100;
    if (lastTwo >= 11 && lastTwo <= 13) {
        return "th";
    }

    switch (num % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}
