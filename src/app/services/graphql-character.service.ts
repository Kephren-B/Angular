import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Character } from "../models/character.model";
import { Info } from "../models/info.model";

const CHARACTERS_QUERY = gql`
	query GetCharacters($page: Int) {
		characters(page: $page) {
			info {
				count
				pages
				next
				prev
			}
			results {
				id
				name
				status
				species
				type
				gender
				origin {
					name
					url
				}
				location {
					name
					url
				}
				image
				episode
				url
			}
		}
	}
`;

interface CharactersResponse {
	characters: {
		info: Info;
		results: Character[];
	};
}

import { ApiResponse } from "../models/api-response.model";

@Injectable({ providedIn: "root" })
export class GraphQLCharacterService {
	constructor(private readonly apollo: Apollo) {}

	getAll(page: number = 1): Observable<ApiResponse<Character>> {
		return this.apollo
			.query<CharactersResponse>({
				query: CHARACTERS_QUERY,
				variables: { page },
			})
			.pipe(map((res) => res.data?.characters ?? { info: { count: 0, pages: 0, next: null, prev: null }, results: [] }));
	}
}
