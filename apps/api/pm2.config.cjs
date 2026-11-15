module.exports = {
	apps: [
		{
			name: "sbte-api",
			script: "bun",
			args: "run src/index.ts",
			cwd: ".",
			watch: false,
			autorestart: true,
			env: {
				NODE_ENV: "production",
			},
		},
	],
};
