# Rick & Morty Explorer

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.13.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## ❓ Questions théoriques

### 1. Smart vs Dumb (Container vs Presentation)
- **Smart/Container Component** : logique métier, appelle les services, gère l'état (`CharactersListComponent`, `CharacterDetailComponent`).
- **Dumb/Presentation Component** : UI uniquement, reçoit des `@Input()` et émet des `@Output()` (`CharacterCardComponent`, `PaginatorComponent`, `SearchBarComponent`).
- Bénéfice : séparation des responsabilités, réutilisabilité, testabilité.

### 2. OnPush & Immutabilité
- `ChangeDetectionStrategy.OnPush` : la détection de changement se déclenche uniquement si l'`@Input()` change de référence, si un évènement vient du composant, ou si un observable émet via `AsyncPipe`.
- L'immutabilité est donc requise : on ne modifie jamais un objet existant, on crée une nouvelle référence (`[...array]`, `Object.assign({}, obj)`) pour que la comparaison par référence détecte le changement.
- Un `signal()` reste réactif même avec `OnPush`.

### 3. Pipe Async & Memory Leaks
- L'`AsyncPipe` souscrit automatiquement à l'observable et se désabonne quand le composant est détruit (`ngOnDestroy` implicite).
- Un `subscribe()` manuel dans le TS nécessite un `unsubscribe()` explicite ou l'usage de `takeUntil`, `take(1)`, etc., sinon le composant peut causer une fuite mémoire.

### 4. Singleton & ProvidedIn
- `@Injectable({ providedIn: 'root' })` crée un singleton au niveau de l'injecteur racine.
- Le service est instancié une seule fois pour toute l'application et partagé par tous les composants qui l'injectent.
- Avantage : pas de risque d'avoir plusieurs instances contradictoires (utile pour `FavorisService` notamment).

### 5. Signal vs BehaviorSubject
- **Signal** : API native Angular 17+, synchronisée, pas de subscribe manuel. `signal()`, `computed()`, `effect()`.
- **BehaviorSubject** (RxJS) : nécessite un `subscribe()` pour réagir aux valeurs, gère un flux asynchrone, doit être complété/désabonné.
- Pour de l'état local UI (filtres, pagination, favoris) : préférer les signals. Pour des flux asynchrones complexes : RxJS.

### 6. SwitchMap vs MergeMap
- **SwitchMap** : abandonne la requête précédente et prend la nouvelle (idéal pour la recherche avec `debounceTime` pour ne garder que la dernière requête).
- **MergeMap** : garde toutes les requêtes en parallèle (utile quand on veut batch des appels indépendants).
- Dans ce projet, `switchMap` est utilisé dans les listes pour la recherche : si l'utilisateur tape vite, seules les requêtes correspondant aux derniers caractères sont exécutées.

### 7. Reactive Forms vs Template-driven
- **Reactive Forms** (utilisé ici) : logique de formulaire dans le composant (TS), validation centralisée, validation synchrone/asynchrone, facilement testable.
- **Template-driven** : logique dispersée dans le template, moins adapté aux formulaires complexes, validation limitée.
- Avantage Reactive : `FormControl`, `FormGroup`, `Validators`, binding explicite.

### 8. Gestion des relations via URL
- Les entités liées (origine, localisation, épisodes d'un personnage) sont représentées par des URLs dans l'API REST.
- On extrait l'ID depuis l'URL (`url.split('/').pop()`) pour appeler le service dédié (`LocationService`, `EpisodeService`).
- Alternative plus propre : un utilitaire `extractId(url: string): number` partagé.
- Cela évite de dupliquer les données et maintient la normalisation.

### 9. Avantages du Lazy Loading
- Chargement différé : seuls les composants nécessaires au premier rendu sont chargés initialement.
- Réduit la taille du bundle principal (ici : `contact` et `favoris` sont en lazy loading).
- Améliore le Temps de Premier Affichage (FCP) et le SEO.
- Sur des apps complexes, chaque feature module/page peut être lazy-loadée.

### 10. GraphQL vs REST
- **REST** : endpoints fixes, over-fetching ou under-fetching selon les endpoints, plusieurs requêtes pour les relations.
- **GraphQL** : le client demande exactement ce dont il a besoin (sous-fetching évité), une seule requête pour récupérer un personnage + ses épisodes, pas de versioning d'API.
- Inconvénient de GraphQL : complexité serveur, risque de requêtes trop lourdes si mal conçues (N+1).

---

## 🌟 BONUS — GraphQL
- [x] **Installation Apollo Angular** via `pnpm add @apollo/client graphql apollo-angular`
- [x] **Requête `gql`** : `src/app/services/graphql-character.service.ts` avec `query GetCharacters($page: Int)`.
- [x] **Intérêt (Under-fetching)** : Avec REST, `CharacterService.getAll()` récupère uniquement les champs de base du personnage, puis il faut des requêtes séparées pour les épisodes (`EpisodeService.getMany()`). Avec GraphQL, on pourrait récupérer dans une seule requête le personnage, sa localisation, et les épisodes associés (champs choisis par le client), éliminant l'under-fetching.
