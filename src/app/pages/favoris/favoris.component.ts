import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";

import { FavorisService } from "../../services/favoris.service";

@Component({
	selector: "app-favoris",
	imports: [RouterLink],
	templateUrl: "./favoris.component.html",
	styleUrl: "./favoris.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavorisComponent {
	readonly favoris = inject(FavorisService);
}
