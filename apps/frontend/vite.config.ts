import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import solid from "vite-plugin-solid";

export default defineConfig({
    plugins: [
        tailwindcss(),
        solid(),
        viteSingleFile({
            inlinePattern: ["**/index-*.js", "**/index-*.css"],
            useRecommendedBuildConfig: true,
            overrideConfig: {
                build: {
                    assetsDir: ""
                }
            }
        }),
    ],
    base: process.env.BASE_PATH,

    resolve: {
        alias: {
            "~": path.resolve(__dirname, "src"),
            "@app/shared": path.resolve(__dirname, "../shared/src"),
        },
    },
});
