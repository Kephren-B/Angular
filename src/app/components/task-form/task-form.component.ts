import { Component, EventEmitter, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "app-task-form",
	standalone: true,
	imports: [FormsModule],
	template: `
    <form (ngSubmit)="onSubmit()" class="task-form">
      <input
        type="text"
        [(ngModel)]="newTaskTitle"
        name="taskTitle"
        placeholder="Ajouter une nouvelle tâche..."
        class="task-input"
        required
      />
      <button type="submit" class="add-btn">Ajouter</button>
    </form>
  `,
	styleUrl: "./task-form.component.scss",
})
export class TaskFormComponent {
	@Output() add = new EventEmitter<string>();
	newTaskTitle = "";

	onSubmit(): void {
		if (this.newTaskTitle.trim()) {
			this.add.emit(this.newTaskTitle.trim());
			this.newTaskTitle = "";
		}
	}
}
