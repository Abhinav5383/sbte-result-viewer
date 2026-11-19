import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
	plugins: [tailwindcss(), solid()],
	base: process.env.BASE_PATH,

	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3001",
				// target: "https://sbte-results-api.kabhinav.dev",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},

	resolve: {
		alias: {
			"~": path.resolve(__dirname, "src"),
			"@app/shared": path.resolve(__dirname, "../shared/src"),
		},
	},
});
