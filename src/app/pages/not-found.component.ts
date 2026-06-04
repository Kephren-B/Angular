import {
	ChangeDetectionStrategy,
	Component,
} from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-not-found",
	standalone: true,
	imports: [RouterLink],
	template: `
    <div class="not-found">
      <h2>404</h2>
      <p>Page non trouvée</p>
      <a routerLink="/dashboard">Retour à l'accueil</a>
    </div>
  `,
	styles: [
		`
    .not-found { text-align: center; padding: 4rem 1rem; }
    .not-found h2 { font-size: 6rem; color: #4f46e5; margin: 0; }
    .not-found p { font-size: 1.25rem; color: #666; margin: 0.5rem 0 2rem; }
    .not-found a { display: inline-block; padding: 0.75rem 1.5rem; background: #4f46e5; color: #fff; border-radius: 8px; }
    .not-found a:hover { background: #4338ca; }
  `,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}