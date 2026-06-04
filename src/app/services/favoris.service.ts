import { Injectable, computed, signal, inject } from "@angular/core";
import { Character } from "../models/character.model";
import { StorageService } from "../services/storage.service";

@Injectable({ providedIn: "root" })
export class FavorisService {
	private readonly storage = inject(StorageService);
	private readonly STORAGE_KEY = "rm_favoris";

	// Signal pour la liste des favoris
	readonly favoris = signal<Character[]>(
		this.storage.get<Character[]>(this.STORAGE_KEY) || [],
	);

	// Computed pour le nombre total
	readonly nombre = computed(() => this.favoris().length);

	toggle(character: Character): void {
		const current = this.favoris();
		const index = current.findIndex((c) => c.id === character.id);

		if (index === -1) {
			const updated = [...current, character];
			this.favoris.set(updated);
			this.storage.set(this.STORAGE_KEY, updated);
		} else {
			const updated = current.filter((c) => c.id !== character.id);
			this.favoris.set(updated);
			this.storage.set(this.STORAGE_KEY, updated);
		}
	}

	isFavori(id: number): boolean {
		return this.favoris().some((c) => c.id === id);
	}
}
