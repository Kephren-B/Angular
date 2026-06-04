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
	styles: [
		`
    h2 { margin-bottom: 1.5rem; }
    form { display: flex; flex-direction: column; gap: 1rem; max-width: 500px; }
    input, textarea { padding: 0.75rem; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem; font-family: inherit; }
    input:focus, textarea:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15); }
    small { color: #dc2626; font-size: 0.85rem; }
    button[type=submit] { padding: 0.75rem; border: none; border-radius: 8px; background: #4f46e5; color: #fff; font-size: 1rem; cursor: pointer; }
    button[type=submit]:hover:not(:disabled) { background: #4338ca; }
    button[type=submit]:disabled { opacity: 0.5; cursor: not-allowed; }
    .success { padding: 1rem; background: #ecfdf5; border: 1px solid #6ee7b7; color: #065f46; border-radius: 8px; margin-bottom: 1rem; }
  `,
  	],
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
