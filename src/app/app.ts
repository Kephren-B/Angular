import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

import { FavorisService } from "./services/favoris.service";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, RouterLink, RouterLinkActive],
	templateUrl: "./app.html",
	styleUrls: ["./app.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
	protected readonly favoris = inject(FavorisService);
}
