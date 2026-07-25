# SBTE Result Viewer

A monorepo containing tools to bulk-download, parse, and display results from the SBTE polytechnic examinations.

Try it out: https://abhinav5383.github.io/sbte-result-viewer

## Packages

- ### [Frontend](apps/frontend)
  A SolidJS web app that displays student results in a clean, filterable UI. A static frontend build with no external data source required. The results data is gzip-compressed, base64-encoded, and put into a single file which is fetched by the website once it loads.

- ### [Scraper](apps/scraper)
  A Bun + Hono server that downloads SBTE result PDFs in bulk, extracts the marks data from them, and serves it over HTTP. Results are cached locally to avoid redundant downloads on subsequent runs.


## How It Works

1. **Scraper** iterates over every college, branch, semester, and roll number combination and downloads the corresponding result PDF from the SBTE API.
2. Each PDF is parsed with `unpdf` to extract raw text, which is then structured into a typed `ParsedResult` object containing student info, subject-wise marks, grades, and SGPA.
3. Results are cached in `generated/saved-results.json` and invalid roll numbers are tracked in `generated/invalid-rolls.txt` so subsequent runs only fetch new data.
4. **Frontend build** encodes the results as gzip + base64, and adds it into the build.


## Development Setup

### Prerequisites

- [Bun](https://bun.sh/)

### Clone
1. The repo contains `lfs` objects so setup `git-lfs` first: \
    Follow the instructions at https://git-lfs.com

2. Clone the repository:
   ```bash
   git clone https://github.com/Abhinav5383/sbte-result-viewer
   cd sbte-result-viewer
   ```
2. Install deps:
   ```bash
   bun install
   ```


### Running the scraper

Run the scraper once if results JSON file is not available. On first run this will download and parse all results, which may take a while. Subsequent runs will use the local cache.

```bash
cd apps/scraper
bun run start
```

### Running the frontend (dev)

The scraper is only needed if new data needs to be fetched. Otherwise the frontend dev server work without it.

```bash
cd apps/frontend
bun run dev
```

### Building the frontend

```bash
cd apps/frontend
bun run build
```

## Tech Stack

| Package  | Tech |
|----------|------|
| Frontend | [SolidJS](https://www.solidjs.com/), [Tailwind CSS v4](https://tailwindcss.com/), [Vite](https://vite.dev/), [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile) |
| Scraper  | [Bun](https://bun.sh/), [Hono](https://hono.dev/), [unpdf](https://github.com/unjs/unpdf) |
