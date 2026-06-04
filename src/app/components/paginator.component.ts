import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from "@angular/core";

@Component({
	selector: "app-paginator",
	standalone: true,
	template: `
    <div class="paginator">
      <button [disabled]="currentPage() === 1" (click)="prev.emit()">Précédent</button>
      <span>Page {{ currentPage() }} sur {{ totalPages() }}</span>
      <button [disabled]="currentPage() === totalPages()" (click)="next.emit()">Suivant</button>
    </div>
  `,
	styles: [
		`
    .paginator { display: flex; gap: 1rem; align-items: center; justify-content: center; margin: 1rem 0; }
  `,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
	currentPage = input.required<number>();
	totalPages = input.required<number>();
	prev = output<void>();
	next = output<void>();
}
