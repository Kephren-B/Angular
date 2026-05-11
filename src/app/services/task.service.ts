import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([
    {
      id: '1',
      title: 'Apprendre Angular',
      done: false,
      createdAt: new Date('2025-05-01'),
    },
    {
      id: '2',
      title: 'Construire une TodoList',
      done: false,
      createdAt: new Date('2025-05-02'),
    },
  ]);

  tasks$ = this.tasksSubject.asObservable();

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(title: string): void {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      done: false,
      createdAt: new Date(),
    };
    const currentTasks = this.tasksSubject.value;
    this.tasksSubject.next([...currentTasks, newTask]);
  }

  toggleTask(id: string): void {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    this.tasksSubject.next(updatedTasks);
  }

  deleteTask(id: string): void {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter((task) => task.id !== id);
    this.tasksSubject.next(filteredTasks);
  }
}
