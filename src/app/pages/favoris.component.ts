import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FavorisService } from "../services/favoris.service";
import { CharacterCardComponent } from "../components/character-card.component";

@Component({
	selector: "app-favoris",
	standalone: true,
	imports: [CharacterCardComponent],
	template: `
    <h2>Mes Favoris</h2>

    @if (favorisService.nombre() > 0) {
      <div class="grid">
        @for (c of favorisService.favoris(); track c.id) {
          <app-character-card 
            [character]="c" 
            [isFavori]="true"
            (toggleFavori)="favorisService.toggle($event)">
          </app-character-card>
        }
      </div>
    } @else {
      <p>Vous n'avez pas encore de favoris. Allez dans la liste des personnages pour en ajouter !</p>
    }
  `,
	styles: [
		`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }
  `,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavorisComponent {
	readonly favorisService = inject(FavorisService);
}
