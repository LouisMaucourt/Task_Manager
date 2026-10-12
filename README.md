# Task Manager

Application **fullstack** avec une **API REST typée** (Elysia + PostgreSQL) et un front React qui utilise TanStack Query pour le cache et la synchronisation des données.
Le but étant de faire un Task Manager pour mes besoins personneles,, avec pour amnbitions de rendre ceci modulaire.

## Stack

**Backend**
- [Bun](https://bun.sh) : runtime et serveur
- [Elysia](https://elysiajs.com) : framework API REST, avec validation et typage des routes
- [PostgreSQL](https://www.postgresql.org) : base de données (via `pg`)
- [Better Auth](https://better-auth.com) : authentification (inscription, connexion, sessions)

**Frontend**
- [React 19](https://react.dev) et [React Router](https://reactrouter.com)
- [TanStack Query](https://tanstack.com/query) : requêtes, cache, mutations et invalidation
- [Tailwind CSS 4](https://tailwindcss.com) et [shadcn/ui](https://ui.shadcn.com) : interface

**Outils**
- [Biome](https://biomejs.dev) : lint et formatage
- Docker Compose : base de données et serveur de développement

## Architecture

```
backend/          # client PostgreSQL, migrations
src/
  index.tsx       # serveur Bun + API Elysia
  lib/            # configuration Better Auth (serveur et client)
  modules/
    users/
      index.ts    # routes Elysia
      service.ts  # logique métier et accès base (serveur uniquement)
      model.ts    # schémas de validation et types
      api.ts      # fonctions fetch côté front (utilisées par TanStack Query)
  components/     # composants UI
```

Les types sont définis une seule fois dans `model.ts` et partagés entre le back et le front.

## Prérequis

- [Bun](https://bun.sh) >= 1.2
- [Docker](https://www.docker.com) et Docker Compose

## Configuration

Crée un fichier `.env` à la racine :

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=task_manager

# En local : localhost. Dans Docker (service "app") : remplacer par "db".
DATABASE_URL=postgres://postgres:postgres@localhost:5432/task_manager

BETTER_AUTH_SECRET=une-chaine-aleatoire-longue
BETTER_AUTH_URL=http://localhost:3000
```

## Installation

```bash
bun install
```

Lance la base de données :

```bash
docker compose up -d db
```

Applique les migrations :

```bash
bun run db:migrate
bunx @better-auth/cli migrate   # tables Better Auth (user, account, session...)
```

## Développement

```bash
bun dev
```

L'application est disponible sur http://localhost:3000.

Pour tout lancer avec Docker (base de données et serveur) :

```bash
docker compose up
```

## Production

```bash
bun run build
bun start
```

## Scripts

| Commande | Description |
|---|---|
| `bun dev` | Serveur de développement avec rechargement à chaud |
| `bun start` | Serveur en mode production |
| `bun run build` | Build du projet |
| `bun run db:migrate` | Exécute les migrations de la base |

## API

Toutes les routes sont préfixées par `/api`.

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/users` | Liste des utilisateurs |
| `POST` | `/api/auth/sign-up/email` | Inscription (Better Auth) |
| `POST` | `/api/auth/sign-in/email` | Connexion (Better Auth) |
| `GET` | `/api/auth/get-session` | Session courante (Better Auth) |