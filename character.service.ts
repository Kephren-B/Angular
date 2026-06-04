import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { Character } from "../models/character.model";

@Injectable({ providedIn: "root" })
export class CharacterService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = "https://rickandmortyapi.com/api/character";

	getAll(
		page: number = 1,
		name?: string,
		status?: string,
	): Observable<ApiResponse<Character>> {
		let params = new HttpParams().set("page", page.toString());
		if (name) params = params.set("name", name);
		if (status && status !== "all") params = params.set("status", status);

		return this.http.get<ApiResponse<Character>>(this.apiUrl, { params });
	}

	getById(id: number): Observable<Character> {
		return this.http.get<Character>(`${this.apiUrl}/${id}`);
	}

	getMany(ids: number[]): Observable<Character[]> {
		return this.http.get<Character[]>(`${this.apiUrl}/${ids.join(",")}`);
	}
}
