import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { LocationService } from "../services/location.service";
import { CharacterService } from "../services/character.service";
import { Observable, forkJoin, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { AsyncPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Location } from "../models/location.model";
import { Character } from "../models/character.model";

import { toObservable } from "@angular/core/rxjs-interop";

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
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDetailComponent {
	private readonly locationService = inject(LocationService);
	private readonly characterService = inject(CharacterService);
	id = input.required<string>();

	data$ = toObservable(this.id).pipe(
		switchMap((id) => this.locationService.getById(+id)),
		switchMap((location) => {
			const residentIds = location.residents
				.map((url: string) => +(url.split("/").pop() || 0))
				.filter((id: number) => !isNaN(id));

			return forkJoin({
				location: of(location),
				residents: residentIds.length > 0
					? this.characterService.getMany(residentIds)
					: of([] as Character[]),
			});
		}),
	);
}