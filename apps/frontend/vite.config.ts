import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
    plugins: [tailwindcss(), solid()],
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "src"),
            "@app/shared": path.resolve(__dirname, "../shared/src"),
        },
    },
});
