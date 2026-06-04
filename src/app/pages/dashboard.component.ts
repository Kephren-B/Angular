import {
	ChangeDetectionStrategy,
	Component,
	inject,
	computed,
} from "@angular/core";
import { FavorisService } from "../services/favoris.service";
import { CharacterService } from "../services/character.service";
import { LocationService } from "../services/location.service";
import { EpisodeService } from "../services/episode.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { Character } from "../models/character.model";

@Component({
	selector: "app-dashboard",
	standalone: true,
	template: `
    <h1>Rick & Morty Explorer</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Global</h3>
        <p>Total Personnages : {{ charRes()?.info?.count || 0 }}</p>
        <p>Total Lieux : {{ locRes()?.info?.count || 0 }}</p>
        <p>Total Épisodes : {{ epiRes()?.info?.count || 0 }}</p>
      </div>

      <div class="stat-card">
        <h3>Mes Favoris ({{ favorisService.nombre() }})</h3>
        <p>🟢 Vivants : {{ statsFavoris().alive }}</p>
        <p>🔴 Morts : {{ statsFavoris().dead }}</p>
        <p>⚪ Inconnus : {{ statsFavoris().unknown }}</p>
      </div>
    </div>
  `,
	styles: [
		`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
    .stat-card { padding: 1rem; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9; }
  `,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
	readonly favorisService = inject(FavorisService);

	// Appels API pour les totaux globaux (convertis en signals)
	charRes = toSignal(inject(CharacterService).getAll());
	locRes = toSignal(inject(LocationService).getAll());
	epiRes = toSignal(inject(EpisodeService).getAll());

	// Statistiques des favoris calculées avec computed
	statsFavoris = computed(() => {
		const list = this.favorisService.favoris() as Character[];
		return {
			alive: list.filter((c: Character) => c.status === "Alive").length,
			dead: list.filter((c: Character) => c.status === "Dead").length,
			unknown: list.filter((c: Character) => c.status === "unknown").length,
		};
	});
}
