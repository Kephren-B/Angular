import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { EpisodeService } from "../services/episode.service";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  catchError,
  of,
} from "rxjs";
import { AsyncPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { PaginatorComponent } from "../components/paginator.component";
import { ErrorMessageComponent } from "../components/error-message.component";
import { LoaderComponent } from "../components/loader.component";

@Component({
  selector: "app-episodes-list",
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink, PaginatorComponent, ErrorMessageComponent, LoaderComponent],
  template: `
    <h2>Épisodes</h2>
    <div class="filters">
      <input [formControl]="searchCtrl" type="text" placeholder="Rechercher par nom...">
    </div>

    @if (error(); as err) {
      <app-error-message 
        [message]="err" 
        [showRetry]="true" 
        (retry)="retry()" 
      />
    } @else if (data$ | async; as res) {
      <div class="grid">
        @for (ep of res.results; track ep.id) {
          <a [routerLink]="['/episodes', ep.id]" class="card">
            <h3>{{ ep.name }}</h3>
            <p>Épisode : {{ ep.episode }}</p>
            <p>Date de diffusion : {{ ep.air_date }}</p>
          </a>
        }
      </div>
      <app-paginator 
        [currentPage]="currentPage()" 
        [totalPages]="res.info.pages"
        (next)="nextPage()"
      />
    }

    @if (loading()) {
      <app-loader></app-loader>
    }
  `,
  styles: [
    `
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; }
    .card { border: 1px solid #e0e0e0; border-radius: 12px; padding: 1rem; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.05); transition: transform 0.15s ease, box-shadow 0.15s ease; cursor: pointer; }
    .card:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.1); }
    h3 { margin: 0 0 0.5rem; font-size: 1.1rem; }
    p { color: #666; margin: 0.25rem 0; }
    .filters { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .filters input { padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem; min-width: 220px; }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodesListComponent {
  private readonly episodeService = inject(EpisodeService);
  private readonly page$ = new BehaviorSubject<number>(1);
  private readonly pageSignal = signal(1);
  readonly currentPage = this.pageSignal.asReadonly();
  readonly error = signal<string | null>(null);
  readonly loading = signal(true);

  searchCtrl = new FormControl("", { nonNullable: true });

  readonly data$ = this.searchCtrl.valueChanges.pipe(
    startWith(""),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((name) => {
      this.loading.set(true);
      this.error.set(null);
      return this.page$.pipe(
        switchMap((page: number) =>
          this.episodeService.getAll(page, name).pipe(
            catchError((err) => {
              this.error.set(err.message ?? "Erreur lors du chargement des épisodes");
              this.loading.set(false);
              return of({ info: { pages: 0, count: 0, next: null, prev: null }, results: [] });
            }),
          ),
        ),
      );
    }),
  );

  constructor() {
    this.data$.subscribe({
      complete: () => this.loading.set(false),
      error: (err) => {
        this.error.set(err?.message ?? "Erreur inattendue");
        this.loading.set(false);
      },
    });
  }

  retry(): void {
    this.error.set(null);
    this.loading.set(true);
    const name = this.searchCtrl.value;
    const page = this.page$.value;
    this.episodeService.getAll(page, name).pipe(
      catchError((err) => {
        this.error.set(err.message ?? "Erreur lors du chargement des épisodes");
        this.loading.set(false);
        return of({ info: { pages: 0, count: 0, next: null, prev: null }, results: [] });
      }),
    ).subscribe();
  }

  nextPage() {
    const next = this.page$.value + 1;
    this.page$.next(next);
    this.pageSignal.set(next);
  }
}
