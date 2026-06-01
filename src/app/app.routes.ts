import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () =>
			import("./pages/pokemon-list/pokemon-list.component").then(
				(module) => module.PokemonListComponent,
			),
	},
	{
		path: "pokemon/:name",
		loadComponent: () =>
			import("./pages/pokemon-detail/pokemon-detail.component").then(
				(module) => module.PokemonDetailComponent,
			),
	},
	{
		path: "favoris",
		loadComponent: () =>
			import("./pages/favoris/favoris.component").then(
				(module) => module.FavorisComponent,
			),
	},
	{
		path: "**",
		redirectTo: "",
	},
];
