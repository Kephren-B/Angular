import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { EpisodeService } from "../services/episode.service";
import { CharacterService } from "../services/character.service";
import { Observable, forkJoin, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { AsyncPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Episode } from "../models/episode.model";
import { Character } from "../models/character.model";

import { toObservable } from "@angular/core/rxjs-interop";

@Component({
	selector: "app-episode-detail",
	standalone: true,
	imports: [AsyncPipe, RouterLink],
	template: `
    @if (data$ | async; as d) {
      <div class="detail">
        <h2>{{ d.episode.name }}</h2>
        <p>Épisode : {{ d.episode.episode }}</p>
        <p>Date de diffusion : {{ d.episode.air_date }}</p>

        <h3>Personnages ({{ d.characters.length }})</h3>
        @if (d.characters.length > 0) {
          <div class="grid">
            @for (character of d.characters; track character.id) {
              <div class="card">
                <h4>{{ character.name }}</h4>
                <p>Status : {{ character.status }}</p>
                <a [routerLink]="['/characters', character.id]">Voir le personnage</a>
              </div>
            }
          </div>
        } @else {
          <p>Aucun personnage</p>
        }
      </div>
    }
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeDetailComponent {
	private readonly episodeService = inject(EpisodeService);
	private readonly characterService = inject(CharacterService);
	id = input.required<string>();

	data$ = toObservable(this.id).pipe(
		switchMap((id) => this.episodeService.getById(+id)),
		switchMap((episode) => {
			const characterIds = episode.characters
				.map((url: string) => +(url.split("/").pop() || 0))
				.filter((id: number) => !isNaN(id));

			return forkJoin({
				episode: of(episode),
				characters: characterIds.length > 0
					? this.characterService.getMany(characterIds)
					: of([] as Character[]),
			});
		}),
	);
}