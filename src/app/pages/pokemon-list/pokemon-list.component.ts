import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, map, of, startWith } from "rxjs";

import type { PokemonPreview } from "../../models/pokemon.model";
import { PokemonApiService } from "../../services/pokemon-api.service";

type PokemonListState =
	| { status: "loading"; items: PokemonPreview[]; error: null }
	| { status: "success"; items: PokemonPreview[]; error: null }
	| { status: "error"; items: PokemonPreview[]; error: string };

@Component({
	selector: "app-pokemon-list",
	imports: [RouterLink],
	templateUrl: "./pokemon-list.component.html",
	styleUrl: "./pokemon-list.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonListComponent {
	private readonly api = inject(PokemonApiService);

	private readonly loadingState: PokemonListState = {
		status: "loading",
		items: [],
		error: null,
	};

	private readonly errorState: PokemonListState = {
		status: "error",
		items: [],
		error: "Impossible de charger la liste des Pokémon.",
	};

	readonly search = signal("");
	readonly state = signal<PokemonListState>(this.loadingState);

	constructor() {
		this.api
			.getList()
			.pipe(
				map(
					(items): PokemonListState => ({
						status: "success",
						items,
						error: null,
					}),
				),
				startWith(this.loadingState),
				catchError(() => of(this.errorState)),
				takeUntilDestroyed(),
			)
			.subscribe((state) => this.state.set(state));
	}

	readonly filteredPokemons = computed(() => {
		const query = this.search().toLowerCase().trim();
		const pokemons = this.state().items;

		return query.length === 0
			? pokemons
			: pokemons.filter((pokemon) => pokemon.name.includes(query));
	});

	onSearch(event: Event): void {
		this.search.set((event.target as HTMLInputElement).value);
	}
}
