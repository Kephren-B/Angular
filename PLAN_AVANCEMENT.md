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
- [x] **Pages (10/10 réalisées)**
   - [x] `dashboard` (Accueil)
   - [x] `characters-list`
   - [x] `character-detail`
   - [x] `locations-list`
   - [x] `location-detail`
   - [x] `episodes-list`
   - [x] `episode-detail`
   - [x] `favoris`
   - [x] `contact`
   - [x] `not-found`
- [ ] **Navigation & Routage**
  - [x] Configuration `app.routes.ts` (Redirection, Lazy loading)
  - [x] `character-detail` -> Liens vers Origine/Localisation/Épisodes
   - [x] `location-detail` -> Liste des résidents
   - [x] `episode-detail` -> Liste des personnages

## 🅲️ Bloc C — Interactions
- [x] **Recherche RxJS** (`debounceTime`, `distinctUntilChanged`, `switchMap`)
- [x] **Pagination** (Intégrée dans toutes les listes : characters, locations, episodes)
- [x] **Gestion des Favoris** (Signal réactif + Persistance LocalStorage)
- [x] **Dashboard** (Stats via `computed`)
- [x] **Formulaire de Contact** (Reactive Form avec Validators)

## 🅳️ Bloc D — Composants, Pipes & Qualité
- [x] **Composants "Dumb" (4/5 réalisés)**
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
- [x] 1. Smart vs Dumb
- [x] 2. OnPush & Immutabilité
- [ ] 3. Pipe Async & Memory Leaks
- [ ] 4. Singleton & ProvidedIn
- [ ] 5. Signal vs BehaviorSubject
- [ ] 6. SwitchMap vs MergeMap
- [ ] 7. Reactive Forms vs Template-driven
- [ ] 8. Gestion des relations via URL
- [ ] 9. Avantages du Lazy Loading
- [ ] 10. GraphQL vs REST

## 🌟 BONUS — GraphQL
- [x] Installation Apollo Angular
- [x] Requête `gql` pour une liste
- [ ] Explication de l'intérêt (Under-fetching)

---
**Note :** Le projet compile et fonctionne.

**Prochaine étape suggérée :** Rédiger les questions théoriques 1 et 2, puis marquer le bonus GraphQL comme complété.
