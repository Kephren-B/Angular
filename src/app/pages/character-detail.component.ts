import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
} from "@angular/core";
import { CharacterService } from "../services/character.service";
import { EpisodeService } from "../services/episode.service";
import { toObservable } from "@angular/core/rxjs-interop";
import { switchMap, map, forkJoin, of } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { StatusPipe } from "../pipes/status.pipe";

@Component({
	selector: "app-character-detail",
	standalone: true,
	imports: [AsyncPipe, RouterLink, StatusPipe],
	template: `
    @if (data$ | async; as d) {
      <div class="detail">
        <img [src]="d.character.image" [alt]="d.character.name">
        <h2>{{ d.character.name }}</h2>
        <p>Status : {{ d.character.status | status }}</p>
        
        <div class="relations">
          <p>Origine : <a [routerLink]="['/locations', d.originId]">{{ d.character.origin.name }}</a></p>
          <p>Localisation : <a [routerLink]="['/locations', d.locationId]">{{ d.character.location.name }}</a></p>
        </div>

        <h3>Épisodes</h3>
        <ul>
          @for (ep of d.episodes; track ep.id) {
            <li><a [routerLink]="['/episodes', ep.id]">{{ ep.episode }} - {{ ep.name }}</a></li>
          }
        </ul>
      </div>
    }
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDetailComponent {
	id = input.required<string>(); // Bindé depuis l'URL
	private charService = inject(CharacterService);
	private epiService = inject(EpisodeService);

	data$ = toObservable(this.id).pipe(
		switchMap((id) => this.charService.getById(+id)),
		switchMap((character) => {
			// Extraction des IDs d'épisodes depuis les URLs
			const epiIds = character.episode.map(
				(url: string) => +(url.split("/").pop() || 0),
			);

			// forkJoin pour récupérer le personnage et ses épisodes liés
			return forkJoin({
				character: of(character),
				episodes: epiIds.length > 0 ? this.epiService.getMany(epiIds) : of([]),
				originId: of(this.extractId(character.origin.url)),
				locationId: of(this.extractId(character.location.url)),
			});
		}),
	);

	private extractId(url: string): number | null {
		if (!url) return null;
		const parts = url.split("/");
		return +parts[parts.length - 1];
	}
}
