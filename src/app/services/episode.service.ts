import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { Episode } from "../models/episode.model";

@Injectable({ providedIn: "root" })
export class EpisodeService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = "https://rickandmortyapi.com/api/episode";

	getAll(
		page: number = 1,
		name?: string,
	): Observable<ApiResponse<Episode>> {
		let params = new HttpParams().set("page", page.toString());
		if (name) params = params.set("name", name);
		return this.http.get<ApiResponse<Episode>>(this.apiUrl, { params });
	}

	getById(id: number): Observable<Episode> {
		return this.http.get<Episode>(`${this.apiUrl}/${id}`);
	}

	getMany(ids: number[]): Observable<Episode[]> {
		return this.http.get<Episode[]>(`${this.apiUrl}/${ids.join(",")}`);
	}
}
