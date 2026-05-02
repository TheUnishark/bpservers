# BP Server List

BP Server List is a browser-based server list for the game
[Broke Protocol](https://store.steampowered.com/app/696370/BROKE_PROTOCOL/).
It shows live public server data in a lightweight Vue app.

The hosted app is available at:
<https://theunishark.github.io/bpservers/>

## Features

- Live Broke Protocol server list with player counts and game version status.
- Filters for whitelist, validation, current version, empty servers, and full servers.
- Sorting by name, players, version, country, whitelist, validation, server size, or rank.
- Expandable server details with country names and formatted server metadata.
- Latest version and update notes fetched through the BP servers proxy.
- Filter preferences saved locally in the browser.

## Data Sources

Server data, game version, and update notes are fetched through
`https://bpservers-proxy.onrender.com`. This service proxies the game's master
server so the browser app can access the data without being blocked by the
master server's CORS restrictions.

## Getting Started

Install dependencies:

```sh
npm install
```

Run the development server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

## Quality Checks

Run linting:

```sh
npm run lint
```

Run formatting checks:

```sh
npm run format:check
```

Run the full validation pipeline:

```sh
npm run validate
```

## Deployment

The Vite base path is configured as `/bpservers/` for GitHub Pages deployment.
Production files are generated in `dist/` by `npm run build`.
