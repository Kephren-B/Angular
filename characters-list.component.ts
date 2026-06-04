import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
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
import { SearchBarComponent } from "../components/search-bar.component";

@Component({
	selector: "app-characters-list",
	standalone: true,
	imports: [
		ReactiveFormsModule,
		AsyncPipe,
		CharacterCardComponent,
		LoaderComponent,
		SearchBarComponent,
	],
	template: `
    <h2>Personnages</h2>
    
    <app-search-bar 
      [searchControl]="searchCtrl" 
      [statusControl]="statusCtrl" 
      placeholder="Rechercher un personnage...">
    </app-search-bar>

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
	// ... reste de la logique data$
}
