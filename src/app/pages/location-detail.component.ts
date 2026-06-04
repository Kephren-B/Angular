import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from "@angular/core";
import { LocationService } from "../services/location.service";
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
import type { Location as LocationModel } from "../models/location.model";
import { Character } from "../models/character.model";

@Component({
  selector: "app-location-detail",
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  template: `
    @if (data$ | async; as d) {
      <div class="detail">
        <h2>{{ d.location.name }}</h2>
        <p>Type : {{ d.location.type }}</p>
        <p>Dimension : {{ d.location.dimension }}</p>
        <h3>Résidents ({{ d.residents.length }})</h3>
        @if (d.residents.length > 0) {
          <div class="grid">
            @for (resident of d.residents; track resident.id) {
              <div class="card">
                <h4>{{ resident.name }}</h4>
                <p>Status : {{ resident.status }}</p>
                <a [routerLink]="['/characters', resident.id]">Voir le personnage</a>
              </div>
            }
          </div>
        } @else {
          <p>Aucun résident</p>
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
export class LocationDetailComponent {
  private readonly locationService = inject(LocationService);
  private readonly characterService = inject(CharacterService);
  private readonly route = inject(ActivatedRoute);

  data$ = this.route.paramMap.pipe(
    filter((params) => params.has('id')),
    switchMap((params) => {
      const id = params.get('id')!;
      return this.locationService.getById(+id).pipe(
        switchMap((location: LocationModel) => {
          const residentIds = (location.residents || [])
            .map((url: string) => +(url.split('/').pop() || 0))
            .filter((n: number) => !isNaN(n));
          return forkJoin({
            location: of(location),
            residents: residentIds.length > 0
              ? this.characterService.getMany(residentIds)
              : of([]),
          });
        }),
      );
    }),
  );
}
