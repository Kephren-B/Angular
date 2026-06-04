import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';
import { CharactersListComponent } from './pages/characters-list.component';
import { CharacterDetailComponent } from './pages/character-detail.component';
import { LocationsListComponent } from './pages/locations-list.component';
import { LocationDetailComponent } from './pages/location-detail.component';
import { EpisodesListComponent } from './pages/episodes-list.component';
import { EpisodeDetailComponent } from './pages/episode-detail.component';
import { NotFoundComponent } from './pages/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'characters', component: CharactersListComponent },
  { path: 'characters/:id', component: CharacterDetailComponent },
  { path: 'locations', component: LocationsListComponent },
  { path: 'locations/:id', component: LocationDetailComponent },
  { path: 'episodes', component: EpisodesListComponent },
  { path: 'episodes/:id', component: EpisodeDetailComponent },
  {
    path: 'favoris',
    loadComponent: () =>
      import('./pages/favoris.component').then((m) => m.FavorisComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact.component').then((m) => m.ContactComponent),
  },
  { path: '**', component: NotFoundComponent },
];