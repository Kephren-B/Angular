# 🚀 Suivi d'avancement — Rick & Morty Explorer

## 🅰️ Bloc A — Modèles & Services
- [x] **Modèles (5/5)**
  - [x] `Info` (Pagination)
  - [x] `ApiResponse<T>` (Générique)
  - [x] `Character`
  - [x] `Location`
  - [x] `Episode`
- [x] **Services (5/5)**
  - [x] `CharacterService` (Méthodes getAll, getById, getMany)
  - [x] `LocationService`
  - [x] `EpisodeService`
  - [x] `FavorisService` (Signals: signal + computed)
  - [x] `StorageService` (LocalStorage)

## 🅱️ Bloc B — Pages & Navigation
- [ ] **Pages (6/10 réalisées)**
  - [x] `dashboard` (Accueil)
  - [x] `characters-list`
  - [x] `character-detail`
  - [ ] `locations-list` (❌ À faire)
  - [ ] `location-detail` (❌ À faire)
  - [ ] `episodes-list` (❌ À faire)
  - [ ] `episode-detail` (❌ À faire)
  - [x] `favoris`
  - [x] `contact`
  - [ ] `not-found` (❌ À faire)
- [ ] **Navigation & Routage**
  - [x] Configuration `app.routes.ts` (Redirection, Lazy loading)
  - [x] `character-detail` -> Liens vers Origine/Localisation/Épisodes
  - [ ] `location-detail` -> Liste des résidents (❌ À faire)
  - [ ] `episode-detail` -> Liste des personnages (❌ À faire)

## 🅲️ Bloc C — Interactions
- [x] **Recherche RxJS** (`debounceTime`, `distinctUntilChanged`, `switchMap`)
- [🌓] **Pagination** (Composant créé, mais intégration dans les listes à finaliser)
- [x] **Gestion des Favoris** (Signal réactif + Persistance LocalStorage)
- [x] **Dashboard** (Stats via `computed`)
- [x] **Formulaire de Contact** (Reactive Form avec Validators)

## 🅳️ Bloc D — Composants, Pipes & Qualité
- [ ] **Composants "Dumb" (3/5 réalisés)**
  - [x] `CharacterCardComponent`
  - [x] `SearchBarComponent` (Extrait de `characters-list`)
  - [x] `PaginatorComponent`
  - [x] `LoaderComponent`
  - [x] `ErrorMessageComponent`
- [x] **Pipes (2/2)**
  - [x] `StatusPipe` (Icones de statut)
  - [x] `TruncatePipe`
- [x] **Qualité Technique**
  - [x] `ChangeDetectionStrategy.OnPush` partout
  - [x] Utilisation du `AsyncPipe` (pas de subscribe manuel)
  - [x] TypeScript Strict (pas de `any`)

## ❓ Questions théoriques (README)
- [ ] 1. Smart vs Dumb
- [ ] 2. OnPush & Immutabilité
- [ ] 3. Pipe Async & Memory Leaks
- [ ] 4. Singleton & ProvidedIn
- [ ] 5. Signal vs BehaviorSubject
- [ ] 6. SwitchMap vs MergeMap
- [ ] 7. Reactive Forms vs Template-driven
- [ ] 8. Gestion des relations via URL
- [ ] 9. Avantages du Lazy Loading
- [ ] 10. GraphQL vs REST

## 🌟 BONUS — GraphQL
- [ ] Installation Apollo Angular
- [ ] Requête `gql` pour une liste
- [ ] Explication de l'intérêt (Under-fetching)

---
**Note :** Pour compiler, assure-toi que les fichiers manquants (`locations-list`, `not-found`, etc.) soient au moins créés ou retirés temporairement de `app.routes.ts`.

**Prochaine étape suggérée :** Créer les pages de listes pour les Lieux et les Épisodes pour compléter le Bloc B.