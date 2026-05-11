import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TaskService } from "../../services/task.service";
import { Task } from "../../models/task.model";
import { TaskItemComponent } from "../task-item/task-item.component";
import { TaskFormComponent } from "../task-form/task-form.component";

type FilterType = "all" | "active" | "completed";

@Component({
	selector: "app-task-list",
	standalone: true,
	imports: [CommonModule, TaskItemComponent, TaskFormComponent],
	templateUrl: "./task-list.component.html",
	styleUrl: "./task-list.component.scss",
})
export class TaskListComponent {
	private taskService = inject(TaskService);
	private filterSubject = new BehaviorSubject<FilterType>("all");

	readonly filter$ = this.filterSubject.asObservable();
	readonly tasks$: Observable<Task[]> = combineLatest([
		this.taskService.getTasks(),
		this.filterSubject.asObservable(),
	]).pipe(
		map(([tasks, filter]) => {
			switch (filter) {
				case "active":
					return tasks.filter((task) => !task.done);
				case "completed":
					return tasks.filter((task) => task.done);
				default:
					return tasks;
			}
		}),
	);

	setFilter(filter: FilterType): void {
		this.filterSubject.next(filter);
	}

	onAddTask(title: string): void {
		this.taskService.addTask(title);
	}

	onToggleTask(id: string): void {
		this.taskService.toggleTask(id);
	}

	onDeleteTask(id: string): void {
		this.taskService.deleteTask(id);
	}
}
