export interface PokemonListResponse {
	count: number;
	results: Array<{
		name: string;
		url: string;
	}>;
}

export interface PokemonPreview {
	name: string;
	id: number;
	image: string;
}

export interface PokemonDetail {
	id: number;
	name: string;
	height: number;
	weight: number;
	types: Array<{
		type: {
			name: string;
		};
	}>;
	stats: Array<{
		base_stat: number;
		stat: {
			name: string;
		};
	}>;
	sprites: {
		other: {
			"official-artwork": {
				front_default: string | null;
			};
		};
	};
}
