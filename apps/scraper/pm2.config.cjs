module.exports = {
    apps: [
        {
            name: "sbte-scraper",
            script: "bun",
            args: "run src/main.ts",
            cwd: ".",
            watch: false,
            autorestart: false,  // scraper runs once and exits; use cron for scheduling
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
