import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from "@angular/core";
import { CharacterService } from "../services/character.service";
import { EpisodeService } from "../services/episode.service";
import { ActivatedRoute } from "@angular/router";
import {
  switchMap,
  forkJoin,
  of,
  filter,
} from "rxjs";
import { AsyncPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { StatusPipe } from "../pipes/status.pipe";
import type { Location as LocationModel } from "../models/location.model";

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
        <h3>Épisodes ({{ d.episodes.length }})</h3>
        <ul class="episodes-list">
          @for (ep of d.episodes; track ep.id) {
            <li><a [routerLink]="['/episodes', ep.id]">{{ ep.episode }} - {{ ep.name }}</a></li>
          }
        </ul>
      </div>
    }
  `,
  styles: [
    `
    .detail { background: #fff; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .detail img { width: 220px; border-radius: 8px; margin-bottom: 1rem; }
    .detail h2 { margin-bottom: 0.5rem; font-size: 1.75rem; }
    .relations { margin: 1rem 0; }
    .relations a { color: #4f46e5; text-decoration: underline; }
    .episodes-list { list-style: none; display: grid; gap: 0.5rem; }
    .episodes-list li { padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 8px; background: #fafafa; }
    .episodes-list a { color: #4f46e5; }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDetailComponent {
  private readonly charService = inject(CharacterService);
  private readonly epiService = inject(EpisodeService);
  private readonly route = inject(ActivatedRoute);

  data$ = this.route.paramMap.pipe(
    filter((params) => params.has('id')),
    switchMap((params) => {
      const id = params.get('id')!;
      return this.charService.getById(+id).pipe(
        switchMap((character) => {
          const epiIds = (character.episode || []).map(
            (url: string) => +(url.split('/').pop() || 0),
          ).filter((n: number) => !isNaN(n));
          return forkJoin({
            character: of(character),
            episodes: epiIds.length > 0 ? this.epiService.getMany(epiIds) : of([]),
            originId: of(this.extractId(character.origin.url)),
            locationId: of(this.extractId(character.location.url)),
          });
        }),
      );
    }),
  );

  private extractId(url: string): number | null {
    if (!url) return null;
    const parts = url.split('/');
    return +parts[parts.length - 1] || null;
  }
}
