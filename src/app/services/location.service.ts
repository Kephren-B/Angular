import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { Location } from "../models/location.model";

@Injectable({ providedIn: "root" })
export class LocationService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = "https://rickandmortyapi.com/api/location";

	getAll(
		page: number = 1,
		name?: string,
	): Observable<ApiResponse<Location>> {
		let params = new HttpParams().set("page", page.toString());
		if (name) params = params.set("name", name);
		return this.http.get<ApiResponse<Location>>(this.apiUrl, { params });
	}

	getById(id: number): Observable<Location> {
		return this.http.get<Location>(`${this.apiUrl}/${id}`);
	}
}
