import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { BehaviorSubject, map } from "rxjs";
import { CharacterService } from "../services/character.service";
import { FavorisService } from "../services/favoris.service";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  catchError,
  of,
  combineLatest,
} from "rxjs";
import { AsyncPipe } from "@angular/common";
import { CharacterCardComponent } from "../components/character-card.component";
import { LoaderComponent } from "../components/loader.component";
import { PaginatorComponent } from "../components/paginator.component";

@Component({
  selector: "app-characters-list",
  standalone: true,
	imports: [ReactiveFormsModule, AsyncPipe, CharacterCardComponent, LoaderComponent, PaginatorComponent],
  template: `
    <h2>Personnages</h2>
    <div class="filters">
      <input [formControl]="searchCtrl" type="text" placeholder="Rechercher un nom...">
      <select [formControl]="statusCtrl">
        <option value="all">Tous les statuts</option>
        <option value="alive">Vivant</option>
        <option value="dead">Mort</option>
        <option value="unknown">Inconnu</option>
      </select>
    </div>

    @if (data$ | async; as res) {
      <div class="grid">
        @for (c of res.results; track c.id) {
          <app-character-card 
            [character]="c" 
            [isFavori]="favorisService.isFavori(c.id)"
            (toggleFavori)="favorisService.toggle($event)">
          </app-character-card>
        }
      </div>
    } @else {
      <app-loader></app-loader>
    }
    <app-paginator 
      [currentPage]="currentPage()" 
      [totalPages]="totalPages()"
      (next)="nextPage()"
    />
  `,
  styles: [
    `
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; }
    .filters { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .filters input, .filters select { padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem; min-width: 220px; }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersListComponent {
  private readonly characterService = inject(CharacterService);
  readonly favorisService = inject(FavorisService);

  searchCtrl = new FormControl("", { nonNullable: true });
  statusCtrl = new FormControl("all", { nonNullable: true });
  private readonly page$ = new BehaviorSubject<number>(1);
  private readonly pageSignal = signal(1);
  readonly currentPage = this.pageSignal.asReadonly();
  readonly totalPages = signal(0);

  readonly data$ = combineLatest([
    this.searchCtrl.valueChanges.pipe(
      startWith(""),
      debounceTime(300),
      distinctUntilChanged(),
    ),
    this.statusCtrl.valueChanges.pipe(startWith("all")),
    this.page$.asObservable(),
  ]).pipe(
    switchMap(([name, status, page]) =>
      this.characterService
        .getAll(page, name, status)
        .pipe(
          catchError(() => of({ info: { pages: 0, count: 0, next: null, prev: null }, results: [] })),
          map((res) => {
            this.totalPages.set(res.info.pages);
            return res;
          }),
        ),
    ),
  );

  nextPage() {
    const next = this.page$.value + 1;
    this.page$.next(next);
    this.pageSignal.set(next);
  }
}
