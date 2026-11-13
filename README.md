# SportSee

Tableau de bord sportif réalisé pour OpenClassrooms. Le frontend React et Recharts présente l’activité quotidienne, la durée des sessions, les performances, le score et les apports nutritionnels. Le dépôt est un fork du [projet de départ OpenClassrooms](https://github.com/OpenClassrooms-Student-Center/SportSee), qui fournit l’API Express et les données de démonstration.

[Démo Karl](https://drgyz.github.io/SportSee/user/12) · [Démo Cecilia](https://drgyz.github.io/SportSee/user/18)

L’interface cible les écrans de bureau à partir de 1024 × 780. Les pages Réglage et Communauté sont des maquettes.

## Démarrer la démo

Avec Node.js 24 et npm :

```sh
cd frontend
npm ci
npm run dev
```

Ouvrez `http://127.0.0.1:5173/`. Les profils Karl et Cecilia sont disponibles dans Accueil. Le frontend utilise les données locales par défaut, comme sur GitHub Pages.

## Utiliser l’API Express

Dans un premier terminal, à la racine du dépôt :

```sh
npm ci
npm start
```

Dans `frontend/`, copiez `.env.example` vers `.env`, puis démarrez ou redémarrez Vite. Cet exemple active `VITE_DATA_SOURCE=api` et utilise `http://localhost:3000`. Supprimez `.env` ou passez à `VITE_DATA_SOURCE=mock` pour revenir à la démo locale. `VITE_DEBUG=true` affiche les données normalisées et les détails des erreurs.

Les deux modes partagent les mêmes données de départ. Le fournisseur de données appelle en parallèle les quatre sources du profil, puis les adaptateurs convertissent les champs utilisés par les graphiques, dont `todayScore` et `score`.

## Vérifier

```sh
npm --prefix frontend run verify
```

La commande exécute les tests des adaptateurs et produit le build Vite. Le workflow GitHub Pages exécute cette vérification, compile en mode démo sous `/SportSee/` et ajoute une page de secours pour les liens directs vers un profil.

- `app/` contient les routes Express du projet de départ.
- `frontend/src/services/` contient les fournisseurs de données et les fixtures.
- `frontend/src/models/` contient les adaptateurs pour les graphiques.
- `frontend/src/components/charts/` contient les visualisations Recharts.
