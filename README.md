# WorkHub Web

Customer-facing web app for WorkHub (auth, profile, companies, projects, tasks, invitations).

## Architecture

- **Vue 3**, **TypeScript**, **Vite**, **Vue Router**, **Pinia**, **Tailwind CSS**, **Axios**.
- **`pages/`** — routed screens; **`features/`** — domain UI and logic; **`widgets/`**, **`shared/`** — layout and API client.
- Production build talks to the API under **`/api`**; the client uses **`/api/v1`** as the versioned base (see `VITE_*` below). Nginx proxies `/api/` to the backend.

## Environment variables

**Docker** (`docker-compose.yml`): nginx proxies to the API using the first table. **Vite dev** optional `.env`: second table (defaults for build are also set in the `Dockerfile`).

### `.env` — Docker runtime (container)

| Key | Example value | Notes |
|-----|----------------|--------|
| `API_HOST` | `host.docker.internal` | API host from inside the container |
| `API_PORT` | `3000` | API port |

On Linux, `extra_hosts: host.docker.internal:host-gateway` is set in `docker-compose.yml`.

### `.env` — local dev (Vite, optional)

| Key | Example value | Notes |
|-----|----------------|--------|
| `VITE_API_BASE_URL` | `/api` | Public API prefix (no trailing slash) |
| `VITE_API_VERSION` | `v1` | Matches Nest URI version |
| `VITE_API_PROXY_TARGET` | `http://localhost:3000` | Dev server proxy target only |

## Run with Docker

Requires a reachable API at `API_HOST:API_PORT` (e.g. API on the host at `3000`).

```bash
docker compose up -d --build
```

- **App:** `http://localhost:8081`

Stop:

```bash
docker compose down
```
