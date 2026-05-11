import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Hello } from "./hello/hello";
import { Profil } from "./profil/profil";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, Hello, Profil],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
})
export class App {
	protected readonly title = signal("Angular 21");
}
