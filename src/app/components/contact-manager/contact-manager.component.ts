import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContactService } from "../../services/contact.service";
import { Contact, NouveauContact } from "../../models/contact.model";

@Component({
	selector: "app-contact-manager",
	imports: [CommonModule],
	templateUrl: "./contact-manager.component.html",
	styleUrl: "./contact-manager.component.scss",
})
export class ContactManagerComponent implements OnInit {
	private service = inject(ContactService);

	contacts = signal<Contact[]>([]);
	loading = signal(true);
	error = signal<string | null>(null);

	// contact en cours d'édition (null = mode "ajout")
	enEdition = signal<Contact | null>(null);

	ngOnInit() {
		this.charger();
	}

	charger() {
		this.loading.set(true);
		this.error.set(null);
		this.service.getAll().subscribe({
			next: (data) => {
				this.contacts.set(data);
				this.loading.set(false);
			},
			error: () => {
				this.error.set(
					"Impossible de charger (json-server est-il lancé sur :3000 ?)",
				);
				this.loading.set(false);
			},
		});
	}

	// appelé par le formulaire
	enregistrer(form: { nom: string; email: string; tel: string }) {
		const enEdition = this.enEdition();

		if (enEdition) {
			// ---- UPDATE (PUT) ----
			const maj: Contact = { ...enEdition, ...form };
			this.service.update(maj).subscribe({
				next: (c) => {
					this.contacts.update((list) =>
						list.map((x) => (x.id === c.id ? c : x)),
					);
					this.annulerEdition();
				},
				error: () => this.error.set("Échec de la modification"),
			});
		} else {
			// ---- CREATE (POST) ----
			this.service.create(form as NouveauContact).subscribe({
				next: (c) => this.contacts.update((list) => [...list, c]),
				error: () => this.error.set("Échec de l'ajout"),
			});
		}
	}

	editer(contact: Contact) {
		this.enEdition.set(contact); // bascule le formulaire en mode édition
	}

	annulerEdition() {
		this.enEdition.set(null);
	}

	supprimer(contact: Contact) {
		if (!confirm(`Supprimer ${contact.nom} ?`)) return;

		this.service.delete(contact.id).subscribe({
			next: () =>
				this.contacts.update((list) => list.filter((c) => c.id !== contact.id)),
			error: () => this.error.set("Échec de la suppression"),
		});
	}
}
