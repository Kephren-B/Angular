import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Task } from "../../models/task.model";

@Component({
	selector: "app-task-item",
	standalone: true,
	imports: [CommonModule],
	template: `
    <div class="task-item" [class.done]="task.done">
      <input
        type="checkbox"
        [checked]="task.done"
        (change)="onToggle()"
        class="checkbox"
      />
      <span class="task-title">{{ task.title }}</span>
      <span class="task-date">{{ task.createdAt | date : 'short' }}</span>
      <button (click)="onDelete()" class="delete-btn" aria-label="Supprimer">
        🗑️
      </button>
    </div>
  `,
	styleUrl: "./task-item.component.scss",
})
export class TaskItemComponent {
	@Input({ required: true }) task!: Task;
	@Output() toggle = new EventEmitter<string>();
	@Output() delete = new EventEmitter<string>();

	onToggle(): void {
		this.toggle.emit(this.task.id);
	}

	onDelete(): void {
		this.delete.emit(this.task.id);
	}
}
