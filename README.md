# WorkHub Web

WorkHub web client — home page, user profile and account editing.

## Stack

- Vue 3 + TypeScript
- Vite
- Vue Router
- Pinia
- Tailwind CSS
- Axios

## Running

### Development

```bash
pnpm install
pnpm dev
```

App is available at `http://localhost:5173`. API is proxied to `http://localhost:3000` (workhub-api).

### Build

```bash
pnpm build
pnpm preview
```

### Docker

```bash
docker compose build
docker compose up -d
```

App is available at `http://localhost:8081`.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API base URL | `/api` |
| `VITE_API_PROXY_TARGET` | Proxy target for `pnpm dev` | `http://localhost:3000` |

## Docker

| Variable | Description | Default |
|----------|-------------|---------|
| `API_HOST` | API host for nginx proxy | `host.docker.internal` |
| `API_PORT` | API port | `3000` |

## Structure

- `src/pages/` — pages (Home, Login, MyAccount, MyAccountEdit)
- `src/features/` — auth, profile
- `src/widgets/` — layout, sidebar
- `src/shared/` — UI components, API client
