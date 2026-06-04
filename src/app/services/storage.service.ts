import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StorageService {
	get<T>(key: string): T | null {
		const data = localStorage.getItem(key);
		return data ? (JSON.parse(data) as T) : null;
	}

	set(key: string, value: unknown): void {
		localStorage.setItem(key, JSON.stringify(value));
	}

	remove(key: string): void {
		localStorage.removeItem(key);
	}
}
