# SportSee

SportSee est un projet de tableau de bord utilisateur avec :
- une micro API backend (Express) sur le port `3000`
- une interface frontend (React + Recharts) sur le port `5173`

L'interface cible uniquement le desktop pour ce sprint (`>= 1024x780`).

## Prérequis

- Node.js (version LTS recommandée)
- npm ou yarn

## Installation du backend (racine du repo)

Depuis `SportSee/` :

```bash
npm install
npm run dev
```

Le backend démarre sur : `http://localhost:3000`

## Installation du frontend (`frontend/`)

Depuis `SportSee/frontend` :

```bash
npm install
npm run dev
```

Le frontend démarre sur : `http://127.0.0.1:5173`

## Déploiement GitHub Pages

La version déployée est disponible ici :

- `https://drgyz.github.io/SportSee/`

GitHub Pages héberge uniquement le frontend statique. Le workflow de déploiement utilise donc les données mockées (`VITE_DATA_SOURCE=mock`).
En local, la configuration livrée utilise l'API (`VITE_DATA_SOURCE=api`).

## Variables d'environnement du frontend

Avant de démarrer le frontend, copiez `frontend/.env.example` vers `frontend/.env`, puis ajustez les valeurs si besoin.
Par exemple, avec PowerShell :

```powershell
Copy-Item .env.example .env
```

- `VITE_DATA_SOURCE=mock|api` (configuration livrée : `api`)
- `VITE_API_BASE_URL=http://localhost:3000`
- `VITE_DEBUG=true|false` (valeur par défaut : `false`)

La configuration livrée utilise `VITE_DATA_SOURCE=api`, donc le backend doit être lancé sur le port `3000`.
Utilisez `VITE_DATA_SOURCE=mock` uniquement si vous voulez lancer le frontend sans backend.

## Utilisateurs de test

Deux utilisateurs de test sont disponibles :
- `/user/12`
- `/user/18`

Routes frontend :
- `http://127.0.0.1:5173/user/12`
- `http://127.0.0.1:5173/user/18`

Endpoints backend :
- `http://localhost:3000/user/12`
- `http://localhost:3000/user/18`
