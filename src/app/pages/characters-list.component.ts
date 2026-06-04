import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
	computed,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CharacterService } from "../services/character.service"; // Corrected path
import { FavorisService } from "../services/favoris.service"; // Corrected path
import {
	debounceTime,
	distinctUntilChanged,
	startWith,
	switchMap,
	catchError,
	of,
	combineLatest,
	map,
} from "rxjs";
import { AsyncPipe } from "@angular/common";
import { CharacterCardComponent } from "../components/character-card.component";
import { LoaderComponent } from "../components/loader.component";

@Component({
	selector: "app-characters-list",
	standalone: true,
	imports: [
		ReactiveFormsModule,
		AsyncPipe,
		CharacterCardComponent,
		LoaderComponent,
	],
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
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersListComponent {
	private readonly characterService = inject(CharacterService);
	readonly favorisService = inject(FavorisService);

	searchCtrl = new FormControl("", { nonNullable: true });
	statusCtrl = new FormControl("all", { nonNullable: true });

	readonly data$ = combineLatest([
		this.searchCtrl.valueChanges.pipe(
			startWith(""),
			debounceTime(300),
			distinctUntilChanged(),
		),
		this.statusCtrl.valueChanges.pipe(startWith("all")),
	]).pipe(
		switchMap(([name, status]) =>
			this.characterService
				.getAll(1, name, status)
				.pipe(catchError(() => of({ info: {}, results: [] }))),
		),
	);
}
