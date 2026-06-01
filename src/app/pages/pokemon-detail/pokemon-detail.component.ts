import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { catchError, map, of, startWith, switchMap } from "rxjs";

import type { PokemonDetail } from "../../models/pokemon.model";
import { FavorisService } from "../../services/favoris.service";
import { PokemonApiService } from "../../services/pokemon-api.service";

type PokemonDetailState =
	| { status: "loading"; pokemon: null; error: null }
	| { status: "success"; pokemon: PokemonDetail; error: null }
	| { status: "error"; pokemon: null; error: string };

@Component({
	selector: "app-pokemon-detail",
	imports: [RouterLink],
	templateUrl: "./pokemon-detail.component.html",
	styleUrl: "./pokemon-detail.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailComponent {
	private readonly api = inject(PokemonApiService);

	private readonly loadingState: PokemonDetailState = {
		status: "loading",
		pokemon: null,
		error: null,
	};

	private readonly errorState: PokemonDetailState = {
		status: "error",
		pokemon: null,
		error: "Ce Pokémon est introuvable.",
	};

	readonly favoris = inject(FavorisService);
	readonly name = input.required<string>();
	readonly state = signal<PokemonDetailState>(this.loadingState);

	constructor() {
		toObservable(this.name)
			.pipe(
				switchMap((pokemonName) =>
					this.api.getByName(pokemonName).pipe(
						map(
							(pokemon): PokemonDetailState => ({
								status: "success",
								pokemon,
								error: null,
							}),
						),
						startWith(this.loadingState),
						catchError(() => of(this.errorState)),
					),
				),
				takeUntilDestroyed(),
			)
			.subscribe((state) => this.state.set(state));
	}
}
