# SBTE Result Viewer

A monorepo containing tools to bulk-download, parse, and display results from the SBTE polytechnic examinations.

Try it out: https://sbte-results.devabhinav.online

## Packages

- ### [Frontend](apps/frontend)
  A SolidJS web app that displays student results in a clean, filterable UI. Built into a **single standalone HTML file**, no server or external data source required. The results data is gzip-compressed, base64-encoded, and embedded directly into the HTML at build time.

- ### [Scraper](apps/scraper)
  A Bun + Hono server that downloads SBTE result PDFs in bulk, extracts the marks data from them, and serves it over HTTP. Results are cached locally to avoid redundant downloads on subsequent runs.

## Highlights

- **Large lists stay fast**: Results are virtualized so tens of thousands of rows render smoothly without bogging down the UI.
- **Shareable result cards**: The details dialog can export an image of a student's result for easy sharing or saving.


## How It Works

1. **Scraper** iterates over every college, branch, semester, and roll number combination and downloads the corresponding result PDF from the SBTE API.
2. Each PDF is parsed with `unpdf` to extract raw text, which is then structured into a typed `ParsedResult` object containing student info, subject-wise marks, grades, and SGPA.
3. Results are cached in `generated/saved-results.json` and invalid roll numbers are tracked in `generated/invalid-rolls.txt` so subsequent runs only fetch new data.
4. The scraper exposes the parsed data via a local HTTP endpoint (`GET /students-data` on port `5500`).
5. **Frontend build** fetches the data from that endpoint, encodes it as gzip + base64, and injects it into the HTML at build time using a Vite define, producing a fully self-contained HTML file.


## Development Setup

### Prerequisites

- [Bun](https://bun.sh/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Abhinav5383/sbte-result-viewer
   cd sbte-result-viewer
   ```
2. Install deps:
   ```bash
   bun install
   ```


### Running the scraper

Start the scraper server. On first run this will download and parse all results, which may take a while. Subsequent runs will use the local cache.

```bash
cd apps/scraper
bun run start
```

The server will be available at `http://localhost:5500`.

### Running the frontend (dev)

The dev server fetches live data from the scraper at `http://localhost:5500`, so make sure the scraper is running first.

```bash
cd apps/frontend
bun run dev
```

### Building the frontend

Builds a single self-contained `dist/index.html` with all results embedded. (The backend server must be running during the build)

```bash
cd apps/frontend
bun run build
```

## Tech Stack

| Package  | Tech |
|----------|------|
| Frontend | [SolidJS](https://www.solidjs.com/), [Tailwind CSS v4](https://tailwindcss.com/), [Vite](https://vite.dev/), [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile) |
| Scraper  | [Bun](https://bun.sh/), [Hono](https://hono.dev/), [unpdf](https://github.com/unjs/unpdf) |
