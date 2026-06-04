import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { LocationService } from "../services/location.service";
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

@Component({
  selector: "app-locations-list",
  standalone: true,
	imports: [ReactiveFormsModule, AsyncPipe, RouterLink, PaginatorComponent],
  template: `
    <h2>Lieux</h2>
    <div class="filters">
      <input [formControl]="searchCtrl" type="text" placeholder="Rechercher un nom...">
    </div>

    @if (data$ | async; as res) {
      <div class="grid">
        @for (loc of res.results; track loc.id) {
          <a [routerLink]="['/locations', loc.id]" class="card">
            <h3>{{ loc.name }}</h3>
            <p>Type : {{ loc.type }}</p>
            <p>Dimension : {{ loc.dimension }}</p>
          </a>
        }
      </div>
      <app-paginator 
        [currentPage]="currentPage()" 
        [totalPages]="res.info.pages"
        (next)="nextPage()"
      />
    } @else {
      <p>Chargement...</p>
    }
  `,
  styles: [
    `
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; }
    .card { border: 1px solid #e0e0e0; border-radius: 12px; padding: 1rem; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
    .filters { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .filters input { padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem; min-width: 220px; }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsListComponent {
  private readonly locationService = inject(LocationService);
  private readonly page$ = new BehaviorSubject<number>(1);
  private readonly pageSignal = signal(1);
  readonly currentPage = this.pageSignal.asReadonly();

  searchCtrl = new FormControl("", { nonNullable: true });

  readonly data$ = this.searchCtrl.valueChanges.pipe(
    startWith(""),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((name) =>
      this.page$.pipe(
        switchMap((page: number) =>
          this.locationService.getAll(page, name).pipe(
            catchError(() => of({ info: { pages: 0, count: 0, next: null, prev: null }, results: [] })),
          ),
        ),
      ),
    ),
  );

  nextPage() {
    const next = this.page$.value + 1;
    this.page$.next(next);
    this.pageSignal.set(next);
  }
}
