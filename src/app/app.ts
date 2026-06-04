import { Component, signal, inject } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { FavorisService } from "./services/favoris.service";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, RouterLink, RouterLinkActive],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
})
export class App {
	protected readonly title = signal("RM_Explorer");
	readonly favorisService = inject(FavorisService);
}
