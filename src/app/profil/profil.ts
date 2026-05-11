import { Component } from "@angular/core";

@Component({
	selector: "app-profil",
	standalone: true,
	imports: [],
	templateUrl: "./profil.html",
	styleUrl: "./profil.scss",
})
export class Profil {
	nom = "moi";
	metier = "Lebensmittelüberwachungsassistent";
	photo = "https://i.pravatar.cc/240";

	contacter() {
		alert(`Contacter ${this.nom}`);
	}
}
