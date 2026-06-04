import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { EpisodeService } from "../services/episode.service";
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
import { RouterLink } from "@angular/router";
import { PaginatorComponent } from "../components/paginator.component";

@Component({
	selector: "app-episodes-list",
	standalone: true,
	imports: [ReactiveFormsModule, AsyncPipe, RouterLink, PaginatorComponent],
	template: `
    <h2>Épisodes</h2>

    <div class="filters">
      <input [formControl]="searchCtrl" type="text" placeholder="Rechercher par nom...">
    </div>

    @if (data$ | async; as res) {
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
    } @else {
      <p>Chargement...</p>
    }
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodesListComponent {
	private readonly episodeService = inject(EpisodeService);
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
			this.episodeService
				.getAll(p, name)
				.pipe(catchError(() => of({ info: { pages: 0, count: 0, next: null, prev: null }, results: [] }))),
		),
	);

	nextPage() {
		this.page.update(p => p + 1);
	}
}
