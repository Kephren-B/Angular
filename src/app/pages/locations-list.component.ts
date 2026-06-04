import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LocationService } from "../services/location.service";
import { debounceTime,
	distinctUntilChanged,
	startWith,
	switchMap,
	catchError,
	of,
	combineLatest,
} from "rxjs";
import { toObservable } from "@angular/core/rxjs-interop";
import { AsyncPipe } from "@angular/common";
import { PaginatorComponent } from "../components/paginator.component";

@Component({
	selector: "app-locations-list",
	standalone: true,
	imports: [ReactiveFormsModule, AsyncPipe, PaginatorComponent],
	template: `
    <h2>Lieux</h2>

    <div class="filters">
      <input [formControl]="searchCtrl" type="text" placeholder="Rechercher un nom...">
    </div>

    @if (data$ | async; as res) {
      <div class="grid">
        @for (loc of res.results; track loc.id) {
          <div class="card">
            <h3>{{ loc.name }}</h3>
            <p>Type : {{ loc.type }}</p>
            <p>Dimension : {{ loc.dimension }}</p>
          </div>
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
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsListComponent {
	private readonly locationService = inject(LocationService);
	private readonly page = signal(1);
	readonly currentPage = this.page.asReadonly();

	searchCtrl = new FormControl("", { nonNullable: true });

	readonly data$ = combineLatest([
		this.searchCtrl.valueChanges.pipe(
			startWith(""),
			debounceTime(300),
			distinctUntilChanged(),
		),
		toObservable(this.page),
	]).pipe(
		switchMap(([name, p]) =>
			this.locationService
				.getAll(p, name)
				.pipe(catchError(() => of({ info: { pages: 0, count: 0, next: null, prev: null }, results: [] }))),
		),
	);

	nextPage() {
		this.page.update(p => p + 1);
	}
}
