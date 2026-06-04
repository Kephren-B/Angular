import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from "@angular/core";

@Component({
	selector: "app-error-message",
	standalone: true,
	template: `
    <div class="error-container">
      <p>{{ message() }}</p>
      @if (showRetry()) {
        <button (click)="retry.emit()">Réessayer</button>
      }
    </div>
  `,
	styles: [
		`
    .error-container { background-color: #ffe0e0; border: 1px solid #ffb3b3; color: #d32f2f; padding: 1rem; border-radius: 4px; text-align: center; }
    button { margin-top: 0.5rem; padding: 0.5rem 1rem; cursor: pointer; }
  `,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
	message = input.required<string>();
	showRetry = input<boolean>(false);
	retry = output<void>();
}
