import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from "@angular/core";
import { EpisodeService } from "../services/episode.service";
import { CharacterService } from "../services/character.service";
import { ActivatedRoute } from "@angular/router";
import {
  switchMap,
  forkJoin,
  of,
  filter,
} from "rxjs";
import { AsyncPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Episode } from "../models/episode.model";
import { Character } from "../models/character.model";

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
  styles: [
    `
    .detail { background: #fff; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .detail h2 { margin-bottom: 0.5rem; font-size: 1.75rem; }
    .detail p { margin: 0.35rem 0; color: #555; }
    .detail h3 { margin: 1.5rem 0 0.75rem; font-size: 1.25rem; }
    .detail .card h4 { margin-bottom: 0.25rem; }
    .detail .card p { color: #888; }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeDetailComponent {
  private readonly episodeService = inject(EpisodeService);
  private readonly characterService = inject(CharacterService);
  private readonly route = inject(ActivatedRoute);

  data$ = this.route.paramMap.pipe(
    filter((params) => params.has('id')),
    switchMap((params) => {
      const id = params.get('id')!;
      return this.episodeService.getById(+id).pipe(
        switchMap((episode: Episode) => {
          const characterIds = (episode.characters || [])
            .map((url: string) => +(url.split('/').pop() || 0))
            .filter((n: number) => !isNaN(n));
          return forkJoin({
            episode: of(episode),
            characters: characterIds.length > 0
              ? this.characterService.getMany(characterIds)
              : of([]),
          });
        }),
      );
    }),
  );
}
