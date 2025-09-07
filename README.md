# 📊 ExtrAI Dashboard

![CI](https://github.com/<org>/<repo>/actions/workflows/ci.yml/badge.svg)
![Docker](https://github.com/<org>/<repo>/actions/workflows/deploy-docker.yml/badge.svg)
Frontend web app for analytics, administration, and reporting of the ExtrAI platform. Built with Next.js (App Router) + TypeScript + Tailwind CSS + shadcn + Recharts.

## Features
	•	Authenticated dashboard consuming the ExtrAI BFF
	•	Responsive layout (sidebar/header) with reusable UI components
	•	Charts for activity, members, engagement
	•	API layer with typed fetch/axios helpers
	•	Lightweight state management (Zustand)

Tech Stack
	•	Next.js 14+ (App Router, SSR/ISR)
	•	TypeScript, ESLint
	•	Tailwind CSS + shadcn
	•	Recharts (charts), Zustand (state), Axios (HTTP)

---

## Getting Started

### Create the project
```
npx create-next-app@latest extrai-dashboard --typescript --eslint --src-dir --app --tailwind
cd extrai-dashboard
```
### Initialize git (optional)
```
git init
git remote add origin git@github.com:extrai/extrai-dashboard.git
```
### Install shadcn (new package)
```
npx shadcn@latest init
// Add a few base components (add more as you go)
npx shadcn@latest add button card input badge dropdown-menu navigation-menu
```
### Useful libraries
```
npm install recharts axios zustand
```
### Environment variables
```
Create .env.local:
```
## Base URL for the BFF/API
```
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
NEXT_PUBLIC_AUTH_AUDIENCE=""
NEXT_PUBLIC_AUTH_ISSUER=""
```

---

## Scripts
```
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "prepare": "husky install"
  }
}
```
Add Husky/commitlint later if desired; start simple.

---

## Project Structure
```
src/
  app/
    layout.tsx
    page.tsx
    (auth)/login/page.tsx        # optional: login route
    dashboard/page.tsx           # main dashboard
  components/
    layout/                      # navbar, sidebar, shell
    charts/                      # Recharts wrappers
    ui/                          # shadcn-generated components
  features/
    analytics/
    groups/
    users/
  lib/
    api.ts                       # axios instance / fetcher
    auth.ts                      # auth helpers (if needed)
    utils.ts
  store/
    useSession.ts
    useFilters.ts
  styles/
    globals.css
```

---

## Example: API helper (src/lib/api.ts)
```
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

// Optional: response interceptor for auth errors/logging
api.interceptors.response.use(
  (r) => r,
  (err) => {
    // TODO: handle 401/403 -> redirect to /login
    return Promise.reject(err);
  }
);
```

---

## Run Locally
```
npm run dev
// http://localhost:3000
```
## Build & Start
```
npm run build
npm run start
// http://localhost:3000
```

---

## Linting & Type Checking
```
npm run lint
npm run typecheck
```

---

## First Milestones (MVP)
	•	Layout shell (sidebar/header) + navigation
	•	Auth flow (login/logout) integrated with BFF
	•	Home dashboard with KPIs (groups, messages, active users)
	•	Analytics page with charts (volume/day, members growth, engagement)
	•	Users page (list/detail) reading from BFF

---

## Conventions
	•	Commits: Conventional Commits (e.g., feat(ui): add navigation menu)
	•	Components: colocate styles, prefer composition over inheritance
	•	API: all requests via src/lib/api.ts
	•	State: colocated when possible, promote to store/ only when shared

---

## 🧩 CI/CD (GitHub Actions + GHCR + Kubernetes)

### CI
- Executado em PRs e branch `main`.
- Jobs: `lint` → `typecheck` → `build`.
- Arquivo: `.github/workflows/ci.yml`.

### CD (Docker + GHCR)
- Ao fazer push na `main` ou abrir PR, o workflow:
  1) constrói a imagem Docker do extrai-dashboard;
  2) envia para o GitHub Container Registry (GHCR) com tags:
     - `ghcr.io/<org>/<repo>:main` (branch principal)
     - `ghcr.io/<org>/<repo>:sha-<commit>`
     - `ghcr.io/<org>/<repo>:pr-<número>`
- Arquivo: `.github/workflows/deploy-docker.yml`.
- Secret necessário no repositório:
  - `NEXT_PUBLIC_API_BASE_URL` (ex.: `https://bff.extrai.dev`)

### Deploy em Kubernetes
- Manifesto: `k8s/dashboard.yaml` (Deployment, Service, Ingress).
- Pré-requisitos:
  - Namespace: `extrai` (`kubectl create ns extrai`).
  - Secret de envs:  
    ```bash
    kubectl -n extrai create secret generic extrai-dashboard-env \
      --from-literal=NEXT_PUBLIC_API_BASE_URL="https://bff.extrai.dev"
    ```
  - Secret para pull de imagem privada (GHCR):  
    ```bash
    kubectl -n extrai create secret docker-registry ghcr-pull-secret \
      --docker-server=ghcr.io \
      --docker-username="<GITHUB_USERNAME>" \
      --docker-password="<GITHUB_PAT_com_read:packages>" \
      --docker-email="you@example.com"
    ```
- Aplicar manifesto:
  ```bash
  kubectl apply -f k8s/dashboard.yaml
  kubectl -n extrai rollout status deploy/extrai-dashboard
  ````

---

## Security Notes
	•	Never hardcode secrets; use environment variables
	•	Validate and sanitize user input in forms
	•	Use secure HTTP headers at the BFF level and behind a reverse proxy

---

## License

MIT (or company-internal) — choose what fits your project.
