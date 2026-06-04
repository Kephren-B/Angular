import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from "@angular/core";
import { Character } from "../models/character.model";
import { RouterLink } from "@angular/router";
import { StatusPipe } from "../pipes/status.pipe";

@Component({
	selector: "app-character-card",
	standalone: true,
	imports: [RouterLink, StatusPipe],
	template: `
    <div class="card">
      <img [src]="character().image" [alt]="character().name">
      <div class="content">
        <h3>{{ character().name }}</h3>
        <p>{{ character().status | status }} - {{ character().species }}</p>
        
        <div class="actions">
          <a [routerLink]="['/characters', character().id]">Détails</a>
          <button (click)="toggleFavori.emit(character())">
            {{ isFavori() ? '⭐' : '☆' }}
          </button>
        </div>
      </div>
    </div>
  `,
	styles: [
		`
    .card { border: 1px solid #ccc; border-radius: 8px; overflow: hidden; }
    img { width: 100%; display: block; }
    .content { padding: 1rem; }
    .actions { display: flex; justify-content: space-between; margin-top: 1rem; }
  `,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCardComponent {
	character = input.required<Character>();
	isFavori = input<boolean>(false);
	toggleFavori = output<Character>();
}
