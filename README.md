
# BuddyBank — Frontend (React)

Un frontend **React 18** pour l’application bancaire _BuddyBank_. Il gère l’authentification **JWT**, la navigation par **rôles** (USER / ADMIN / MANAGER), l’accès aux fonctionnalités métiers (compte, transferts, utilisateurs, statistiques) et communique avec le backend via **Axios**.

> **Stack courte :** Create React App, React Router, Axios, Bootstrap, React‑Toastify.

---

## ✨ Fonctionnalités principales

- **Connexion / Inscription** (JWT) avec stockage du token dans `localStorage`.
- **Menus et routes par rôle** :
    - `ROLE_USER` : Dashboard, Transférer, Historique, Ajouter un ami, Compte, Profil.
    - `ROLE_ADMIN` : Dashboard admin, Statistiques, Transactions, Gestion des utilisateurs.
    - `ROLE_MANAGER` : Vue globale manager, Transactions, Liste/gestion des utilisateurs.
- **Protection de routes** via un composant `PrivateRoute`.
- **Intercepteur Axios** qui injecte automatiquement `Authorization: Bearer <token>`.
- **Pages clés** : AccountPage, AddFriendPage, AdminDashboardPage, AdminStatsPage, AdminUsersPage, CreateAccountPage, DashboardPage, HistoriquePage, HomePage, LoginPage, ManagerDashboardPage, ProfilePage, RegisterPage, TransfertPage, UserFormPage, UserListePage.
- **UI responsive** : feuilles CSS dédiées + Bootstrap ; media‑queries présentes.
- **Notifications** via React‑Toastify (succès/erreurs actions utilisateur).

---

## 🏗️ Architecture (extrait)

```
src/
  assets/
    css/                # styles globaux (App.css, index.css, style.css)
  components/
    layout/BuddyBankHeader.jsx
    PrivateRoute.jsx
  context/
    AuthContext.js      # gestion user + token + login/logout
  pages/                # écrans (Dashboard, Login, Register, Profile, ...)
  services/
    axiosConfig.js      # baseURL + intercepteur JWT
  AppRoutes.jsx         # définition des routes
  App.js, index.js
```

- **AuthContext** : stocke `user` et `token` dans `localStorage`, expose `login` / `logout`.
- **axiosConfig** : `baseURL = $REACT_APP_API_BASE_URL/api` + intercepteur JWT.
- **BuddyBankHeader** : **menu dynamique** selon `user.role`.
- **AppRoutes** : routes publiques/privées et **redirections** selon le rôle.

---

## 🔧 Prérequis

- **Node.js 18+** 
- **npm 9+** 

---

## ⚙️ Configuration

Créez un fichier `.env` à la racine du frontend (déjà présent dans l’archive) :

```env
REACT_APP_API_BASE_URL=https://buddybank-backend-4ca2e1485d45.herokuapp.com
GENERATE_SOURCEMAP=false
```

- En **local**, remplacez l’URL par celle de votre backend (ex. `http://localhost:8080`).
- Sur **Netlify **, définissez la **variable d’environnement** `REACT_APP_API_BASE_URL` dans le tableau de bord du service d’hébergement.

> **Important** : Les variables qui commencent par `REACT_APP_` sont injectées au build CRA.

---

## ▶️ Démarrage rapide (dev)

```bash
# 1) Installer les dépendances
npm install

# 2) Lancer le serveur de dev (http://localhost:3000)
npm start

# 3) Lancer les tests (React Testing Library)
npm test

# 4) Construire une version de production
npm run build
```

Scripts disponibles (extrait du `package.json`) :

- `start` — démarre le serveur de développement CRA.
- `build` — génère le build de production dans `build/`.
- `test` — lance la suite de tests avec React Testing Library.
- `eject` — **option CRA** (irréversible) : exporte la configuration Webpack/Babel.

---

## 🔐 Sécurité côté frontend

- **JWT** stocké dans `localStorage` (`user`, `token`).
- **Intercepteur Axios** : ajoute `Authorization: Bearer <token>` si présent.
- **PrivateRoute** : bloque l’accès aux pages protégées si l’utilisateur n’est pas connecté.
- **Redirection par rôle** après login (ex. ADMIN → `/admin-dashboard`, MANAGER → `/manager-dashboard`, USER → vérification de l’existence d’un compte puis `/dashboard` ou `/create-account`).

---

## 🌐 Endpoints utilisés (attendus côté backend)

Exemples vus dans le code :
- `POST /api/auth/login` — authentification, renvoie `{{ user, token }}`.
- `GET  /api/accounts/my` — récupère le compte du user connecté (USER).
- `GET  /api/manager/users-count`, `GET /api/manager/transactions` (MANAGER).
- `GET  /api/admin/stats`, `GET /api/admin/users` (ADMIN).
- Autres pages : création de compte, transfert, historique, gestion d’utilisateurs, etc.

> Assurez‑vous que votre backend expose ces routes et gère bien les **rôles**.

---

## 🎨 UI / UX

- **Bootstrap** pour une base de composants et la grille responsive.
- **CSS custom** (`src/assets/css/style.css`) : cartes, en‑têtes, tableaux, boutons.
- **Responsive** : media‑queries (ex. `@media (max-width: 600px) {{ ... }}`).

---

## ✅ Tests

- Dépendances présentes : React Testing Library (`@testing-library/*`) et `jest-dom`.
- Exemple d’exécution : `npm test` (watch mode par défaut).

---

## 🚀 Déploiement

- **Netlify** : build CRA classique (`npm run build`), puis déploiement de `build/`.
- Définissez `REACT_APP_API_BASE_URL` dans les variables d’environnement de l’hébergeur.
- Prévoir la **politique CORS** côté backend pour l’URL d’hébergement du frontend.

---

## 📁 Dépendances principales

- `@testing-library/dom`
- `@testing-library/jest-dom`
- `@testing-library/react`
- `@testing-library/user-event`
- `axios`
- `bootstrap`
- `react`
- `react-dom`
- `react-router-dom`
- `react-scripts`
- `react-toastify`
- `web-vitals`



---

## 🧭 Roadmap / Evolution vers V2

- Gestion d’erreurs et d’états de chargement plus fine (_skeletons_, placeholders).
- Composants UI réutilisables (cartes, tableaux, formulaires).
- Tests d’intégration des pages clés (Login, Dashboard par rôle, Transfert).
- Accessibilité (ARIA, focus, navigation clavier) et micro‑interactions.
- Internationalisation (fr/en) via `react-intl` ou `i18next`.
- Progressive Web App (PWA) si besoin d’offline léger.

---

## 🤝 Licence & crédits

Projet pédagogique dans le cadre d’un parcours CDA. Merci aux bibliothèques open‑source utilisées par BuddyBank.
