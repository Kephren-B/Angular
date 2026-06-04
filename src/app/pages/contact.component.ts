import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
	selector: "app-contact",
	standalone: true,
	imports: [ReactiveFormsModule],
	template: `
    <h2>Contact</h2>
    @if (successMessage()) {
      <p class="success">{{ successMessage() }}</p>
    }

    <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
      <input formControlName="nom" placeholder="Votre nom">
      @if (contactForm.controls.nom.invalid && contactForm.controls.nom.dirty) {
        <small>Minimum 3 caractères requis</small>
      }

      <input formControlName="email" placeholder="Email" type="email">
      
      <textarea formControlName="message" placeholder="Votre message"></textarea>
      @if (contactForm.controls.message.invalid && contactForm.controls.message.dirty) {
        <small>Le message doit faire au moins 10 caractères</small>
      }

      <button type="submit" [disabled]="contactForm.invalid">Envoyer</button>
    </form>
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
	private readonly fb = inject(FormBuilder);
	successMessage = signal("");

	contactForm = this.fb.nonNullable.group({
		nom: ["", [Validators.required, Validators.minLength(3)]],
		email: ["", [Validators.required, Validators.email]],
		message: ["", [Validators.required, Validators.minLength(10)]],
	});

	onSubmit(): void {
		if (this.contactForm.valid) {
			this.successMessage.set(
				`Merci ${this.contactForm.value.nom}, votre message a été envoyé !`,
			);
			this.contactForm.reset();
		}
	}
}
