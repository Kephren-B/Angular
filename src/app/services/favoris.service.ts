import { computed, effect, Injectable, signal } from "@angular/core";

const storageKey = "pokedex-favoris";

function readFavorites(): string[] {
	try {
		const raw = localStorage.getItem(storageKey);
		return raw ? (JSON.parse(raw) as string[]) : [];
	} catch {
		return [];
	}
}

@Injectable({
	providedIn: "root",
})
export class FavorisService {
	private readonly favorisState = signal<string[]>(readFavorites());

	readonly favoris = this.favorisState.asReadonly();
	readonly nombre = computed(() => this.favorisState().length);

	constructor() {
		effect(() => {
			localStorage.setItem(storageKey, JSON.stringify(this.favorisState()));
		});
	}

	estFavori(name: string): boolean {
		return this.favorisState().includes(name);
	}

	basculer(name: string): void {
		this.favorisState.update((list) =>
			list.includes(name)
				? list.filter((item) => item !== name)
				: [...list, name],
		);
	}
}
