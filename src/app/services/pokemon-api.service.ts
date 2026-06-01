import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { map } from "rxjs";
import type { Observable } from "rxjs";

import type {
	PokemonDetail,
	PokemonListResponse,
	PokemonPreview,
} from "../models/pokemon.model";

@Injectable({
	providedIn: "root",
})
export class PokemonApiService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = "https://pokeapi.co/api/v2";

	getList(limit = 151): Observable<PokemonPreview[]> {
		return this.http
			.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}`)
			.pipe(
				map((response) =>
					response.results.map((pokemon) => {
						const id = Number(
							new URL(pokemon.url).pathname.split("/").filter(Boolean).pop(),
						);

						return {
							name: pokemon.name,
							id,
							image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
						} satisfies PokemonPreview;
					}),
				),
			);
	}

	getByName(name: string): Observable<PokemonDetail> {
		return this.http.get<PokemonDetail>(
			`${this.baseUrl}/pokemon/${encodeURIComponent(name)}`,
		);
	}
}
